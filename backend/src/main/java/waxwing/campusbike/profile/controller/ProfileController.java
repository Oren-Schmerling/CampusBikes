package waxwing.campusbike.profile.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.profile.service.ProfileService;
import waxwing.campusbike.types.dto.accountChangeRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    
    private static final Logger log = LoggerFactory.getLogger(ProfileController.class);
    
    private final ProfileService ps;

    @Autowired
    public ProfileController(ProfileService ps) {
        this.ps = ps;
    }

    @PostMapping("/change")
    public ResponseEntity<Map<String, Object>> postMethodName(
        @RequestBody accountChangeRequest request, 
        @RequestHeader("Authorization") String authHeader) {
        
        Map<String, Object> response = new HashMap<>();

        log.info("new pass: {}", request.getNew_password());

        String token = authHeader.substring(7).trim();
        String username = JwtUtil.getUsernameFromToken(token);
        
        log.info("Processing change for user: {}", username);

        int statusCode = this.ps.changeUser(username, request);
        log.info("Change user result - Status code: {}", statusCode);

        response.put("statusCode", statusCode);
        if (statusCode != 200){
            response.put("message", "User information not successfully changed");
            return ResponseEntity.badRequest().body(response);
        } else {
            response.put("message", "User information successfully changed.");
            return ResponseEntity.ok(response);
        }
    }
}