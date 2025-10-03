package waxwing.campusbike;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import waxwing.campusbike.auth.RegistrationUtil;

@SpringBootApplication
@RestController
public class DemoApplication {

  @Autowired // Enable Spring to inject the RegistrationUtil bean
  private RegistrationUtil registrationUtil;

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
      @RequestParam(value = "phone", defaultValue = "") String phone) {
    return registrationUtil.registrationHandler(username, pwHash, email, phone);

  }
}
