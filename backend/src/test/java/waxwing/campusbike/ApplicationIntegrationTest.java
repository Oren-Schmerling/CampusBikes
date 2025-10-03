package waxwing.campusbike;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.net.URISyntaxException;

public class ApplicationIntegrationTest {

  private static final String POSTGREST_HEALTH_URL = "http://localhost:3000/";
  private static final int TIMEOUT_SECONDS = 10;

  @Test
  void postgrestIsHealthy() throws InterruptedException, URISyntaxException, IOException {
    waitForServiceHealth(POSTGREST_HEALTH_URL);
    assertTrue(true);
  }

  private void waitForServiceHealth(String url) throws InterruptedException {
    RestTemplate restTemplate = new RestTemplate();
    long startTime = System.currentTimeMillis();

    while (System.currentTimeMillis() - startTime < TIMEOUT_SECONDS * 1000) {
      try {
        String response = restTemplate.getForObject(url, String.class);
        if (response != null) {
          System.out.println("Postgrest is healthy: " + response);
          return; // Service is healthy, exit the method
        }
      } catch (Exception e) {
        // Service is not healthy yet, wait and retry
        System.out.println("Waiting for service to be healthy...");
      }
      Thread.sleep(2000); // Wait for 2 seconds before retrying
    }

    throw new RuntimeException("Service did not become healthy in time.");
  }
}
