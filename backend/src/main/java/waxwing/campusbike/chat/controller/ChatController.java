package waxwing.campusbike.chat.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.UUID;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import waxwing.campusbike.chat.models.ChatMessage;
import waxwing.campusbike.chat.models.MessageStatus;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {

        System.out.printf("Sending message from %s to %s%n", chatMessage.getSenderId(), chatMessage.getRecipientId());
        chatMessage.setId(UUID.randomUUID().toString());
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setStatus(MessageStatus.SENT);

        //This is the part that store the message in the database
        String sql = "INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            Long senderId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ?",
                Long.class,
                chatMessage.getSenderId()
            );
            
            // Look up recipient ID
            Long recipientId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ?",
                Long.class,
                chatMessage.getRecipientId()
            );

            stmt.setLong(1, senderId);
            stmt.setLong(2, recipientId);
            stmt.setString(3, chatMessage.getContent());

            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        
        // This actually sends the message to the recipient
        messagingTemplate.convertAndSendToUser(
            chatMessage.getRecipientId(),
            "/queue/messages",
            chatMessage
        );
    }
}
