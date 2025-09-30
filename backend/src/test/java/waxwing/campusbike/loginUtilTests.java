package waxwing.campusbike;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import waxwing.campusbike.auth.LoginUtil;

public class loginUtilTests {

    @Test
    void loginSuccess(){
        // add a test user to the database w/ the following 
        // INSERT INTO users (username, email, password_hash, phone) VALUES ('testuser', 'test@umass.edu', 'hashed_pass', '123456789');

        // NOTE: if you use 'docker compose down -v', the database volume will be deleted, and the data will not persist on your local machine
        // so you must reinsert data every time you want to test

        int res = LoginUtil.loginHandler("testuser", "hashed_pass");
        assertTrue((res >= 200 && res < 300));
    }

    @Test
    void loginFail(){
        // make sure this username and pass combo is not in the base
        int res = LoginUtil.loginHandler("toaifoiwfofjas", "password");
        assertFalse((res >= 200 && res < 300));
    }

    @Test
    void nullUser(){
        // ensure a null user field is not accepted
        int res = LoginUtil.loginHandler((null), "password");
        assertFalse((res >= 200 && res < 300));
    }

    @Test 
    void nullPass(){
        // ensure a null a password field is not accepted
        int res = LoginUtil.loginHandler("user", (null));
        assertFalse((res >= 200 && res < 300));
    }

}
