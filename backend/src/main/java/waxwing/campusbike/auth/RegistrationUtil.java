package waxwing.campusbike.auth;

import waxwing.campusbike.Env;
import waxwing.campusbike.types.User;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;
import waxwing.campusbike.auth.PasswordUtil;

@Service
public class RegistrationUtil {

  private Env env;
  private ObjectMapper objectMapper;

  @Autowired
  public RegistrationUtil(Env env) {
    this.env = env;
    this.objectMapper = new ObjectMapper();

  }

  public EmailValidity verifyEmail(String email) {
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

  // TODO: Make this async? (unssure what's desired behavior ask team)
  // sends a post request to postgrest to insert the User into the users table
  private int uploadUser(User user) {
    String jsonInputString = "";
    try {
      jsonInputString = objectMapper.writeValueAsString(user);
    } catch (JsonProcessingException e) {
      // TODO Auto-generated catch block
      System.out.println("JsonProcessingException stack trace:");
      e.printStackTrace();
      return 499;
    }
    URI POSTGREST_URL;
    try {
      POSTGREST_URL = new URI(env.getPOSTGREST_URL() + "/users");
    } catch (URISyntaxException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      return 498;
    }
    HttpRequest request = HttpRequest.newBuilder()
        .uri(POSTGREST_URL)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(jsonInputString))
        .build();

    HttpClient httpClient = HttpClient.newHttpClient();
    try {
      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      return response.statusCode();
    } catch (InterruptedException | IOException e) {
      // TODO Auto-generated catch block
      System.out.println("Unhandled exception stack trace:");
      e.printStackTrace();
      return 497;
    }
  }

  public int registrationHandler(String username, String pwHash, String email, String phone) {
    EmailValidity emailStatus = this.verifyEmail(email);
    if (emailStatus == EmailValidity.INVALID) {
      return 470;
    } else if (emailStatus == EmailValidity.NOT_UMASS) {
      return 471;
    } // else, emailStatus is VALID

    // make sure that usernames and emails are unique before trying to upload
    HttpClient client = HttpClient.newHttpClient();
    String pgrestUrl = env.getPOSTGREST_URL();
    URI postgrestUrl;
    try {
      postgrestUrl = new URI(pgrestUrl + "/users?or=(username.eq.<username>,email.eq.<email>)"
          .replace("<username>", username)
          .replace("<email>", email));
    } catch (URISyntaxException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      return 496;
    }
    HttpRequest request = HttpRequest.newBuilder()
        .uri(postgrestUrl)
        .GET()
        .build();

    HttpResponse<String> response;
    try {
      response = client.send(request, HttpResponse.BodyHandlers.ofString());
    } catch (IOException | InterruptedException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      return 495;
    }

    int responseCode = response.statusCode();
    if (responseCode != 200) {
      return responseCode; // some error occurred
    }
    String responseBody = response.body();
    User[] existingUsers;
    try {
      existingUsers = objectMapper.readValue(responseBody, User[].class);
    } catch (JsonProcessingException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      return 450;
    }

    if (existingUsers.length > 0) {
      return 409; // conflict, username already exists
    }

    User newUser = new User(username, email, PasswordUtil.hashPassword(pwHash)); // used function from password util to hash the password stored in the db
    if (phone.isBlank()) {
      newUser.setPhone(phone);
    } else { // phone number isn't empty
      PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
      PhoneNumber number;
      try {
        number = phoneUtil.parse(phone, "US");
      } catch (NumberParseException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
        return 494;
      }
      if (phoneUtil.isValidNumber(number)) {
        newUser.setPhone(phone);
      } else {
        return 423;
      }
    }

    return uploadUser(newUser);
  }
}
