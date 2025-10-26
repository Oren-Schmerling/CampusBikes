package waxwing.campusbike.listing.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import waxwing.campusbike.Env;
import waxwing.campusbike.types.Bike;
import waxwing.campusbike.types.User;
import waxwing.campusbike.types.dto.BikeCreateRequest;

@Service
public class ListingService {

  private final Env env;
  private final ObjectMapper objectMapper;

  @Autowired
  private DataSource dataSource;

  public ListingService(Env env) {
    this.env = env;
    this.objectMapper = new ObjectMapper();
  }


  public int createBike(String username, BikeCreateRequest request){
    User user = getUser(username);
    
    Bike newBike = new Bike(
        user.getId(),
        request.getTitle(),
        request.getDescription(),
        request.getLocation(),
        request.getPricePerHour(),
        request.getLatitude(),
        request.getLongitude(),
        request.getStatus());

    int code = uploadBike(newBike);
    if (code == 1){
      return 201; // Created
    } else {
      return 500; // Internal Server Error
    }
  }
   /*
   * Uploads the given bike to the database.
   * Returns the HTTP status code from the POST request.
   */
  private int uploadBike(Bike bike) {
    String sql = "INSERT INTO bikes (owner_id, title, description, location, price_per_hour, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        stmt.setLong(1, bike.getOwnerId());
        stmt.setString(2, bike.getTitle());
        stmt.setString(3, bike.getDescription());
        stmt.setString(4, bike.getLocation());
        stmt.setBigDecimal(5, bike.getPricePerHour());
        stmt.setDouble(6, bike.getLatitude());
        stmt.setDouble(7, bike.getLongitude());
        stmt.setString(8, bike.getStatus());

        int rowsAffected = stmt.executeUpdate();

        return rowsAffected; // usually 1 if success
    } catch (SQLException e) {
        e.printStackTrace();
        return -1;
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
                rs.getLong("id"),
                rs.getString("username"),
                rs.getString("email"),
                rs.getString("phone")
            );
        } else {
            return null;
        }

    } catch (SQLException e) {
        e.printStackTrace();
        return null;
    }
  }

  public List<Bike> returnAllBikes() {
    String checkSql = "SELECT * FROM bikes";
    List<Bike> bikes = new ArrayList<>();

    try (Connection conn = dataSource.getConnection();
         PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

        ResultSet rs = checkStmt.executeQuery();

        while (rs.next()) {
            Bike bike = new Bike(
                rs.getLong("owner_id"),
                rs.getString("title"),
                rs.getString("description"),
                rs.getString("location"),
                rs.getBigDecimal("price_per_hour"),
                rs.getDouble("latitude"),
                rs.getDouble("longitude"),
                rs.getString("status")
            );
            bike.setId(rs.getLong("id"));
            bike.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            
            bikes.add(bike);
        }

        return bikes;

    } catch (SQLException e) {
        e.printStackTrace();
        return new ArrayList<>(); 
    }
  }
}