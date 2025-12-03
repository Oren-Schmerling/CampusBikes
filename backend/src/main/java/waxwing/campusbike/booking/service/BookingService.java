package waxwing.campusbike.booking.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import waxwing.campusbike.Env;
import waxwing.campusbike.types.Bike;
import waxwing.campusbike.types.Rental;
import waxwing.campusbike.types.dto.BookingAvailability;
import waxwing.campusbike.types.dto.BookingRequest;
import waxwing.campusbike.types.User;
import java.sql.ResultSet;

// to convert string to localdatetime
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

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

  public int rentBike(String username, BookingRequest request) {
    User user = getUser(username);

    // convert startTime and endTime from String to LocalDateTime
    String startTime = request.getStartTime();
    String endTime = request.getEndTime();

    Instant startInstant = Instant.parse(startTime);
    // using New York timezone for now
    LocalDateTime localStartTime = LocalDateTime.ofInstant(startInstant, ZoneId.of("America/New_York"));

    Instant endInstant = Instant.parse(endTime);
    LocalDateTime localEndTime = LocalDateTime.ofInstant(endInstant, ZoneId.of("America/New_York"));

    Rental newBooking = new Rental(
        user.getId(),
        request.getBikeID(),
        localStartTime,
        localEndTime
    );

    int code = uploadBooking(newBooking);
    if (code == 1) {
        return 200; // OK
    } else if (code == -2) {
        return 409; // Conflict - time slot already booked
    } else {
        return 500; // Internal server error
    }
}

  private int uploadBooking(Rental booking) {
    // TODO: implement booking upload logic

    String checkSQL = """
            SELECT COUNT(*) FROM rentals 
            WHERE bike_id = ? 
            AND status = 'booked'
            AND (
                (? >= start_time AND ? <= end_time) OR
                (? >= start_time AND ? <= end_time) OR
                (? >= start_time AND ? <= end_time)
            )
            """;

    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement(checkSQL)) {

        stmt.setLong(1, booking.getBikeId());
        stmt.setObject(2, booking.getStartTime());   // end_time > new_start
        stmt.setObject(3, booking.getStartTime()); // start_time < new_start
        stmt.setObject(4, booking.getEndTime());   // end_time > new_end
        stmt.setObject(5, booking.getEndTime()); // start_time < new_end
        stmt.setObject(6, booking.getStartTime()); // booking contained within
        stmt.setObject(7, booking.getEndTime());

        try (ResultSet rs = stmt.executeQuery()) {
            if (rs.next() && rs.getInt(1) > 0) {
                // Conflict found
                return -2; // Conflict code
            }
        }

    } catch (SQLException e) {
        System.out.println("Error during booking conflict check:");
        e.printStackTrace();
        return -1;
    }


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

// private int uploadBooking(Rental booking) {
//     Connection conn = null;
//     try {
//         conn = dataSource.getConnection();
        
//         // Start transaction and set isolation level
//         conn.setAutoCommit(false);
//         conn.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);

//         // Step 1: Check for overlapping bookings with row lock
//         String checkSql = """
//             SELECT COUNT(*) FROM rentals 
//             WHERE bike_id = ? 
//             AND status = 'booked'
//             AND (
//                 (? >= start_time AND ? <= end_time) OR
//                 (? >= start_time AND ? <= end_time) OR
//                 (? >= start_time AND ? <= end_time)
//             )
//             FOR UPDATE
//             """;

//         try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
//             checkStmt.setLong(1, booking.getBikeId());
//             checkStmt.setObject(2, booking.getStartTime());   // end_time > new_start
//             checkStmt.setObject(3, booking.getStartTime()); // start_time < new_start
//             checkStmt.setObject(4, booking.getEndTime());   // end_time > new_end
//             checkStmt.setObject(5, booking.getEndTime()); // start_time < new_end
//             checkStmt.setObject(6, booking.getStartTime()); // booking contained within
//             checkStmt.setObject(7, booking.getEndTime());

//             try (var rs = checkStmt.executeQuery()) {
//                 if (rs.next() && rs.getInt(1) > 0) {
//                     // Conflict found - rollback and return
//                     conn.rollback();
//                     return -2; // Conflict code
//                 }
//             }
//         }

//         // Step 2: No conflict, insert the booking
//         String insertSql = "INSERT INTO rentals (renter_id, bike_id, start_time, end_time, status) VALUES (?, ?, ?, ?, 'booked')";
        
//         try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
//             insertStmt.setLong(1, booking.getRenterId());
//             insertStmt.setLong(2, booking.getBikeId());
//             insertStmt.setObject(3, booking.getStartTime());
//             insertStmt.setObject(4, booking.getEndTime());

//             int rowsAffected = insertStmt.executeUpdate();
            
//             // Commit transaction
//             conn.commit();
            
//             return rowsAffected; // usually 1 if successful
//         }

//     } catch (SQLException e) {
//         // Rollback on any error
//         if (conn != null) {
//             try {
//                 conn.rollback();
//             } catch (SQLException ex) {
//                 ex.printStackTrace();
//             }
//         }
//         e.printStackTrace();
//         return -1;
//     } finally {
//         // Restore auto-commit and close connection
//         if (conn != null) {
//             try {
//                 conn.setAutoCommit(true);
//                 conn.close();
//             } catch (SQLException e) {
//                 e.printStackTrace();
//             }
//         }
//     }
// }

//   public int rentBike(String username, BookingRequest request){
//     User user = getUser(username);

//     // convert startTime and endTime from String to LocalDateTime
//     String startTime = request.getStartTime();
//     String endTime = request.getEndTime();

//     Instant startInstant = Instant.parse(startTime);
//     LocalDateTime localStartTime = LocalDateTime.ofInstant(startInstant, ZoneId.systemDefault());

//     Instant endInstant = Instant.parse(endTime);
//     LocalDateTime localEndTime = LocalDateTime.ofInstant(endInstant, ZoneId.systemDefault());

//     Rental newBooking = new Rental(
//         user.getId(),
//         request.getBikeID(),
//         localStartTime,
//         localEndTime
//     );

//     int code = uploadBooking(newBooking);
//     if (code == 1){
//         return 200; // OK
//     } else {
//         return 409; // return conflict if booking fails
//     }
//   }

//   private int uploadBooking(Rental booking) {
//     // TODO: implement booking upload logic
//      String sql = "INSERT INTO rentals (renter_id, bike_id, start_time, end_time, status) VALUES (?, ?, ?, ?, 'booked')";

//     try (Connection conn = dataSource.getConnection();
//          PreparedStatement stmt = conn.prepareStatement(sql)) {

//         stmt.setLong(1, booking.getRenterId());
//         stmt.setLong(2, booking.getBikeId());
//         stmt.setObject(3, booking.getStartTime());
//         stmt.setObject(4, booking.getEndTime());

//         int rowsAffected = stmt.executeUpdate();

//         return rowsAffected; // usually 1 if successful
//     } catch (SQLException e) {
//         e.printStackTrace();
//         return -1;
//     }
//   }

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

    public List<Rental> returnAllBookings() {
        String checkSql = "SELECT * FROM rentals";
        List<Rental> bookings = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
            PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

            ResultSet rs = checkStmt.executeQuery();

            while (rs.next()) {
                Rental booking = new Rental(
                    rs.getLong("renter_id"),
                    rs.getLong("bike_id"),
                    rs.getTimestamp("start_time").toLocalDateTime(),
                    rs.getTimestamp("end_time").toLocalDateTime()
                );
                booking.setId(rs.getLong("id"));
                
                bookings.add(booking);
            }

            return bookings;

        } catch (SQLException e) {
            e.printStackTrace();
            return new ArrayList<>(); 
        }
    }

  // fetch bookings by listing ID
  public java.util.List<BookingAvailability> getBookingsByListingID(Long listingID) {
    String sql = "SELECT start_time, end_time FROM rentals WHERE bike_id = ?";
    java.util.List<BookingAvailability> bookings = new java.util.ArrayList<>();

    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        stmt.setLong(1, listingID);
        ResultSet rs = stmt.executeQuery();

        while (rs.next()) {
            LocalDateTime startTime = rs.getObject("start_time", LocalDateTime.class);
            LocalDateTime endTime = rs.getObject("end_time", LocalDateTime.class);
            bookings.add(new BookingAvailability(startTime, endTime));
        }

        return bookings;

    } catch (SQLException e) {
        e.printStackTrace();
        throw new RuntimeException("Error fetching bookings", e);
    }
  }
}