package waxwing.campusbike.auth.util;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Utility class for handling JSON Web Tokens (JWTs).
 *
 * This class provides static methods to generate, validate, and manage JWTs.
 * For handling sign-out, it uses a simple in-memory denylist. In a distributed
 * or production environment, a distributed cache like Redis or Memcached would be
 * a more robust solution for this.
 *
 * Required Gradle Dependencies:
 * implementation 'io.jsonwebtoken:jjwt-api:0.12.5'
 * runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.5'
 * runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.5'
 */
public final class JwtUtil {

    // IMPORTANT: In a real application, this secret key should be loaded from a
    // secure configuration source (e.g., environment variables, a vault) and should be
    // much more complex. It must be at least 256 bits (32 characters) long for HS256.
    private static final String JWT_SECRET = System.getenv("JWT_SECRET");
    
    // Token validity period: 24 hours
    private static final long EXPIRATION_TIME = 86_400_000; // 24 * 60 * 60 * 1000

    // A simple in-memory set to store IDs of invalidated tokens (logged out).
    // For production, use a distributed cache like Redis.
    private static final Set<String> tokenDenylist = new HashSet<>();

    // Private constructor to prevent instantiation of utility class
    private JwtUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Generates a new JWT for the given username.
     *
     * @param username The username (or subject) for whom the token is generated.
     * @return A signed JWT string.
     */
    public static String generateToken(String username) {
        SecretKey key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .subject(username) // The user the token belongs to
                .id(UUID.randomUUID().toString()) // jti: Unique ID for this token
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    /**
     * Validates a given JWT string.
     * The method checks for signature validity, expiration, and whether the
     * token has been denylisted (logged out).
     *
     * @param token The JWT string to validate.
     * @return true if the token is valid, false otherwise.
     */
    public static boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));

            Jws<Claims> claimsJws = Jwts.parser()
                                        .verifyWith(key)
                                        .build()
                                        .parseSignedClaims(token);

            // Check if the token has been denylisted
            String tokenId = claimsJws.getPayload().getId();
            if (tokenDenylist.contains(tokenId)) {
                System.out.println("Token is on the denylist (logged out).");
                return false;
            }

            return true;

        } catch (SignatureException e) {
            System.err.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        
        return false;
    }

    /**
     * Extracts the username (subject) from a given JWT.
     * This method does not perform full validation; it only parses the token.
     * Always call validateToken() before trusting the claims.
     *
     * @param token The JWT string.
     * @return The username (subject) from the token payload.
     */
    public static String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        
        Claims claims = Jwts.parser()
                            .verifyWith(key)
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();
                            
        return claims.getSubject();
    }

    /**
     * Invalidates a token by adding its unique identifier (JTI) to a denylist.
     * This is how you "remove" a token upon user sign-out. The token itself
     * remains valid until it expires, but this mechanism prevents it from being
     * used again in our system.
     *
     * @param token The JWT string to invalidate.
     */
    public static void invalidateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
            
            String tokenId = Jwts.parser()
                                .verifyWith(key)
                                .build()
                                .parseSignedClaims(token)
                                .getPayload()
                                .getId();
                                
            tokenDenylist.add(tokenId);
            System.out.println("Token with JTI " + tokenId + " has been invalidated.");
        } catch (Exception e) {
            // Log the error but don't throw, as the goal is just to invalidate.
            // The token might be expired or malformed already.
            System.err.println("Couldn't invalidate token: " + e.getMessage());
        }
    }
}