package waxwing.campusbike.types;

public class User {
    public String username;
    public String email;
    public String password_hash;
    public String phone;

    public User(String username, String email, String password_hash) {
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword_hash() {
        return password_hash;
    }
    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }   

    
}
