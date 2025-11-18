package waxwing.campusbike.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import waxwing.campusbike.types.dto.LoginRequest;
import waxwing.campusbike.auth.service.LoginService;
import waxwing.campusbike.auth.util.JwtUtil;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest request) {
        // NOTE: We change the service method to return an Object to hold either a String (JWT) or an Integer (status code)
        Object serviceResult = loginService.loginUser(request); 
        Map<String, Object> response = new HashMap<>();

        if (serviceResult instanceof String jwt) {
            // Case 1: Login was successful, and the service returned the JWT (String)
            response.put("message", "Login successful.");
            response.put("token", jwt); // <-- ADD THE JWT HERE
            return ResponseEntity.ok(response);
        
        } else if (serviceResult instanceof Integer statusCode) {
            // Case 2: Login failed, and the service returned a status code (Integer)
            switch (statusCode) {
                case 470:
                    response.put("message", "Invalid username or password.");
                    return ResponseEntity.badRequest().body(response);
                case 471:
                    response.put("message", "Username does not exist.");
                    // Return 401 Unauthorized or 400 Bad Request for security reasons
                    return ResponseEntity.status(401).body(response); 
                default:
                    response.put("message", "An unexpected error occurred.");
                    return ResponseEntity.status(500).body(response);
            }
            
        } else {
            // Fallback for an unhandled scenario
            response.put("message", "Internal server error during login processing.");
            return ResponseEntity.internalServerError().body(response);
        }
    }


    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();

        // No header or missing Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.put("valid", false);
            return ResponseEntity.status(401).body(response);
        }

        String token = authHeader.substring(7); // remove "Bearer "

        boolean isValid = JwtUtil.validateToken(token); // your backend utility

        response.put("valid", isValid);

        if (isValid) {
            return ResponseEntity.ok(response);      // 200 OK
        } else {
            return ResponseEntity.status(401).body(response); // 401 Unauthorized
        }
    }
}