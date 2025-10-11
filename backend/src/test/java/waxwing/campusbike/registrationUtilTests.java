package waxwing.campusbike;
import waxwing.campusbike.auth.registrationUtil;
import waxwing.campusbike.auth.util.PasswordUtil;

import org.junit.jupiter.api.Test;
import waxwing.campusbike.auth.EmailValidity;

import static org.junit.jupiter.api.Assertions.*;
import java.util.UUID;

import java.io.IOException;
import java.net.URISyntaxException;


public class registrationUtilTests {

  @Test
  void testEmailValidityInvalid(){
    assertEquals(registrationUtil.verifyEmail("notAnEmail"), EmailValidity.INVALID);
  }

  @Test
  void testEmailValidityNonUMass(){
    assertEquals(registrationUtil.verifyEmail("normalemail@gmail.com"), EmailValidity.NOT_UMASS);
  }

  @Test
  void testEmailValidityValid(){
    assertEquals(registrationUtil.verifyEmail("normalemail@umass.edu"), EmailValidity.VALID);
  }

  @Test
  void testRegistrationHandlerSuccess() throws URISyntaxException, IOException{
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
    assertTrue(responseOk);
  }

  @Test
  void testRegistrationHandlerFailure() throws URISyntaxException, IOException{
    String username = UUID.randomUUID().toString();
    String hashedPassword = PasswordUtil.hashPassword("password");
    String email = username + "@gmail.com";
    int result =registrationUtil.registrationHandler(
      username,
      hashedPassword,
      email,
      ""
      );
    boolean responseOk = (result >= 200 && result < 300);
    assertFalse(responseOk);
  }
  
}
