package waxwing.campusbike.types.dto;

public class BookingRequest {

    private long bikeID;

    // originally got this to work by taking in string, might want to change this to LocalDateTime later
    private String startTime;
    private String endTime;

    public BookingRequest() {}

    public long getBikeID() {
        return bikeID;
    }

    public void setBikeID(long bikeID) {
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
