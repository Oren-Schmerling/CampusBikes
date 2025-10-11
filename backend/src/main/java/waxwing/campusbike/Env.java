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
  
  @Value("${POSTGRES_URL}")
  private String POSTGRES_URL;

  public String getPOSTGRES_URL() {
    return POSTGRES_URL;
  }

  @Value("${POSTGRES_PASSWORD}")
  private String POSTGRES_PASSWORD;

  public String getPOSTGRES_PASSWORD() {
    return POSTGRES_PASSWORD;
  }

  @Value("${POSTGRES_USER}")
  private String POSTGRES_USER;

  public String getPOSTGRES_USER() {
    return POSTGRES_USER;
  }
}