package waxwing.campusbike.types;

import java.sql.Timestamp;

public class Message {
    private Long id;
    private Long senderId;
    private Long recipientId;
    private String senderUsername;
    private String recipientUsername;
    private String content;
    private Timestamp createdAt;

    // Constructor without id (for creating new messages)
    public Message(Long senderId, Long recipientId, String content) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
    }

    // Full constructor
    public Message(Long id, Long senderId, Long recipientId, String senderUsername, String recipientUsername, String content, Timestamp createdAt) {
        this.id = id;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.senderUsername = senderUsername;
        this.recipientUsername = recipientUsername;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public String getContent() {
        return content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}