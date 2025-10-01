package waxwing.campusbike.auth;

import waxwing.campusbike.types.User;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

import org.apache.commons.validator.routines.EmailValidator;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;

public class registrationUtil {

  public static EmailValidity verifyEmail(String email) {
    EmailValidator validator = EmailValidator.getInstance();
    if (!validator.isValid(email)) {
      return EmailValidity.INVALID;
    } else if (!email.contains("umass.edu")) { // do NOT set this to "@umass.edu" because an alias like @cns.umass.edu
                                               // would fail
      return EmailValidity.NOT_UMASS;
    } else {
      return EmailValidity.VALID;
    }
  }

  // todo: implement response codes and set return type to response
  // todo: error handling
  private static int uploadUser(User user) throws URISyntaxException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    String jsonInputString = objectMapper.writeValueAsString(user);

    URI POSTGREST_URL = new URI("http://localhost:3000/users"); // move to .env
    URL url = POSTGREST_URL.toURL();
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();

    // Set the request method to POST
    connection.setRequestMethod("POST");
    connection.setRequestProperty("Content-Type", "application/json");
    connection.setDoOutput(true);

    // Write the JSON input string to the output stream
    try (OutputStream os = connection.getOutputStream()) {
      byte[] input = jsonInputString.getBytes("utf-8");
      os.write(input, 0, input.length);
    }

    // Get the response code
    return connection.getResponseCode();
  }

  // todo: error handling
  public static int registrationHandler(String username, String pwHash, String email, String phone)
      throws URISyntaxException, IOException, NumberParseException {
    EmailValidity emailStatus = verifyEmail(email);
    if (emailStatus == EmailValidity.INVALID) {
      return 400;
    } else if (emailStatus == EmailValidity.NOT_UMASS) {
      return 400;
    } // else, emailStatus is VALID
    // todo: make sure that usernames are unique before trying to upload

    User newUser = new User(username, email, pwHash);
    if (phone != "") {
      newUser.setPhone(phone);
    } else { // phone number isn't empty
      PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
      PhoneNumber number = phoneUtil.parse(phone, "US");
      if (phoneUtil.isValidNumber(number)) {
        newUser.setPhone(phone);
      } else {
        return 400;
      }
    }

    return uploadUser(newUser);
  }
}
