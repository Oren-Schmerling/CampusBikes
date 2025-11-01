package waxwing.campusbike.listings.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/listings")
public class ListingController {

  @GetMapping()
  public ResponseEntity<Map<String, Object>> getMethodName(@RequestParam String param) {
    return null;
  }

}
