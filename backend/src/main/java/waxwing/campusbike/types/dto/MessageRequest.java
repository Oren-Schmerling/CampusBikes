package waxwing.campusbike.types.dto;

public class MessageRequest {
    private String otherUsername;

    public MessageRequest() {}

    public String getOtherUsername() {
        return otherUsername;
    }
    public void setUsername(String username) {
        this.otherUsername = username;
    }
}
