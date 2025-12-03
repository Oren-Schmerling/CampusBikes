package waxwing.campusbike;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import waxwing.campusbike.auth.util.JwtUtil;
import waxwing.campusbike.booking.controller.BookingController;
import waxwing.campusbike.booking.service.BookingService;
import waxwing.campusbike.types.Rental;
import waxwing.campusbike.types.dto.BookingAvailability;
import waxwing.campusbike.types.dto.BookingRequest;

/**
 * Unit tests for {@link BookingController}.
 * <p>
 * The controller is exercised with MockMvc; the underlying
 * {@link BookingService}
 * is mocked so we can verify each branch (success, conflict, generic failure).
 */
@WebMvcTest(BookingController.class)
@AutoConfigureMockMvc(addFilters = false)
class BookingControllerTest {

  @Autowired
  private MockMvc mockMvc;
  @Autowired
  private ObjectMapper mapper;

  @MockitoBean
  private BookingService bookingService;
  // -------------------------------------------------------------------------
  // Helper – dummy JWT token (the controller only extracts the username)
  // -------------------------------------------------------------------------
  private static final String DUMMY_TOKEN = "Bearer dummy.jwt.token";
  private static final String USERNAME = "testUser";

  private MockedStatic<JwtUtil> jwtMock; // holds the static mock

  @BeforeEach
  void setUp() {
    // Every test will see the same static mock
    jwtMock = mockStatic(JwtUtil.class);
    // By default return the constant USERNAME for any token
    jwtMock.when(() -> JwtUtil.getUsernameFromToken(anyString()))
        .thenReturn(USERNAME);
  }

  @AfterEach
  void tearDown() {
    jwtMock.close(); // important – releases the static mock
  }

  // -------------------------------------------------------------------------
  // /booking/rent – POST
  // -------------------------------------------------------------------------
  @Nested
  @DisplayName("POST /booking/rent")
  class RentBike {

    @Test
    @DisplayName("200 OK – successful rental")
    void rentSuccess() throws Exception {
      BookingRequest req = new BookingRequest(); // populate as needed
      when(bookingService.rentBike(eq(USERNAME), any(BookingRequest.class))).thenReturn(200);

      mockMvc.perform(post("/booking/rent")
          .contentType(MediaType.APPLICATION_JSON)
          .content(mapper.writeValueAsString(req))
          .header("Authorization", DUMMY_TOKEN))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.statusCode").value(200))
          .andExpect(jsonPath("$.message").value("Bike rental successful."));

      verify(bookingService).rentBike(eq(USERNAME), any(BookingRequest.class));
    }

    @Test
    @DisplayName("409 Conflict – listing already booked")
    void rentConflict() throws Exception {
      BookingRequest req = new BookingRequest();
      when(bookingService.rentBike(eq(USERNAME), any(BookingRequest.class))).thenReturn(409);

      mockMvc.perform(post("/booking/rent")
          .contentType(MediaType.APPLICATION_JSON)
          .content(mapper.writeValueAsString(req))
          .header("Authorization", DUMMY_TOKEN))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.statusCode").value(409))
          .andExpect(jsonPath("$.conflict").value(true))
          .andExpect(jsonPath("$.message")
              .value("Sorry, this listing was just booked for the selected time!"));

      verify(bookingService).rentBike(eq(USERNAME), any(BookingRequest.class));
    }

    @Test
    @DisplayName("Other error – generic failure")
    void rentOtherError() throws Exception {
      BookingRequest req = new BookingRequest();
      when(bookingService.rentBike(eq(USERNAME), any(BookingRequest.class))).thenReturn(500);

      mockMvc.perform(post("/booking/rent")
          .contentType(MediaType.APPLICATION_JSON)
          .content(mapper.writeValueAsString(req))
          .header("Authorization", DUMMY_TOKEN))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.statusCode").value(500))
          .andExpect(jsonPath("$.message").value("Bike rental failed."));

      verify(bookingService).rentBike(eq(USERNAME), any(BookingRequest.class));
    }
  }

  // -------------------------------------------------------------------------
  // /booking/rentals/{listingID} – GET
  // -------------------------------------------------------------------------
  @Nested
  @DisplayName("GET /booking/rentals/{listingID}")
  class GetBookingsByListing {

    @Test
    @DisplayName("200 OK – bookings returned")
    void fetchSuccess() throws Exception {
      Long listingId = 42L;
      List<BookingAvailability> dummy = List.of(new BookingAvailability());
      when(bookingService.getBookingsByListingID(listingId)).thenReturn(dummy);

      mockMvc.perform(get("/booking/rentals/{listingID}", listingId))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.statusCode").value(200))
          .andExpect(jsonPath("$.bookings").isArray());

      verify(bookingService).getBookingsByListingID(listingId);
    }

    @Test
    @DisplayName("500 Internal Server Error – service throws")
    void fetchFailure() throws Exception {
      Long listingId = 99L;
      when(bookingService.getBookingsByListingID(listingId))
          .thenThrow(new RuntimeException("DB down"));

      mockMvc.perform(get("/booking/rentals/{listingID}", listingId))
          .andExpect(status().isInternalServerError())
          .andExpect(jsonPath("$.statusCode").value(500))
          .andExpect(jsonPath("$.message")
              .value("Failed to fetch bookings: DB down"));

      verify(bookingService).getBookingsByListingID(listingId);
    }
  }

  // -------------------------------------------------------------------------
  // /booking/rentals – GET (all bookings)
  // -------------------------------------------------------------------------
  @Nested
  @DisplayName("GET /booking/rentals")
  class ReturnAllBookings {

    @Test
    @DisplayName("200 OK – list of all rentals")
    void fetchAll() throws Exception {
      List<Rental> rentals = List.of(new Rental(), new Rental());
      when(bookingService.returnAllBookings()).thenReturn(rentals);

      mockMvc.perform(get("/booking/rentals"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.message")
              .value("Fetched all bookings successfully."))
          .andExpect(jsonPath("$.count").value(rentals.size()))
          .andExpect(jsonPath("$.bookings").isArray());

      verify(bookingService).returnAllBookings();
    }
  }
}
