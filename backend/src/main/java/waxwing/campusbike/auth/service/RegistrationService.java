package waxwing.campusbike.auth.service;

import waxwing.campusbike.Env;
import waxwing.campusbike.auth.util.PasswordUtil;
import waxwing.campusbike.auth.util.VerificationUtil;
import waxwing.campusbike.auth.EmailValidity;
import waxwing.campusbike.types.User;
import waxwing.campusbike.types.dto.RegistrationRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.web.util.UriComponentsBuilder;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;

import javax.sql.DataSource;
import java.sql.ResultSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;

@Service
public class RegistrationService {

  private final Env env;
  private final ObjectMapper objectMapper;


  @Autowired
  private DataSource dataSource;

  @Autowired
  public RegistrationService(Env env) {
    this.env = env;
    this.objectMapper = new ObjectMapper();
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

  /*
   * Handles user registration.
   * Validates email and phone number, checks for existing users,
   * hashes the password, and uploads the new user to the database.
   * Returns appropriate status codes based on the outcome.
   */
  public int registerUser(RegistrationRequest request) {
    EmailValidity emailStatus = VerificationUtil.verifyEmail(request.getEmail());
    if (emailStatus == EmailValidity.INVALID)
      return 470;
    if (emailStatus == EmailValidity.NOT_UMASS)
      return 471;

    if (userExists(request.getUsername(), request.getEmail()))
      return 409;

    if (!isValidPassword(request.getPassword())) {
      return 400; // Bad Request
    }

    User newUser = new User(
        request.getUsername(),
        request.getEmail(),
        PasswordUtil.hashPassword(request.getPassword()));

    String phone = request.getPhone();
    if (phone != null && !phone.isBlank()) {
      PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
      try {
        PhoneNumber number = phoneUtil.parse(phone, "US");
        if (!phoneUtil.isValidNumber(number))
          return 423;
        newUser.setPhone(phone);
      } catch (NumberParseException e) {
        e.printStackTrace();
        return 494;
      }
    }

    int code = uploadUser(newUser);
    if (code == 1){
      return 201; // Created
    } else {
      return 500; // Internal Server Error
    }
  }

  /*
   * Check if a user with the given username or email already exists in the
   * database.
   * Returns true if such a user exists, false otherwise.
   */
  //This could probably be improved to show if either username or email exists
  //Instead of both but good for now
  private boolean userExists(String username, String email) {
    String checkSql = "SELECT COUNT(*) FROM users WHERE username = ? OR email = ?";

    try (Connection conn = dataSource.getConnection();
      PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
            checkStmt.setString(1, username);
            checkStmt.setString(2, email);

            ResultSet rs = checkStmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                return true;
            }else {
                return false; 
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return true;
    }
  }

  /*
   * Uploads the given user to the database.
   * Returns the HTTP status code from the POST request.
   */
  private int uploadUser(User user) {
    String sql = "INSERT INTO users (username, email, password_hash, phone) VALUES (?, ?, ?, ?)";

    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
        
        stmt.setString(1, user.getUsername());
        stmt.setString(2, user.getEmail());
        stmt.setString(3, user.getPassword_hash());
        stmt.setString(4, user.getPhone());
        
        int rowsAffected = stmt.executeUpdate();
        return rowsAffected; // usually 1 if success
    } catch (SQLException e) {
        e.printStackTrace();
        return -1; // indicate failure
    }
  }
}
