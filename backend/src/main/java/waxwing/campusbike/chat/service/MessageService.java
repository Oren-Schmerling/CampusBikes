package waxwing.campusbike.chat.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import waxwing.campusbike.Env;
import waxwing.campusbike.chat.models.ChatMessage;
import waxwing.campusbike.chat.models.MessageStatus;
import waxwing.campusbike.types.Message;

@Service
public class MessageService {

  private final Env env;
  private final ObjectMapper objectMapper;

  @Autowired
  private DataSource dataSource;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public MessageService(Env env) {
    this.env = env;
    this.objectMapper = new ObjectMapper();
  }


  public List<Message> returnAllMessages(String username, String otherUsername) {
    List<Message> messages = new ArrayList<>();

    try {
        // Look up both user IDs
        Long userId = jdbcTemplate.queryForObject(
            "SELECT id FROM users WHERE username = ?",
            Long.class,
            username
        );
        
        Long otherUserId = jdbcTemplate.queryForObject(
            "SELECT id FROM users WHERE username = ?",
            Long.class,
            otherUsername
        );
        
        // Get all messages between these two users
        String sql = """
            SELECT m.id, m.sender_id, m.recipient_id, m.content, m.created_at,
                   us.username AS sender_username,
                   ur.username AS recipient_username
            FROM messages m
            JOIN users us ON m.sender_id = us.id
            JOIN users ur ON m.recipient_id = ur.id
            WHERE (m.sender_id = ? AND m.recipient_id = ?)
               OR (m.sender_id = ? AND m.recipient_id = ?)
            ORDER BY m.created_at ASC
        """;
        
        messages = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new Message(
                rs.getLong("id"),
                rs.getLong("sender_id"),
                rs.getLong("recipient_id"),
                rs.getString("sender_username"),
                rs.getString("recipient_username"),
                rs.getString("content"),
                rs.getTimestamp("created_at")
            ),
            userId, otherUserId, otherUserId, userId
        );
        
    } catch (Exception e) {
        e.printStackTrace();
    }

    return messages;
  }

    public List<String> returnAllRecipients(String username) {
        List<String> usernames = new ArrayList<>();

        try {
            // Look up the user ID
            Long userId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ?",
                Long.class,
                username
            );
            
            // Get all distinct users that this user has communicated with
            String sql = """
                SELECT DISTINCT u.username 
                FROM (
                    SELECT recipient_id AS user_id 
                    FROM messages 
                    WHERE sender_id = ?
                    UNION
                    SELECT sender_id AS user_id 
                    FROM messages 
                    WHERE recipient_id = ?
                ) AS message_users
                JOIN users u ON u.id = message_users.user_id
            """;
            
            usernames = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getString("username"),
                userId,
                userId
            );
            
        } catch (Exception e) {
            e.printStackTrace();
        }

        return usernames;
    }

    public int sendMessage(String username, ChatMessage request) {
        try {
            // Set message metadata
            request.setId(UUID.randomUUID().toString());
            request.setTimestamp(LocalDateTime.now());
            request.setStatus(MessageStatus.SENT);
            request.setSenderId(username);
            
            // Look up sender ID
            Long senderId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ?",
                Long.class,
                username
            );
            
            // Get the owner's username from the bike listing
            String ownerUsername = jdbcTemplate.queryForObject(
                "SELECT u.username FROM users u " +
                "JOIN bikes b ON b.owner_id = u.id " +  // Changed: l.user_id -> b.owner_id
                "WHERE b.id = ?",
                String.class,
                request.getListingId()
            );
            
            // Set the recipient ID to the owner's username
            request.setRecipientId(ownerUsername);
            
            // Look up recipient ID
            Long recipientId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ?",
                Long.class,
                ownerUsername
            );
            
            System.out.printf("Sending message from %s to %s (owner of bike %d)%n", 
                request.getSenderId(), ownerUsername, request.getListingId());
            
            // Insert message into database
            String sql = "INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)";
            
            try (Connection conn = dataSource.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                System.out.println("=== Inserting Message ===");
                System.out.println("SQL: " + sql);
                System.out.println("Sender ID: " + senderId);
                System.out.println("Recipient ID: " + recipientId);
                System.out.println("Content: " + request.getContent());
                System.out.println("Content length: " + request.getContent().length());

                stmt.setLong(1, senderId);
                stmt.setLong(2, recipientId);
                stmt.setString(3, request.getContent());
                
                stmt.executeUpdate();
            }
            
            return 200;
            
        } catch (EmptyResultDataAccessException e) {
            System.err.println("Bike or user not found: " + e.getMessage());
            return 404;
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
            e.printStackTrace();
            return 500;
        } catch (Exception e) {
            System.err.println("Error sending message: " + e.getMessage());
            e.printStackTrace();
            return 400;
        }
    }
}