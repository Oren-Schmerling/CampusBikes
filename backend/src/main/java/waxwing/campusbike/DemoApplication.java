package waxwing.campusbike;
import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import waxwing.campusbike.auth.LoginUtil;
import waxwing.campusbike.auth.registrationUtil;

@SpringBootApplication
@RestController
public class DemoApplication {
    public static void main(String[] args) {
      SpringApplication.run(DemoApplication.class, args);
    }
    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
      return String.format("Hello %s!", name);
    }

    @PostMapping("/users")
    public int register(
      @RequestParam(value = "username") String username,
      @RequestParam(value = "pwHash") String pwHash,
      @RequestParam(value = "email") String email,
      @RequestParam(value = "phone", defaultValue = "") String phone
    ) throws URISyntaxException, IOException{
      return registrationUtil.registrationHandler(username, pwHash, email, phone);
    }

    @GetMapping("/login")
    public int login(
      @RequestParam(value = "username") String username,
      @RequestParam(value = "plain_pass") String plain_pass
    ) {
      // should receive username and password from user as plain text
      return LoginUtil.loginHandler(username, plain_pass);
    }
}
