package waxwing.campusbike.types.dto;
// import java.time.LocalDateTime;

public class BookingRequest {

    private long renterID;
    private long bikeID;
    private String startTime;
    private String endTime;

    public BookingRequest() {}

    public long getRenterID() {
        return renterID;
    }

    public void setRenterID(int renterID) {
        this.renterID = renterID;
    }

    public long getBikeID() {
        return bikeID;
    }
    
    public void setBikeID(int bikeID) {
        this.bikeID = bikeID;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
