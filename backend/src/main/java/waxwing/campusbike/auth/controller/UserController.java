package waxwing.campusbike.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import waxwing.campusbike.auth.service.UserService;
import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.types.User;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/getinfo")
    public ResponseEntity<Map<String, Object>> returnAllRecipient(
        @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        String token = authHeader.substring(7).trim();
        String username = JwtUtil.getUsernameFromToken(token);

        User info = userService.returnInfo(username);

        if (info != null) {
            response.put("message", "User info fetched successfully.");
            response.put("user", info);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}