package waxwing.campusbike.auth;
import java.sql.*;
import io.github.cdimascio.dotenv.Dotenv;

// import waxwing.campusbike.types.LoginRequest;

public class LoginUtil {

    private static boolean nullCheck(String str){
        return str == null;
    }
    
    private static int validateUser(String username, String plain_pass){
        if (nullCheck(username)) return 2;
        if (nullCheck(plain_pass)) return 3;

        // retrieve from .env file in root folder
        Dotenv dotenv = Dotenv.configure()
                      .directory("./..") // relative to gradle src folder
                      .load();

        String user = dotenv.get("POSTGRES_USER");
        String password = dotenv.get("POSTGRES_PASSWORD");
        
        String query = "SELECT password_hash FROM users WHERE username = ?";

        try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/bikedb", user, password);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            // setString should handle sql injections, replaces ? w/ username
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password_hash");        
                return passwordUtil.verifyPassword(plain_pass, storedHash) ? 0 : 1;

                // this line below was for hardcoded tests
                // return storedHash.equals("hashed_pass") ? 0 : 1;
            } else {
                // user not found in db
                return 4;
            }
        } catch (SQLException e) {
            System.out.println("SQL Error, printing stack trace: ");
            e.printStackTrace();
            return 5;
        } catch (Exception e){
            System.out.println("Error: " + e);
            return 5;
        }

    }

    public static int loginHandler(String username, String plain_pass) {
        // need to add more error codes?
        int res = validateUser(username, plain_pass); 
        if (res == 0){
            return 200;
        } else if (res == 1) {
            System.out.println("Invalid user password combo.");
            return 400;
        } else if (res == 2){
            System.out.println("Null username.");
            return 400;
        } else if (res == 3){
            System.out.println("Null password.");
            return 400;
        } else if (res == 4){
            System.out.println("User not found.");
            return 400;
        } else {
            return 400;
        }
    }
}
