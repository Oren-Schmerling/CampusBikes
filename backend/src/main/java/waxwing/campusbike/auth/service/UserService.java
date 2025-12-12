package waxwing.campusbike.auth.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import waxwing.campusbike.Env;
import waxwing.campusbike.types.User;

@Service
public class UserService {

  private final Env env;
  private final ObjectMapper objectMapper;

  @Autowired
  private DataSource dataSource;

  public UserService(Env env) {
    this.env = env;
    this.objectMapper = new ObjectMapper();
  }

  public User returnInfo(String username) {
        String query = "SELECT * FROM users WHERE username = ?";

        try (Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query)) {
            
            // Set username parameter
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                // User found - create and return User object using the constructor
                Long id = rs.getLong("id");
                String dbUsername = rs.getString("username");
                String email = rs.getString("email");
                String phone = rs.getString("phone");
                
                User user = new User(id, dbUsername, email, phone);
                return user;
                
            } else {
                // User not found in database
                return null;
            }
            
        } catch (SQLException e) {
            // Log the error
            e.printStackTrace();
            return null;
        }
    }
}