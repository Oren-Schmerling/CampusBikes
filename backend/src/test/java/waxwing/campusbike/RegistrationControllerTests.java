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

import waxwing.campusbike.types.dto.RegistrationRequest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RegistrationControllerTests {

  @LocalServerPort
  private int port;

  @Autowired
  private TestRestTemplate restTemplate;

  private String getBaseUrl() {
    return "http://localhost:" + port + "/auth/register";
  }

  @Test
  void testInvalidEmail() {
    RegistrationRequest request = new RegistrationRequest();
    request.setUsername("testuser");
    request.setPassword("password123");
    request.setEmail("notAnEmail");
    request.setPhone("");
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<RegistrationRequest> entity = new HttpEntity<>(request, headers);

    ResponseEntity<String> response = restTemplate.postForEntity(getBaseUrl(), entity, String.class);

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertEquals("{\"message\":\"Invalid email format\"}", response.getBody());
  }

  @Test
  void testNonUMassEmail() {
    HttpHeaders headers = new HttpHeaders();
    RegistrationRequest request = new RegistrationRequest();
    request.setUsername("testuser");
    request.setPassword("password123");
    request.setEmail("user@gmail.com");
    request.setPhone("");
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<RegistrationRequest> entity = new HttpEntity<>(request, headers);

    ResponseEntity<String> response = restTemplate.postForEntity(getBaseUrl(), entity, String.class);

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertEquals("{\"message\":\"Email must be a UMass email\"}", response.getBody());
  }
}
