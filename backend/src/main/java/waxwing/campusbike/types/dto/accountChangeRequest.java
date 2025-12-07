// package waxwing.campusbike.types.dto;

// import com.fasterxml.jackson.annotation.JsonProperty;

// public class accountChangeRequest {
//     private String username;
//     private String password;
//     private String email;
//     private String phone;

//     @JsonProperty("newPassword") 
//     private String new_password;

//     public accountChangeRequest() {}

//     public String getUsername() {
//         return this.username;
//     }
//     public void setUsername(String username) {
//         this.username = username;
//     }
//     public String getPassword() {
//         return this.password;
//     }
//     public void setPassword(String password) {
//         this.password = password;
//     }
//     public String getNewPassword(){
//         return this.new_password;
//     }
//     public void setNewPassword(String newPassword){
//         this.new_password = newPassword;
//     }
//     public String getEmail() {
//         return this.email;
//     }
//     public void setEmail(String email) {
//         this.email = email;
//     }
//     public String getPhone() {
//         return this.phone;
//     }
//     public void setPhone(String phone) {
//         this.phone = phone;
//     }
// }


package waxwing.campusbike.types.dto;

public class accountChangeRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String new_password;

    public accountChangeRequest() {}

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    
    // ✅ Change these to match the field name exactly
    public String getNew_password(){
        return new_password;
    }
    public void setNew_password(String new_password){
        this.new_password = new_password;
    }
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    @Override
    public String toString() {
        return "accountChangeRequest{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", hasPassword=" + (password != null) +
                ", hasNewPassword=" + (new_password != null) +
                '}';
    }
}