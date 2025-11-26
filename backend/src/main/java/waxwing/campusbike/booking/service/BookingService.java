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

  public int rentBike(String username, Object request){
    // TODO: implement bike rental logic

    Rental newBooking = objectMapper.convertValue(request, Rental.class);
    int code = uploadBooking(newBooking);
    if (code == 1){
        return 200; // OK
    } else {
        return 500; // Internal Server Error
    }
  }

  private int uploadBooking(Rental booking) {
    // TODO: implement booking upload logic
     String sql = "INSERT INTO rentals (renter_id, bike_id, start_time, end_time) VALUES (?, ?, ?, ?)";

    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        stmt.setLong(1, booking.getRenterId());
        stmt.setLong(2, booking.getBikeId());
        stmt.setObject(3, booking.getStartTime());
        stmt.setObject(4, booking.getEndTime());

        int rowsAffected = stmt.executeUpdate();

        return rowsAffected; // usually 1 if success
    } catch (SQLException e) {
        e.printStackTrace();
        return -1;
    }
  }
}