package waxwing.campusbike;

import waxwing.campusbike.auth.PasswordUtil;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordUtilTestsTest {

  @Test
  void testHashPasswordNullInput() {
    assertThrows(IllegalArgumentException.class, () -> PasswordUtil.hashPassword(null));
  }

  @Test
  void testHashPasswordDifferentPasswords() {
    String password1 = "password1";
    String password2 = "password2";
    String hash1 = PasswordUtil.hashPassword(password1);
    String hash2 = PasswordUtil.hashPassword(password2);
    assertNotEquals(hash1, hash2, "Different passwords should have different hashes");
  }

  @Test
  void testVerifyPasswordCorrect() {
    String password = "correctHorseBatteryStaple";
    String hash = PasswordUtil.hashPassword(password);
    assertTrue(PasswordUtil.verifyPassword(password, hash), "Password should verify with its hash");
  }

  @Test
  void testVerifyPasswordIncorrect() {
    String password = "password123";
    String wrongPassword = "password124";
    String hash = PasswordUtil.hashPassword(password);
    assertFalse(PasswordUtil.verifyPassword(wrongPassword, hash), "Wrong password should not verify");
  }

  @Test
  void testVerifyPasswordNullInput() {
    String hash = PasswordUtil.hashPassword("abc");
    assertThrows(IllegalArgumentException.class, () -> PasswordUtil.verifyPassword(null, hash));
    assertThrows(IllegalArgumentException.class, () -> PasswordUtil.verifyPassword("abc", null));
  }
}