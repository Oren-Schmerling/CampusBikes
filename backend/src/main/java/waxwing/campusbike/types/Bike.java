package waxwing.campusbike.types;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Bike {

    private Long id;
    private Long ownerId;
    private String title;
    private String description;
    private String location;
    //more extact as a big decimal 
    private BigDecimal pricePerHour;
    private String status;
    private LocalDateTime createdAt;

    public Bike(Long ownerId, String title, String description, String location, BigDecimal pricePerHour, String status) {
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.pricePerHour = pricePerHour;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
