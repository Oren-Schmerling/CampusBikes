package waxwing.campusbike.types;

public class User {
  public String username;
  public String email;
  public String password; // This is raw password and later hashed before storing in db
  public String phone;
  public Long id;

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  public User(Long id, String username, String email, String phone) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.phone = phone;
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
    return password;
  }

  public void setPassword_hash(String password) {
    this.password = password;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
}
