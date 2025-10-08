package waxwing.campusbike.auth.service;

import waxwing.campusbike.Env;
import waxwing.campusbike.auth.util.PasswordUtil;
import waxwing.campusbike.auth.util.VerificationUtil;
import waxwing.campusbike.auth.EmailValidity;
import waxwing.campusbike.types.User;
import waxwing.campusbike.types.dto.RegistrationRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.web.util.UriComponentsBuilder;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;

@Service
public class RegistrationService {

    private final Env env;
    private final ObjectMapper objectMapper;

    @Autowired
    public RegistrationService(Env env) {
        this.env = env;
        this.objectMapper = new ObjectMapper();
    }

    /*
     * Handles user registration.
     * Validates email and phone number, checks for existing users,
     * hashes the password, and uploads the new user to the database.
     * Returns appropriate status codes based on the outcome.
     */
    public int registerUser(RegistrationRequest request) {
        EmailValidity emailStatus = VerificationUtil.verifyEmail(request.getEmail());
        if (emailStatus == EmailValidity.INVALID) return 470;
        if (emailStatus == EmailValidity.NOT_UMASS) return 471;

        if (userExists(request.getUsername(), request.getEmail())) return 409;

        User newUser = new User(
            request.getUsername(),
            request.getEmail(),
            PasswordUtil.hashPassword(request.getPassword())
        );

        String phone = request.getPhone();
        if (phone != null && !phone.isBlank()) {
            PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
            try {
                PhoneNumber number = phoneUtil.parse(phone, "US");
                if (!phoneUtil.isValidNumber(number)) return 423;
                newUser.setPhone(phone);
            } catch (NumberParseException e) {
                e.printStackTrace();
                return 494;
            }
        }

        return uploadUser(newUser);
    }

    /*
     * Check if a user with the given username or email already exists in the database.
     * Returns true if such a user exists, false otherwise.
     */
    private boolean userExists(String username, String email) {
        HttpClient client = HttpClient.newHttpClient();

        try {
            // Build the full URI safely and automatically encode parameters
            URI uri = UriComponentsBuilder
                    .fromHttpUrl(env.getPOSTGREST_URL() + "/users")
                    .queryParam("or", String.format("(username.eq.%s,email.eq.%s)", username, email))
                    .build(true) // true = don't re-encode the already-safe parts like parentheses
                    .toUri();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Failed to check user existence, response code: " + response.statusCode());
            }

            User[] existingUsers = objectMapper.readValue(response.body(), User[].class);
            return existingUsers.length > 0;

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Error checking user existence", e);
        }
    }





    /*  
     * Uploads the given user to the database.
     * Returns the HTTP status code from the POST request.
     */
    private int uploadUser(User user) {
        try {
            String jsonInputString = objectMapper.writeValueAsString(user);
            URI POSTGREST_URL = new URI(env.getPOSTGREST_URL() + "/users");
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(POSTGREST_URL)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonInputString))
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode();
        } catch (IOException | InterruptedException | URISyntaxException e) {
            e.printStackTrace();
            return 497;
        }
    }
}
