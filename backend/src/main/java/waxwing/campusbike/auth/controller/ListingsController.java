package waxwing.campusbike.auth.controller;

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

import waxwing.campusbike.auth.service.ListingService;
import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.types.Bike;
import waxwing.campusbike.types.dto.BikeCreateRequest;

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

    System.out.println("in the func");
    Map<String, Object> response = new HashMap<>();

    String token = authHeader.substring(7).trim();
    String username = JwtUtil.getUsernameFromToken(token);

    int statusCode = listingService.createBike(username, request);

    System.out.println(statusCode);

    response.put("message", "Bike creation successful.");
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
}