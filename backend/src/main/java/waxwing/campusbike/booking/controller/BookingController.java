package waxwing.campusbike.booking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.List;
import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.types.Bike;
import waxwing.campusbike.types.Rental;
import waxwing.campusbike.types.dto.BookingRequest;
import waxwing.campusbike.booking.service.BookingService;
import waxwing.campusbike.types.dto.BookingAvailability;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bs) {
        this.bookingService = bs;
    }

    @PostMapping("/rent")
    public ResponseEntity<Map<String, Object>> rentBike(
        @RequestBody BookingRequest request, 
        @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        System.out.println("Received request: " + request);

        String token = authHeader.substring(7).trim();
        String username = JwtUtil.getUsernameFromToken(token);

        int statusCode = bookingService.rentBike(username, request);

        if (statusCode != 200) {
            if (statusCode == 409) {
                response.put("conflict", true);
                response.put("message", "Sorry, this listing was just booked for the selected time!");
                
            } else {
                response.put("message", "Bike rental failed.");
            }
            response.put("statusCode", statusCode);
            return ResponseEntity.badRequest().body(response);
        } else {
            response.put("message", "Bike rental successful.");
            response.put("statusCode", statusCode);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/rentals/{listingID}")
    public ResponseEntity<Map<String, Object>> getBookingsByListing(
        @PathVariable Long listingID) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<BookingAvailability> bookings = bookingService.getBookingsByListingID(listingID);
            response.put("bookings", bookings);
            response.put("statusCode", 200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to fetch bookings: " + e.getMessage());
            response.put("statusCode", 500);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/rentals")
    public ResponseEntity<Map<String, Object>> returnAllBookings() {
        Map<String, Object> response = new HashMap<>();

        List<Rental> bookings = bookingService.returnAllBookings();

        response.put("message", "Fetched all bookings successfully.");
        response.put("bookings", bookings);
        response.put("count", bookings.size());

        return ResponseEntity.ok(response);
    }

}