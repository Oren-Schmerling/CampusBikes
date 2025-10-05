package waxwing.campusbike;

import waxwing.campusbike.auth.EmailValidity;
import waxwing.campusbike.auth.RegistrationUtil;
import waxwing.campusbike.auth.util.PasswordUtil;
import waxwing.campusbike.auth.util.VerificationUtil;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import java.util.UUID;

@SpringBootTest
public class RegistrationUtilTests {

  @Autowired // Enable Spring to inject the RegistrationUtil bean
  private RegistrationUtil registrationUtil;

  @Test
  void testEmailValidityInvalid() {
    VerificationUtil verificationUtil = new VerificationUtil();
    assertEquals(verificationUtil.verifyEmail("notAnEmail"), EmailValidity.INVALID);
  }

  @Test
  void testEmailValidityNonUMass() {
    VerificationUtil verificationUtil = new VerificationUtil();
    assertEquals(verificationUtil.verifyEmail("normalemail@gmail.com"), EmailValidity.NOT_UMASS);
  }

  @Test
  void testEmailValidityValid() {
    VerificationUtil verificationUtil = new VerificationUtil();
    assertEquals(verificationUtil.verifyEmail("normalemail@umass.edu"), EmailValidity.VALID);
  }

  @Test
  void testRegistrationHandlerSuccessNoPhone() {
    String username = UUID.randomUUID().toString();
    String hashedPassword = PasswordUtil.hashPassword("password");
    String email = username + "@umass.edu";
    int result = registrationUtil.registrationHandler(
        username,
        hashedPassword,
        email,
        "");
    boolean responseOk = (result >= 200 && result < 300);
    assertTrue(responseOk);
  }

  @Test
  void testRegistrationHandlerSuccessWithPhone() {
    String username = UUID.randomUUID().toString();
    String hashedPassword = PasswordUtil.hashPassword("password");
    String email = username + "@umass.edu";
    int result = registrationUtil.registrationHandler(
        username,
        hashedPassword,
        email,
        "4135459400");
    boolean responseOk = (result >= 200 && result < 300);
    assertTrue(responseOk);
  }

  @Test
  void testRegistrationHandlerNotUMass() {
    String username = UUID.randomUUID().toString();
    String hashedPassword = PasswordUtil.hashPassword("password");
    String email = username + "@gmail.com";
    int result = registrationUtil.registrationHandler(
        username,
        hashedPassword,
        email,
        "");
    boolean responseOk = (result >= 200 && result < 300);
    assertFalse(responseOk);
  }

  @Test
  void testRegistrationHandlerBadPhone() {
    String username = UUID.randomUUID().toString();
    String hashedPassword = PasswordUtil.hashPassword("password");
    String email = username + "@umass.edu";
    int result = registrationUtil.registrationHandler(
        username,
        hashedPassword,
        email,
        "1234");
    boolean responseOk = (result >= 200 && result < 300);
    assertFalse(responseOk);
  }

  @Test
  void testRegistrationHandlerExistingUsername() {
    String username = "biker";
    String hashedPassword = PasswordUtil.hashPassword("password");
    String email = username + "@umass.edu";
    registrationUtil.registrationHandler(
        username,
        hashedPassword,
        email,
        "");
    int result = registrationUtil.registrationHandler(
        username,
        hashedPassword,
        email,
        "");
    boolean responseOk = (result >= 200 && result < 300);
    assertFalse(responseOk);
  }

}
