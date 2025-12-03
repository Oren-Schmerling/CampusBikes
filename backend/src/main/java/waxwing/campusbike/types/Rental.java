package waxwing.campusbike.types;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import java.util.random.RandomGenerator;

public class Rental {

  private Long id;
  private Long renterId;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
  private Long bikeId;

  public Rental(Long renterId, Long bikeId, LocalDateTime startTime, LocalDateTime endTime) {
    this.renterId = renterId;
    this.bikeId = bikeId;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public Rental() {
    Random r = new Random();
    this.renterId = r.nextLong();
    this.bikeId = r.nextLong();
    this.startTime = LocalDateTime.now().plusHours(2);
    this.endTime = LocalDateTime.now().plusHours(10);
  }

  public Long getId() {
    return this.id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getRenterId() {
    return this.renterId;
  }

  public void setRenterId(Long renterId) {
    this.renterId = renterId;
  }

  public LocalDateTime getStartTime() {
    return this.startTime;
  }

  public void setStartTime(LocalDateTime startTime) {
    this.startTime = startTime;
  }

  public LocalDateTime getEndTime() {
    return this.endTime;
  }

  public void setEndTime(LocalDateTime endTime) {
    this.endTime = endTime;
  }

  public Long getBikeId() {
    return this.bikeId;
  }

  public void setBikeId(Long bikeId) {
    this.bikeId = bikeId;
  }

}
