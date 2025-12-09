package waxwing.campusbike;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import waxwing.campusbike.listing.service.ListingService;
import waxwing.campusbike.types.Bike;
import waxwing.campusbike.types.dto.BikeCreateRequest;
import waxwing.campusbike.types.dto.BikeUpdateRequest;

@ExtendWith(MockitoExtension.class)
public class ListingServiceTests {
    
    @Mock
    private DataSource dataSource;
    
    @Mock
    private Connection connection;
    
    @Mock
    private PreparedStatement preparedStatement;
    
    @Mock
    private ResultSet resultSet;
    
    @Mock
    private Env env;
    
    private ListingService listingService;
    
    private BikeCreateRequest createRequest;
    private BikeUpdateRequest updateRequest;
    private Bike testBike;
    
    @BeforeEach
    void setUp() throws SQLException {
        // Create the service and inject the mocked DataSource using ReflectionTestUtils
        listingService = new ListingService(env);
        ReflectionTestUtils.setField(listingService, "dataSource", dataSource);
        
        // Initialize test data
        createRequest = new BikeCreateRequest();
        createRequest.setTitle("Mountain Bike");
        createRequest.setDescription("Great bike for trails");
        createRequest.setLocation("Campus North");
        createRequest.setPricePerHour(new BigDecimal("5.00"));
        createRequest.setLatitude(42.3736);
        createRequest.setLongitude(-72.5199);
        createRequest.setStatus("available");
        
        updateRequest = new BikeUpdateRequest();
        updateRequest.setTitle("Updated Mountain Bike");
        updateRequest.setDescription("Updated description");
        updateRequest.setLocation("Campus South");
        updateRequest.setPricePerHour(new BigDecimal("6.00"));
        updateRequest.setLatitude(42.3737);
        updateRequest.setLongitude(-72.5200);
        updateRequest.setStatus("available");
        
        testBike = new Bike(
            1L,
            "Mountain Bike",
            "Great bike for trails",
            "Campus North",
            new BigDecimal("5.00"),
            42.3736,
            -72.5199,
            "available"
        );
        
        // Default mock behavior
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
    }
    
    
    @Test
    void testCreateBike_Success() throws SQLException {
        // Arrange
        mockGetUserSuccess();
        when(preparedStatement.executeUpdate()).thenReturn(1);
        
        // Act
        int result = listingService.createBike("testuser", createRequest);
        
        // Assert
        assertEquals(201, result);
        verify(preparedStatement, atLeastOnce()).setString(eq(2), eq(createRequest.getTitle()));
        verify(preparedStatement, atLeastOnce()).setString(eq(3), eq(createRequest.getDescription()));
        verify(preparedStatement, atLeast(1)).executeUpdate();
    }
    
    @Test
    void testCreateBike_DatabaseError() throws SQLException {
        // Arrange
        mockGetUserSuccess();
        // Mock the executeUpdate to throw SQLException on the second call (bike insert)
        when(preparedStatement.executeUpdate())
            .thenReturn(0) // First call (won't happen for query)
            .thenThrow(new SQLException("DB Error"));
        
        // Act
        int result = listingService.createBike("testuser", createRequest);
        
        // Assert
        assertEquals(500, result);
    }
    
    
    @Test
    void testUpdateBike_Success() throws SQLException {
        // Arrange
        Long bikeId = 1L;
        mockGetUserSuccess();
        mockGetBikeByIdSuccess(bikeId);
        when(preparedStatement.executeUpdate()).thenReturn(1);
        
        // Act
        int result = listingService.updateBike("testuser", bikeId, updateRequest);
        
        // Assert
        assertEquals(200, result);
        verify(preparedStatement, atLeastOnce()).setString(eq(2), eq(updateRequest.getTitle()));
        verify(preparedStatement, atLeastOnce()).setString(eq(3), eq(updateRequest.getDescription()));
        verify(preparedStatement, atLeastOnce()).setLong(eq(9), eq(bikeId));
    }
    
    @Test
    void testUpdateBike_BikeNotFound() throws SQLException {
        // Arrange
        Long bikeId = 999L;
        mockGetUserSuccess();
        mockGetBikeByIdNotFound();
        
        // Act
        int result = listingService.updateBike("testuser", bikeId, updateRequest);
        
        // Assert
        assertEquals(404, result);
    }
    
    @Test
    void testUpdateBike_Unauthorized() throws SQLException {
        // Arrange
        Long bikeId = 1L;
        
        // Mock user retrieval (returns user with ID 2)
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true, true, false);
        when(resultSet.getLong("id")).thenReturn(2L);
        when(resultSet.getString("username")).thenReturn("otheruser");
        when(resultSet.getString("email")).thenReturn("other@example.com");
        when(resultSet.getString("phone")).thenReturn("9876543210");
        
        // Mock bike retrieval (owned by user ID 1)
        when(resultSet.getLong("owner_id")).thenReturn(1L);
        when(resultSet.getString("title")).thenReturn(testBike.getTitle());
        when(resultSet.getString("description")).thenReturn(testBike.getDescription());
        when(resultSet.getString("location")).thenReturn(testBike.getLocation());
        when(resultSet.getBigDecimal("price_per_hour")).thenReturn(testBike.getPricePerHour());
        when(resultSet.getDouble("latitude")).thenReturn(testBike.getLatitude());
        when(resultSet.getDouble("longitude")).thenReturn(testBike.getLongitude());
        when(resultSet.getString("status")).thenReturn(testBike.getStatus());
        
        // Act
        int result = listingService.updateBike("otheruser", bikeId, updateRequest);
        
        // Assert
        assertEquals(403, result);
    }
    
    @Test
    void testUpdateBike_DatabaseErrorOnUpdate() throws SQLException {
        // Arrange
        Long bikeId = 1L;
        mockGetUserSuccess();
        mockGetBikeByIdSuccess(bikeId);
        when(preparedStatement.executeUpdate()).thenThrow(new SQLException("Update failed"));
        
        // Act
        int result = listingService.updateBike("testuser", bikeId, updateRequest);
        
        // Assert
        assertEquals(500, result);
    }
    
    
    @Test
    void testReturnAllBikes_Success() throws SQLException {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true, true, false);
        when(resultSet.getLong("id")).thenReturn(1L, 2L);
        when(resultSet.getLong("owner_id")).thenReturn(1L, 2L);
        when(resultSet.getString("title")).thenReturn("Bike 1", "Bike 2");
        when(resultSet.getString("description")).thenReturn("Desc 1", "Desc 2");
        when(resultSet.getString("location")).thenReturn("Loc 1", "Loc 2");
        when(resultSet.getBigDecimal("price_per_hour")).thenReturn(new BigDecimal("5.00"), new BigDecimal("6.00"));
        when(resultSet.getDouble("latitude")).thenReturn(42.37, 42.38);
        when(resultSet.getDouble("longitude")).thenReturn(-72.52, -72.53);
        when(resultSet.getString("status")).thenReturn("available", "rented");
        when(resultSet.getTimestamp("created_at")).thenReturn(Timestamp.valueOf(now));
        
        // Act
        List<Bike> bikes = listingService.returnAllBikes();
        
        // Assert
        assertEquals(2, bikes.size());
        assertEquals("Bike 1", bikes.get(0).getTitle());
        assertEquals("Bike 2", bikes.get(1).getTitle());
    }
    
    @Test
    void testReturnAllBikes_EmptyResult() throws SQLException {
        // Arrange
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);
        
        // Act
        List<Bike> bikes = listingService.returnAllBikes();
        
        // Assert
        assertTrue(bikes.isEmpty());
    }
    
    @Test
    void testReturnAllBikes_DatabaseError() throws SQLException {
        // Arrange
        when(preparedStatement.executeQuery()).thenThrow(new SQLException("Query failed"));
        
        // Act
        List<Bike> bikes = listingService.returnAllBikes();
        
        // Assert
        assertTrue(bikes.isEmpty());
    }
    
    
    @Test
    void testReturnUserBikes_Success() throws SQLException {
        // Arrange
        mockGetUserSuccess();
        LocalDateTime now = LocalDateTime.now();
        
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next())
            .thenReturn(true) // User exists
            .thenReturn(true, true, false); // Two bikes
        
        when(resultSet.getLong("id")).thenReturn(1L, 1L, 2L);
        when(resultSet.getLong("owner_id")).thenReturn(1L, 1L);
        when(resultSet.getString("username")).thenReturn("testuser");
        when(resultSet.getString("email")).thenReturn("test@example.com");
        when(resultSet.getString("phone")).thenReturn("1234567890");
        when(resultSet.getString("title")).thenReturn("User Bike 1", "User Bike 2");
        when(resultSet.getString("description")).thenReturn("Desc 1", "Desc 2");
        when(resultSet.getString("location")).thenReturn("Loc 1", "Loc 2");
        when(resultSet.getBigDecimal("price_per_hour")).thenReturn(new BigDecimal("5.00"), new BigDecimal("7.00"));
        when(resultSet.getDouble("latitude")).thenReturn(42.37, 42.38);
        when(resultSet.getDouble("longitude")).thenReturn(-72.52, -72.53);
        when(resultSet.getString("status")).thenReturn("available", "available");
        when(resultSet.getTimestamp("created_at")).thenReturn(Timestamp.valueOf(now));
        
        // Act
        List<Bike> bikes = listingService.returnUserBikes("testuser");
        
        // Assert
        assertEquals(2, bikes.size());
        assertEquals(1L, bikes.get(0).getOwnerId());
        assertEquals(1L, bikes.get(1).getOwnerId());
    }
    
    @Test
    void testReturnUserBikes_EmptyResult() throws SQLException {
        // Arrange
        mockGetUserSuccess();
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true, false); // User exists, no bikes
        
        // Act
        List<Bike> bikes = listingService.returnUserBikes("testuser");
        
        // Assert
        assertTrue(bikes.isEmpty());
    }
    
    
    private void mockGetUserSuccess() throws SQLException {
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getLong("id")).thenReturn(1L);
        when(resultSet.getString("username")).thenReturn("testuser");
        when(resultSet.getString("email")).thenReturn("test@example.com");
        when(resultSet.getString("phone")).thenReturn("1234567890");
    }
    
    private void mockGetBikeByIdSuccess(Long bikeId) throws SQLException {
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true, true, false); // User query, then bike query
        when(resultSet.getLong("id")).thenReturn(1L);
        when(resultSet.getString("username")).thenReturn("testuser");
        when(resultSet.getString("email")).thenReturn("test@example.com");
        when(resultSet.getString("phone")).thenReturn("1234567890");
        when(resultSet.getLong("owner_id")).thenReturn(1L);
        when(resultSet.getString("title")).thenReturn(testBike.getTitle());
        when(resultSet.getString("description")).thenReturn(testBike.getDescription());
        when(resultSet.getString("location")).thenReturn(testBike.getLocation());
        when(resultSet.getBigDecimal("price_per_hour")).thenReturn(testBike.getPricePerHour());
        when(resultSet.getDouble("latitude")).thenReturn(testBike.getLatitude());
        when(resultSet.getDouble("longitude")).thenReturn(testBike.getLongitude());
        when(resultSet.getString("status")).thenReturn(testBike.getStatus());
    }
    
    private void mockGetBikeByIdNotFound() throws SQLException {
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true, false); // User exists, bike doesn't
        when(resultSet.getLong("id")).thenReturn(1L);
        when(resultSet.getString("username")).thenReturn("testuser");
        when(resultSet.getString("email")).thenReturn("test@example.com");
        when(resultSet.getString("phone")).thenReturn("1234567890");
    }
}