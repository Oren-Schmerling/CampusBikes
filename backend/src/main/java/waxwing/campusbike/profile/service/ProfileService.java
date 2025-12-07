package waxwing.campusbike.profile.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;

import waxwing.campusbike.Env;
import waxwing.campusbike.types.User;
import waxwing.campusbike.types.dto.accountChangeRequest;
import waxwing.campusbike.auth.EmailValidity;
import waxwing.campusbike.auth.util.PasswordUtil;
import waxwing.campusbike.auth.util.VerificationUtil;
import waxwing.campusbike.profile.controller.ProfileController;

@Service
public class ProfileService {
    private final Env env;
    private final ObjectMapper objectMapper;

  @Autowired
  private DataSource dataSource;

  private static final Logger log = LoggerFactory.getLogger(ProfileController.class);

  public ProfileService(Env env){
    this.env = env;
    this.objectMapper = new ObjectMapper();
  }

  public int changeUser(String jwtUsername, accountChangeRequest request){

    User dbUser = getUser(jwtUsername);

    // check to see if the email and phone number are valid
    EmailValidity emailStatus = VerificationUtil.verifyEmail(request.getEmail());
    if (emailStatus == EmailValidity.INVALID)
      return 470;
    if (emailStatus == EmailValidity.NOT_UMASS)
      return 471;

    if (!userExists(request.getUsername(), request.getEmail()))
      return 409;

    String phone = request.getPhone();
    if (phone != null && !phone.isBlank()) {
      PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
      try {
        PhoneNumber number = phoneUtil.parse(phone, "US");
        if (!phoneUtil.isValidNumber(number))
          return 423;
      } catch (NumberParseException e) {
        e.printStackTrace();
        return 494;
      }
    }

    if (request.getNew_password() != null){
        // check if password in request and password from db match
        if (!PasswordUtil.verifyPassword(request.getPassword(), dbUser.getPassword_hash())){
            // entered password is not the same
            return 400;
        }

        // check if new password is valid
        if (!isValidPassword(request.getNew_password())) {
            return 402; // Bad Request
        }

        int code = uploadUser(jwtUsername, request.getUsername(), request.getEmail(), request.getPhone(), PasswordUtil.hashPassword(request.getNew_password()));
        if (code == 1){
            // System.out.println("New user information uploaded, new password);
            log.info("Uploaded with password");
            return 200;
        } else {
            // System.out.println("New user information not uploaded");
            return 401;
        }
    } else {
        int code = uploadUserNoPassword(jwtUsername, request.getUsername(), request.getEmail(), request.getPhone());
        if (code == 1){
            // System.out.println("New user information uploaded, no new password");
            log.info("Uploaded with no password");
            return 200;
        } else {
            // System.out.println("New user information not uploaded");
            return 418;
        }
    }
  }

  private int uploadUserNoPassword(String oldUser, String user, String email, String phone){
    // TODO
    String sql = "UPDATE users SET username = ?, email = ?, phone = ? WHERE username = ?";

    try (Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) {

      stmt.setString(1, user);
      stmt.setString(2, email);
      stmt.setString(3, phone);
      stmt.setString(4, oldUser);

      int rowsAffected = stmt.executeUpdate();
      return rowsAffected; // usually 1 if success
    } catch (SQLException e) {
      e.printStackTrace();
      return -1; // indicate failure
    }
  }

  private int uploadUser(String oldUser, String user, String email, String phone, String hashed_pass){
    // TODO
     String sql = "UPDATE users SET username = ?, email = ?, phone = ?, password_hash = ? WHERE username = ?";

    try (Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) {

      stmt.setString(1, user);
      stmt.setString(2, email);
      stmt.setString(3, phone);
      stmt.setString(4, hashed_pass);
      stmt.setString(5, oldUser);

      int rowsAffected = stmt.executeUpdate();
      return rowsAffected; // usually 1 if success
    } catch (SQLException e) {
      e.printStackTrace();
      return -1; // indicate failure
    }
  }

private User getUser(String username) {
    String checkSql = "SELECT * FROM users WHERE username = ?";

    try (Connection conn = dataSource.getConnection();
         PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

        checkStmt.setString(1, username);
        ResultSet rs = checkStmt.executeQuery();

        if (rs.next()) {
            return new User(
                rs.getString("username"),
                rs.getString("email"),
                rs.getString("password_hash")
            );
        } else {
            return null;
        }

    } catch (SQLException e) {
        e.printStackTrace();
        return null;
    }
  }

    /*
   * Check if a user with the given username or email already exists in the
   * database.
   * Returns true if such a user exists, false otherwise.
   */
  // This could probably be improved to show if either username or email exists
  // Instead of both but good for now
  private boolean userExists(String username, String email) {
    String checkSql = "SELECT COUNT(*) FROM users WHERE username = ? OR email = ?";

    try (Connection conn = dataSource.getConnection();
        PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
      checkStmt.setString(1, username);
      checkStmt.setString(2, email);

      ResultSet rs = checkStmt.executeQuery();
      if (rs.next() && rs.getInt(1) > 0) {
        return true;
      } else {
        return false;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return true;
    }
  }

    /**
   * Checks if the password is valid.
   * A valid password must be at least 8 characters long,
   * contain at least one special character, and at least one number.
   *
   * @param password The password to validate.
   * @return true if valid, false otherwise.
   */
  public boolean isValidPassword(String password) {
    if (password == null || password.length() < 8) {
      return false;
    }
    boolean hasSpecial = password.matches(".*[!@#$%^&*()_+\\-\\[\\]{};':\"\\\\|,.<>/?].*");
    boolean hasDigit = password.matches(".*[0-9].*");
    return hasSpecial && hasDigit;
  }
}
