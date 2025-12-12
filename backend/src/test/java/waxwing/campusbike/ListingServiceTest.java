package waxwing.campusbike;

import waxwing.campusbike.listing.service.ListingService;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.List;

import javax.sql.DataSource;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import waxwing.campusbike.Env;
import waxwing.campusbike.types.Bike;
import waxwing.campusbike.types.dto.BikeCreateRequest;

public class ListingServiceTest {

    private ListingService listingService;
    private DataSource dataSource;
    private Connection connection;
    private PreparedStatement stmt;
    private ResultSet rs;

    @BeforeEach
    void setup() throws Exception {
        dataSource = mock(DataSource.class);
        connection = mock(Connection.class);
        stmt = mock(PreparedStatement.class);
        rs = mock(ResultSet.class);

        Env env = mock(Env.class);
        listingService = new ListingService(env);

        // Inject mocked datasource using reflection
        var field = ListingService.class.getDeclaredField("dataSource");
        field.setAccessible(true);
        field.set(listingService, dataSource);
    }

    // ---------------- CREATE BIKE TESTS ----------------

    @Test
    void testCreateBikeReturns201WhenSuccessful() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);

        // mock getUser()
        when(connection.prepareStatement("SELECT * FROM users WHERE username = ?")).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true);
        when(rs.getLong("id")).thenReturn(1L);
        when(rs.getString("username")).thenReturn("bob");
        when(rs.getString("email")).thenReturn("bob@example.com");
        when(rs.getString("phone")).thenReturn("123");

        // mock uploadBike
        when(connection.prepareStatement(
            "INSERT INTO bikes (owner_id, title, description, location, price_per_hour, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )).thenReturn(stmt);
        when(stmt.executeUpdate()).thenReturn(1);

        BikeCreateRequest req = new BikeCreateRequest();
        req.setTitle("Title");
        req.setDescription("Desc");
        req.setLocation("Campus");
        req.setPricePerHour(BigDecimal.valueOf(5));
        req.setLatitude(10.0);
        req.setLongitude(20.0);
        req.setStatus("AVAILABLE");

        int result = listingService.createBike("bob", req);

        assertEquals(201, result);
    }

    @Test
    void testCreateBikeReturns500WhenInsertFails() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);

        // mock getUser()
        when(connection.prepareStatement("SELECT * FROM users WHERE username = ?")).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true);
        when(rs.getLong("id")).thenReturn(1L);

        // mock insert failure
        when(connection.prepareStatement(anyString())).thenReturn(stmt);
        when(stmt.executeUpdate()).thenReturn(-1);

        BikeCreateRequest req = new BikeCreateRequest();
        req.setTitle("Title");
        req.setDescription("Desc");
        req.setLocation("Campus");
        req.setPricePerHour(BigDecimal.valueOf(5));
        req.setLatitude(10.0);
        req.setLongitude(20.0);
        req.setStatus("AVAILABLE");

        int result = listingService.createBike("bob", req);

        assertEquals(500, result);
    }


    @Test
    void testCreateBikeNullRequestThrowsException() {
        assertThrows(NullPointerException.class, () -> {
            listingService.createBike("bob", null);
        });
    }

    // ---------------- RETURN ALL BIKES TEST ----------------

    @Test
    void testReturnAllBikes() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);

        when(connection.prepareStatement("SELECT * FROM bikes")).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);

        when(rs.next()).thenReturn(true, false);
        when(rs.getLong("owner_id")).thenReturn(99L);
        when(rs.getString("title")).thenReturn("Road Bike");
        when(rs.getString("description")).thenReturn("Fast bike");
        when(rs.getString("location")).thenReturn("Campus");
        when(rs.getBigDecimal("price_per_hour")).thenReturn(BigDecimal.valueOf(10));
        when(rs.getDouble("latitude")).thenReturn(5.1);
        when(rs.getDouble("longitude")).thenReturn(7.9);
        when(rs.getString("status")).thenReturn("AVAILABLE");
        when(rs.getLong("id")).thenReturn(123L);
        when(rs.getTimestamp("created_at")).thenReturn(Timestamp.valueOf("2024-01-01 10:00:00"));

        List<Bike> list = listingService.returnAllBikes();

        assertEquals(1, list.size());
        assertEquals("Road Bike", list.get(0).getTitle());
        assertEquals(123L, list.get(0).getId());
    }

    // ----------- RETURN ALL BIKES EDGE CASES -----------

    @Test
    void testReturnAllBikesEmptyTable() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement("SELECT * FROM bikes")).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);

        // simulate empty result
        when(rs.next()).thenReturn(false);

        List<Bike> list = listingService.returnAllBikes();
        assertTrue(list.isEmpty());
    }

    @Test
    void testReturnAllBikesSQLExceptionHandled() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement("SELECT * FROM bikes")).thenThrow(new SQLException());

        List<Bike> list = listingService.returnAllBikes();
        assertTrue(list.isEmpty());
    }


    @Test
    void testCreateBikeWithInvalidDataReturns500() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);

        // mock getUser() succeeds
        when(connection.prepareStatement("SELECT * FROM users WHERE username = ?")).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true);
        when(rs.getLong("id")).thenReturn(1L);

        // mock insert fails
        when(connection.prepareStatement(anyString())).thenReturn(stmt);
        when(stmt.executeUpdate()).thenThrow(new SQLException());

        BikeCreateRequest req = new BikeCreateRequest(); // missing some fields
        req.setLatitude(0);
        req.setLongitude(0);

        int result = listingService.createBike("bob", req);
        assertEquals(500, result);
    }
}
