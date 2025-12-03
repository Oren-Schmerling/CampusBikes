package waxwing.campusbike.chat.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.chat.models.ChatMessage;
import waxwing.campusbike.chat.service.MessageService;
import waxwing.campusbike.types.Message;
import waxwing.campusbike.types.dto.MessageRequest;

@RestController
@RequestMapping("/message")
public class MessageController {

  private final MessageService messageService;

  @Autowired
  public MessageController(MessageService messageService) {
    this.messageService = messageService;
  }

  @PostMapping("/getall")
  public ResponseEntity<Map<String, Object>> returnAllBikes(
    @RequestBody MessageRequest request, 
    @RequestHeader("Authorization") String authHeader) {

    Map<String, Object> response = new HashMap<>();

    String token = authHeader.substring(7).trim();
    String username = JwtUtil.getUsernameFromToken(token);

    List<Message> messages = messageService.returnAllMessages(username, request.getOtherUsername());

    response.put("message", "Fetched all messages successfully.");
    response.put("messages", messages);

    return ResponseEntity.ok(response);
  }

  @PostMapping("/getrecipients")
  public ResponseEntity<Map<String, Object>> returnAllRecipient(
    @RequestHeader("Authorization") String authHeader) {

    Map<String, Object> response = new HashMap<>();

    String token = authHeader.substring(7).trim();
    String username = JwtUtil.getUsernameFromToken(token);

    List<String> usernames = messageService.returnAllRecipients(username);

    response.put("message", "Fetched all usernames successfully.");
    response.put("usernames", usernames);

    return ResponseEntity.ok(response);
  }

  @PostMapping("/sendmessage")
    public ResponseEntity<Map<String, Object>> sendMessage(
        @RequestBody ChatMessage request,
        @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("message", "Invalid authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            String token = authHeader.substring(7).trim();
            String username = JwtUtil.getUsernameFromToken(token);

            // Validate request content
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                response.put("message", "Message content cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (request.getListingId() == null) {  // Changed validation
                response.put("message", "Listing ID is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            int statusCode = messageService.sendMessage(username, request);

            switch (statusCode) {
                case 200:
                    response.put("message", "Message sent successfully");
                    response.put("messageId", request.getId());
                    response.put("timestamp", request.getTimestamp());
                    return ResponseEntity.ok(response);
                
                case 404:
                    response.put("message", "Listing or seller not found");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                
                case 500:
                    response.put("message", "Internal server error while sending message");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                
                default:
                    response.put("message", "Failed to send message");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}