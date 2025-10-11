package waxwing.campusbike.auth;
import java.sql.*;
import io.github.cdimascio.dotenv.Dotenv;
import waxwing.campusbike.auth.util.PasswordUtil;

public class LoginUtil {

    // check if a string is null
    private static boolean nullCheck(String str){
        return str == null;
    }
    
    // this function will query the database and see if the username is in the db, and if the passwords match
    private static int validateUser(String username, String plain_pass){
        if (nullCheck(username)) return 2;
        if (nullCheck(plain_pass)) return 3;

        // retrieve from .env file in root folder
        Dotenv dotenv = Dotenv.configure()
                      .directory("./..") // relative to gradle src folder
                      .load();

        String db_user = dotenv.get("POSTGRES_USER");
        String db_pw = dotenv.get("POSTGRES_PASSWORD");
        String db_url = dotenv.get("POSTGRES_URL");
        
        // sql query, only selecting password_hash column for now
        String query = "SELECT password_hash FROM users WHERE username = ?";

        // connect to the db, prepare the query statement
        try (Connection conn = DriverManager.getConnection(db_url, db_user, db_pw);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            // setString should handle sql injections by putting username as a string, not as part of the sql command
            // replaces '?' w/ username variable
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            
            // for now, assume that usernames are unique, so only check next row
            if (rs.next()) {
                // extract password_hash, use passwordUtil to verify the hashed passwords
                String storedHash = rs.getString("password_hash");  
                return PasswordUtil.verifyPassword(plain_pass, storedHash) ? 0 : 1;
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
        // use different error codes?
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
