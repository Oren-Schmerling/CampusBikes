package waxwing.campusbike.types.dto;

import java.math.BigDecimal;

public class BikeUpdateRequest {
  private Long id;
  private Long ownerId;
  private String title;
  private String description;
  private String location;
  private BigDecimal pricePerHour;
  private double latitude;
  private double longitude;

  private String status = "available";

  public Long getOwnerId() {
    return ownerId;
  }

  public void setOwnerId(Long ownerId) {
    this.ownerId = ownerId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public BigDecimal getPricePerHour() {
    return pricePerHour;
  }

  public void setPricePerHour(BigDecimal pricePerHour) {
    this.pricePerHour = pricePerHour;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public double getLatitude() {
    return latitude;
  }

  public void setLatitude(double latitude) {
    this.latitude = latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public void setLongitude(double longitude) {
    this.longitude = longitude;
  }

  public long getid() {
    return id;
  }

  public void setid(long id) {
    this.id = id;
  }
}
