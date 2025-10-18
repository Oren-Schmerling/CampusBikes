package waxwing.campusbike.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import waxwing.campusbike.types.dto.LoginRequest;
import waxwing.campusbike.auth.service.LoginService;

@RestController
@RequestMapping("/auth")
public class LoginController{

    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

   @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody LoginRequest request) {
        int statusCode = loginService.loginUser(request);
        Map<String, Object> response = new HashMap<>();

        switch (statusCode) {
            case 200:
                response.put("message", "Login successful.");
                return ResponseEntity.ok(response);
            case 470:
                response.put("message", "Invalid username or password.");
                return ResponseEntity.badRequest().body(response);
            case 471:
                response.put("message", "Username does not exist.");
                return ResponseEntity.badRequest().body(response);
            default:
                response.put("message", "Error, status code: " + statusCode);
                return ResponseEntity.status(statusCode >= 400 ? statusCode : 500).body(response);
        }
    }


}