package waxwing.campusbike.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import waxwing.campusbike.types.dto.RegistrationRequest;
import waxwing.campusbike.auth.service.RegistrationService;

@RestController
@RequestMapping("/auth")
public class RegistrationController {

  private final RegistrationService registrationService;

  @Autowired
  public RegistrationController(RegistrationService registrationService) {
    this.registrationService = registrationService;
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> registerUser(@RequestBody RegistrationRequest request) {
    int statusCode = registrationService.registerUser(request);
    Map<String, Object> response = new HashMap<>();

    switch (statusCode) {
      case 470:
        response.put("message", "Invalid email format");
        return ResponseEntity.badRequest().body(response);
      case 471:
        response.put("message", "Email must be a UMass email");
        return ResponseEntity.badRequest().body(response);
      case 409:
        response.put("message", "Username or email already exists");
        return ResponseEntity.status(409).body(response);
      case 423:
        response.put("message", "Invalid phone number");
        return ResponseEntity.badRequest().body(response);
      case 494:
        response.put("message", "Phone number parsing error");
        return ResponseEntity.badRequest().body(response);
      case 200:
        response.put("message", "Registration successful");
        return ResponseEntity.ok(response);
      case 201:
        response.put("message", "Registration successful");
        return ResponseEntity.ok(response);
      default:
        response.put("message", "Error, status code: " + statusCode);
        return ResponseEntity.status(statusCode >= 400 ? statusCode : 500).body(response);
    }
  }

}
