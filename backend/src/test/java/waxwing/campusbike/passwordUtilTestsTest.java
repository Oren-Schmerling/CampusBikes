package waxwing.campusbike;
import waxwing.campusbike.auth.passwordUtil;  
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;




public class passwordUtilTestsTest {

    @Test
    void testHashPasswordNullInput() {
        assertThrows(IllegalArgumentException.class, () -> passwordUtil.hashPassword(null));
    }
    

    @Test
    void testHashPasswordDifferentPasswords() {
        String password1 = "password1";
        String password2 = "password2";
        String hash1 = passwordUtil.hashPassword(password1);
        String hash2 = passwordUtil.hashPassword(password2);
        assertNotEquals(hash1, hash2, "Different passwords should have different hashes");
    }

    @Test
    void testVerifyPasswordCorrect() {
        String password = "correctHorseBatteryStaple";
        String hash = passwordUtil.hashPassword(password);
        assertTrue(passwordUtil.verifyPassword(password, hash), "Password should verify with its hash");
    }

    @Test
    void testVerifyPasswordIncorrect() {
        String password = "password123";
        String wrongPassword = "password124";
        String hash = passwordUtil.hashPassword(password);
        assertFalse(passwordUtil.verifyPassword(wrongPassword, hash), "Wrong password should not verify");
    }

    @Test
    void testVerifyPasswordNullInput() {
        String hash = passwordUtil.hashPassword("abc");
        assertThrows(IllegalArgumentException.class, () -> passwordUtil.verifyPassword(null, hash));
        assertThrows(IllegalArgumentException.class, () -> passwordUtil.verifyPassword("abc", null));
    }
}