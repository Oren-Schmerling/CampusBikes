package waxwing.campusbike;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Env {

  @Value("${POSTGREST_URL}")
  private String POSTGREST_URL;

  public String getPOSTGREST_URL() {
    return POSTGREST_URL;
  }

}
