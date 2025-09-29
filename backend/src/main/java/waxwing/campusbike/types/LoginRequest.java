package waxwing.campusbike.types;

public class LoginRequest {
    private String username;
    private String plain_pass;

    public LoginRequest(String username, String plain_pass){
        this.username = username;
        this.plain_pass = plain_pass;
    }

    public String get_pass(){
        return this.plain_pass;
    }

    public String get_user(){
        return this.username;
    }
}
