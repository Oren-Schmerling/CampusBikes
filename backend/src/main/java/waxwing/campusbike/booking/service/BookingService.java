package waxwing.campusbike.booking.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import waxwing.campusbike.Env;

import waxwing.campusbike.types.Rental;
import waxwing.campusbike.types.dto.BookingRequest;
import waxwing.campusbike.types.User;
import java.sql.ResultSet;

// to convert string to localdatetime
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class BookingService {
    
private final Env env;
  private final ObjectMapper objectMapper;

  @Autowired
  private DataSource dataSource;

  public BookingService(Env env) {
        this.env = env;
        this.objectMapper = new ObjectMapper();
  }

  public int rentBike(String username, BookingRequest request){
    // // TODO: implement bike rental logic
    User user = getUser(username);

    // convert startTime and endTime from String to LocalDateTime
    String startTime = request.getStartTime();
    String endTime = request.getEndTime();

    Instant startInstant = Instant.parse(startTime);
    LocalDateTime localStartTime = LocalDateTime.ofInstant(startInstant, ZoneId.systemDefault());

    Instant endInstant = Instant.parse(endTime);
    LocalDateTime localEndTime = LocalDateTime.ofInstant(endInstant, ZoneId.systemDefault());

    Rental newBooking = new Rental(
        user.getId(),
        request.getBikeID(),
        localStartTime,
        localEndTime
    );

    int code = uploadBooking(newBooking);
    if (code == 1){
        return 200; // OK
    } else {
        return 409; // return conflict if booking fails
    }
  }

  private int uploadBooking(Rental booking) {
    // TODO: implement booking upload logic
     String sql = "INSERT INTO rentals (renter_id, bike_id, start_time, end_time, status) VALUES (?, ?, ?, ?, 'booked')";

    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        stmt.setLong(1, booking.getRenterId());
        stmt.setLong(2, booking.getBikeId());
        stmt.setObject(3, booking.getStartTime());
        stmt.setObject(4, booking.getEndTime());

        int rowsAffected = stmt.executeUpdate();

        return rowsAffected; // usually 1 if successful
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
}