package waxwing.campusbike.auth;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


public class passwordUtil {
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null) {
            throw new IllegalArgumentException("Password and hash cannot be null");
        }
        return passwordEncoder.encode(plainPassword);
    }
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            throw new IllegalArgumentException("Password and hash cannot be null");
        }
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
}
