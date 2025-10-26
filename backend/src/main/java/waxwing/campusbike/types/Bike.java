package waxwing.campusbike.types;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Bike {

  private Long id;
  private Long ownerId;
  private String title;
  private String description;
  private String location;
  // more extact as a big decimal
  private BigDecimal pricePerHour;
  private String status;
  private LocalDateTime createdAt;
  private double latitude;
  private double longitude;

  public Bike(Long ownerId, String title, String description, String location, BigDecimal pricePerHour, double latitude,
      double longitude, String status) {
    this.ownerId = ownerId;
    this.title = title;
    this.description = description;
    this.location = location;
    this.pricePerHour = pricePerHour;
    this.status = status;
    this.latitude = latitude;
    this.longitude = longitude;
    this.createdAt = LocalDateTime.now();
  }

  public Long getId() {
    return this.id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getOwnerId() {
    return this.ownerId;
  }

  public void setOwnerId(Long ownerId) {
    this.ownerId = ownerId;
  }

  public String getTitle() {
    return this.title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return this.description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getLocation() {
    return this.location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public BigDecimal getPricePerHour() {
    return this.pricePerHour;
  }

  public void setPricePerHour(BigDecimal pricePerHour) {
    this.pricePerHour = pricePerHour;
  }

  public String getStatus() {
    return this.status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return this.createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public double getLatitude() {
    return this.latitude;
  }

  public void setLatitude(double latitude) {
    this.latitude = latitude;
  }

  public double getLongitude() {
    return this.longitude;
  }

  public void setLongitude(double longitude) {
    this.longitude = longitude;
  }
}
