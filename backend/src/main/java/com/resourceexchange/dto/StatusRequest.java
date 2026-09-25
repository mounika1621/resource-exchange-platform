package com.resourceexchange.dto;
import com.resourceexchange.entity.RequestStatus;
import jakarta.validation.constraints.NotNull;
public class StatusRequest {
    @NotNull private RequestStatus status;
    public RequestStatus getStatus(){return status;} public void setStatus(RequestStatus v){status=v;}
}
