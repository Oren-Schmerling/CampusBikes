package waxwing.campusbike.chat.service;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import waxwing.campusbike.Env;
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
}