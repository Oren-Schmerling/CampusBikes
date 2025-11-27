// package waxwing.campusbike.types.dto;

// import java.time.LocalDateTime;

// // import com.fasterxml.jackson.annotation.JsonFormat;

// public class BookingRequest {

//     private long bikeID;
//     private LocalDateTime startTime;
//     private LocalDateTime endTime;

//     public BookingRequest() {}

//     public long getBikeID() {
//         return bikeID;
//     }

//     public void setBikeID(long bikeID) {
//         this.bikeID = bikeID;
//     }

//     public LocalDateTime getStartTime() {
//         return startTime;
//     }

//     public void setStartTime(LocalDateTime startTime) {
//         this.startTime = startTime;
//     }

//     public LocalDateTime getEndTime() {
//         return endTime;
//     }

//     public void setEndTime(LocalDateTime endTime) {
//         this.endTime = endTime;
//     }
// }


package waxwing.campusbike.types.dto;

import java.time.LocalDateTime;

// import com.fasterxml.jackson.annotation.JsonFormat;

public class BookingRequest {

    private long bikeID;
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
