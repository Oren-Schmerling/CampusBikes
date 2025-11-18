package waxwing.campusbike.chat.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import waxwing.campusbike.Env;
import waxwing.campusbike.types.Message;
import waxwing.campusbike.types.User;

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
            SELECT * FROM messages 
            WHERE (sender_id = ? AND recipient_id = ?) 
               OR (sender_id = ? AND recipient_id = ?)
            ORDER BY created_at ASC
        """;
        
        messages = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new Message(
                rs.getLong("id"),
                rs.getLong("sender_id"),
                rs.getLong("recipient_id"),
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
}