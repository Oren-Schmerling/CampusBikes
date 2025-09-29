package waxwing.campusbike.auth;
import java.sql.*;

// import waxwing.campusbike.types.LoginRequest;

public class LoginUtil {
    
    private static boolean validateUser(String username, String plain_pass){
        
        String query = "SELECT password_hash FROM users WHERE username = ?";

        try (Connection conn = DriverManager.getConnection(
                "jdbc:postgresql://localhost:5432/bikedb", "${POSTGRES_USER}", "${POSTGRES_PASSWORD}");
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            // setString should handle sql injections
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password_hash");        
                return passwordUtil.verifyPassword(plain_pass, storedHash);
            } else {
                // user not found
                return false;
            }
        } catch (SQLException e) {
            // e.printStackTrace();
            return false;
        }

    }

    //
    public static int loginHandler(String username, String plain_pass) {
        try {
            validateUser(username, plain_pass);
        } catch (Exception e){
            return 400;
        }
        // everything is good
        return 200;
    }
}
