package waxwing.campusbike;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import waxwing.campusbike.auth.LoginUtil;

public class loginUtilTests {

    @Test
    void loginSuccess(){
        // add a test user to the database
        // INSERT INTO users (username, email, password_hash, phone) VALUES ('testuser', 'test@umass.edu', 'hashed_pass', '123456789');
        int res = LoginUtil.loginHandler("testuser", "hashed_pass");
        System.out.println(res);
        assertTrue((res >= 200 && res < 300));
    }

    @Test
    void loginFail(){
        // make sure this username and pass combo is not in the base
        int res = LoginUtil.loginHandler("toaifoiwfofjas", "password");
        assertFalse((res >= 200 && res < 300));
    }

}
