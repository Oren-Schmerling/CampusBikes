package waxwing.campusbike;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import waxwing.campusbike.types.dto.LoginRequest;

@SpringBootTest // (webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LoginUtilTests {

  @LocalServerPort
  private int port;

  @Autowired
  private TestRestTemplate restTemplate;

  private String getBaseUrl() {
    return "http://localhost:" + port + "/auth/signin";
  }

  @Test
  void test_hardcoded_user() {
    LoginRequest request = new LoginRequest();
    request.setUsername("testuser");
    request.setPassword("hashed_pass");

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<LoginRequest> entity = new HttpEntity<LoginRequest>(request, headers);

    ResponseEntity<String> response = restTemplate.postForEntity(getBaseUrl(), entity, String.class);

    System.out.println("Response Status: " + response.getStatusCode());
    System.out.println("Response Body: " + response.getBody());

    assertEquals(HttpStatus.OK, response.getStatusCode());
  }
}
