package waxwing.campusbike;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.net.URISyntaxException;

import waxwing.campusbike.auth.LoginUtil;

import waxwing.campusbike.auth.registrationUtil;
import waxwing.campusbike.auth.util.PasswordUtil;

import java.util.UUID;
import java.io.IOException;

public class loginUtilTests {

    // OLD TESTING FILE

    @Test
    void randomUser() throws URISyntaxException, IOException{
        String username = UUID.randomUUID().toString();
        String hashedPassword = PasswordUtil.hashPassword("password");
        String email = username + "@umass.edu";
        int result =registrationUtil.registrationHandler(
            username,
            hashedPassword,
            email,
        ""
        );
        boolean responseOk = (result >= 200 && result < 300);
        if (!responseOk){
            System.out.println("Error registering user.");
            return;
        }
        int res = LoginUtil.loginHandler(username, "password");
        assertTrue((res >= 200 && res < 300));
    }

    @Test
    void loginSuccess(){
        // add a test user to the database w/ the following 
        // INSERT INTO users (username, email, password_hash, phone) VALUES ('testuser', 'test@umass.edu', '$2a$10$g.bPICv5JEm5o7937eFZ.uMYSgrYbaZ2NtUf8o3PmY71DYDgL19Zm', '123456789');

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
