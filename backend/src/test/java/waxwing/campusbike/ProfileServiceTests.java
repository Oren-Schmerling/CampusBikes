package waxwing.campusbike;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import waxwing.campusbike.profile.service.ProfileService;
import waxwing.campusbike.types.dto.accountChangeRequest;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTests {

    @Mock
    private DataSource dataSource;

    @Mock
    private Env env;

    private ProfileService profileService;
    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() throws Exception {
        profileService = new ProfileService(env);
        passwordEncoder = new BCryptPasswordEncoder();
        
        // Inject the mocked DataSource using reflection
        java.lang.reflect.Field field = ProfileService.class.getDeclaredField("dataSource");
        field.setAccessible(true);
        field.set(profileService, dataSource);
    }

    @Test
    void testChangeUser_UpdateAllFields() throws SQLException {
        // Arrange - Update username, email, phone, AND password all at once
        String jwtUsername = "olduser";
        accountChangeRequest request = new accountChangeRequest();
        request.setUsername("brandnewuser");
        request.setEmail("brandnew@umass.edu");
        request.setPhone("5085551234");
        request.setPassword("CurrentPass123!");
        request.setNew_password("BrandNewPass456@");

        // Create a real hashed password for verification
        String hashedCurrentPassword = passwordEncoder.encode("CurrentPass123!");
        Long userId = 123L;

        // Mock for getUser call
        Connection conn1 = mock(Connection.class);
        PreparedStatement stmt1 = mock(PreparedStatement.class);
        ResultSet rs1 = mock(ResultSet.class);
        
        // Mock for userExists call
        Connection conn2 = mock(Connection.class);
        PreparedStatement stmt2 = mock(PreparedStatement.class);
        ResultSet rs2 = mock(ResultSet.class);
        
        // Mock for uploadUser call (with password)
        Connection conn3 = mock(Connection.class);
        PreparedStatement stmt3 = mock(PreparedStatement.class);

        when(dataSource.getConnection())
            .thenReturn(conn1)
            .thenReturn(conn2)
            .thenReturn(conn3);

        // Setup getUser query - returns old user data including ID
        when(conn1.prepareStatement(anyString()))
            .thenReturn(stmt1);
        when(stmt1.executeQuery()).thenReturn(rs1);
        when(rs1.next()).thenReturn(true).thenReturn(false);
        when(rs1.getString("username")).thenReturn("olduser");
        when(rs1.getString("email")).thenReturn("old@umass.edu");
        when(rs1.getString("password_hash")).thenReturn(hashedCurrentPassword);

        // Setup userExists query: Must handle both username AND email parameters
        when(conn2.prepareStatement(anyString()))
            .thenReturn(stmt2);
        when(stmt2.executeQuery()).thenReturn(rs2);
        when(rs2.next()).thenReturn(true);
        when(rs2.getInt(1)).thenReturn(1);  

        // Setup uploadUser update with all fields including password
        when(conn3.prepareStatement(anyString()))
            .thenReturn(stmt3);
        when(stmt3.executeUpdate()).thenReturn(1);

        // Act
        int result = profileService.changeUser(jwtUsername, request);

        // Assert
        assertEquals(200, result);
        verify(stmt3).executeUpdate();
        
        // Verify all fields were set on the prepared statement
        verify(stmt3).setString(1, "brandnewuser");
        verify(stmt3).setString(2, "brandnew@umass.edu");
        verify(stmt3).setString(3, "5085551234");
        verify(stmt3).setString(eq(4), anyString()); 
        verify(stmt3).setString(5, "olduser");
    }

    @Test
    void testIsValidPassword_ValidPassword() {
        assertTrue(profileService.isValidPassword("Password123!"));
        assertTrue(profileService.isValidPassword("MyP@ssw0rd"));
        assertTrue(profileService.isValidPassword("Test1234!@#$"));
        assertTrue(profileService.isValidPassword("Abcdefg1!"));
    }

    @Test
    void testIsValidPassword_WithVariousSpecialCharacters() {
        assertTrue(profileService.isValidPassword("Password1!"));
        assertTrue(profileService.isValidPassword("Password1@"));
        assertTrue(profileService.isValidPassword("Password1#"));
        assertTrue(profileService.isValidPassword("Password1$"));
        assertTrue(profileService.isValidPassword("Password1%"));
        assertTrue(profileService.isValidPassword("Password1^"));
        assertTrue(profileService.isValidPassword("Password1&"));
        assertTrue(profileService.isValidPassword("Password1*"));
    }

    @Test
    void testIsValidPassword_MinimumLength() {
        assertTrue(profileService.isValidPassword("Test123!"));
    }

    @Test
    void testIsValidPassword_LongPassword() {
        assertTrue(profileService.isValidPassword("ThisIsAVeryLongPassword123!WithSpecialChars"));
    }

    @Test
    void testIsValidPassword_MultipleDigitsAndSpecialChars() {
        assertTrue(profileService.isValidPassword("Pass123456!@#$%"));
    }
}