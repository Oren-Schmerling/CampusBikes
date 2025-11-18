package waxwing.campusbike.chat.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import waxwing.campusbike.auth.util.JwtUtil;
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
}