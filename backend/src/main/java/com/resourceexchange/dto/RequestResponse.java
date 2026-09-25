package com.resourceexchange.dto;
import com.resourceexchange.entity.ExchangeRequest;
import com.resourceexchange.entity.RequestStatus;
import java.time.LocalDateTime;
public record RequestResponse(Long requestId, LocalDateTime requestDate, RequestStatus status, Long requesterId, String requesterName, Long resourceId, String resourceTitle, Long ownerId, String ownerName) {
    public static RequestResponse from(ExchangeRequest r){return new RequestResponse(r.getRequestId(),r.getRequestDate(),r.getStatus(),r.getRequester().getUserId(),r.getRequester().getName(),r.getResource().getResourceId(),r.getResource().getTitle(),r.getResource().getOwner().getUserId(),r.getResource().getOwner().getName());}
}
