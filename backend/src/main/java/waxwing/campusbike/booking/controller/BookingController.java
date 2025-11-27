package waxwing.campusbike.booking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.types.dto.BookingRequest;
import waxwing.campusbike.booking.service.BookingService;

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

        // String token = authHeader.substring(7).trim();
        // String username = JwtUtil.getUsernameFromToken(token);

        // int statusCode = bookingService.rentBike(username, request);

        // if (statusCode != 200) {
        //     response.put("message", "Bike rental failed.");
        //     response.put("statusCode", statusCode);
        //     return ResponseEntity.badRequest().body(response);
        // } else {
        //     response.put("message", "Bike rental successful.");
        //     response.put("statusCode", statusCode);
        //     return ResponseEntity.ok(response);
        // }

        response.put("message", "Bike rental successful.");
        response.put("status", 200);
        return ResponseEntity.ok(response);
    }
    
}