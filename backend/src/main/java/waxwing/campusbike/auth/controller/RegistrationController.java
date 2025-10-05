package waxwing.campusbike.auth.controller;

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
    public ResponseEntity<String> registerUser(@RequestBody RegistrationRequest request) {
        int statusCode = registrationService.registerUser(request);

        // Map your custom status codes to HTTP responses
        switch (statusCode) {
            case 470:
                return ResponseEntity.badRequest().body("Invalid email format");
            case 471:
                return ResponseEntity.badRequest().body("Email must be a UMass email");
            case 409:
                return ResponseEntity.status(409).body("Username or email already exists");
            case 423:
                return ResponseEntity.badRequest().body("Invalid phone number");
            case 494:
                return ResponseEntity.badRequest().body("Phone number parsing error");
            case 497:
            case 498:
            case 499:
                return ResponseEntity.status(500).body("Internal server error");
            default:
                if (statusCode >= 200 && statusCode < 300) {
                    return ResponseEntity.ok("Registration successful");
                } else {
                    return ResponseEntity.status(statusCode).body("Error: " + statusCode);
                }
        }
    }
}
