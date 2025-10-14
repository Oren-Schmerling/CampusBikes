package waxwing.campusbike;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

import waxwing.campusbike.auth.service.LoginService;
import waxwing.campusbike.types.dto.LoginRequest;

@SpringBootTest
class LoginUtilTests {

    @Autowired
    private LoginService loginService;

    @Test
    void hardcoded_user() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("hashed_pass");

        var result = loginService.loginUser(request);
        assertNotNull(result);
    }
}
