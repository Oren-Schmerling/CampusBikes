package waxwing.campusbike.auth.service;

import waxwing.campusbike.types.dto.LoginRequest;
import waxwing.campusbike.Env;
import waxwing.campusbike.auth.util.PasswordUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.sql.*;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

  private final Env env;
  private final ObjectMapper objectMapper;

  @Autowired
  private DataSource dataSource;

  @Autowired
  public LoginService(Env env) {
    this.env = env;
    this.objectMapper = new ObjectMapper();
  }

  /*
   * Handles logging a user in
   */
  public int loginUser(LoginRequest login){
    String username = login.getUsername(), password = login.getPassword();
    int validate_res = validateUser(username, password);

    switch(validate_res){
        case 0:
            // valid user pass combo
            return 200;
        case 1:
            // pw does not match
            return 470;
        case 2:
            // user dne
            return 471;        
        case 3:
            // error case
            return 400;
        default:
            return 401;
    }
  }

  /*
   * This function will connect to the db and check if the user is there, and if so, if the stored pass matches
   * returns 0, 1, 2, 3
   * 0 -> valid user
   * 1 -> password does not match stored password
   * 2 -> user does not exist
   * 3 -> sql error
   */
  private int validateUser(String username, String password){
    // want to check hashed password in db
    String query = "SELECT password_hash FROM users WHERE username = ?";

    try (Connection conn = dataSource.getConnection();
      PreparedStatement stmt = conn.prepareStatement(query)) {
            // replace username in statement w/ input username
            stmt.setString(1, username);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                // extract password_hash column, check if input pass matches
                String storedHash = rs.getString("password_hash");  
                return PasswordUtil.verifyPassword(password, storedHash) ? 0 : 1;
            }else {
                // user not in db
                return 2; 
            }
        } catch (SQLException e) {
            // catch sql errors
            e.printStackTrace();
            return 3;
    }
  }
}