package waxwing.campusbike.auth.util;

import org.apache.commons.validator.routines.EmailValidator;
import waxwing.campusbike.auth.EmailValidity;

public class VerificationUtil {
    public static EmailValidity verifyEmail(String email) {
        EmailValidator validator = EmailValidator.getInstance();
        if (!validator.isValid(email)) {
            return EmailValidity.INVALID;
        } else if (!email.contains("umass.edu")) {
            return EmailValidity.NOT_UMASS;
        } else {
            return EmailValidity.VALID;
        }
    }
}
