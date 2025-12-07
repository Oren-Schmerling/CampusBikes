package waxwing.campusbike.listing.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.listing.service.ListingService;
import waxwing.campusbike.types.Bike;
import waxwing.campusbike.types.dto.BikeCreateRequest;
import waxwing.campusbike.types.dto.BikeUpdateRequest;

@RestController
@RequestMapping("/listing")
public class ListingsController {

  private final ListingService listingService;

  @Autowired
  public ListingsController(ListingService listingService) {
    this.listingService = listingService;
  }

  @PostMapping("/create")
  public ResponseEntity<Map<String, Object>> createBike(
      @RequestBody BikeCreateRequest request,
      @RequestHeader("Authorization") String authHeader) {

    Map<String, Object> response = new HashMap<>();

    String token = authHeader.substring(7).trim();
    String username = JwtUtil.getUsernameFromToken(token);

    int statusCode = listingService.createBike(username, request);

    System.out.println(statusCode);

    response.put("message", "Bike creation successful.");
    response.put("statusCode", statusCode);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/update")
  public ResponseEntity<Map<String, Object>> updateBike(
      @RequestBody BikeUpdateRequest request,
      @RequestHeader("Authorization") String authHeader) {

    Map<String, Object> response = new HashMap<>();

    String token = authHeader.substring(7).trim();
    String username = JwtUtil.getUsernameFromToken(token);

    int statusCode = listingService.updateBike(username, request.getOwnerId(), request);

    System.out.println(statusCode);

    response.put("message", "Bike update successful.");
    response.put("statusCode", statusCode);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/bikes")
  public ResponseEntity<Map<String, Object>> returnAllBikes() {
    Map<String, Object> response = new HashMap<>();

    List<Bike> bikes = listingService.returnAllBikes();

    response.put("message", "Fetched all bikes successfully.");
    response.put("bikes", bikes);
    response.put("count", bikes.size());

    return ResponseEntity.ok(response);
  }

  @PostMapping("/getbikesuser")
  public ResponseEntity<Map<String, Object>> returnUserBikes(
        @RequestHeader("Authorization") String authHeader) {
    Map<String, Object> response = new HashMap<>();

    String token = authHeader.substring(7).trim();
    String username = JwtUtil.getUsernameFromToken(token);

    List<Bike> bikes = listingService.returnUserBikes(username);

    response.put("message", "Fetched all bikes for this user successfully.");
    response.put("bikes", bikes);
    response.put("count", bikes.size());

    return ResponseEntity.ok(response);
  }
}