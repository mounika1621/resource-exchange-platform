package com.resourceexchange.dto;
import com.resourceexchange.entity.Resource;
public record ResourceResponse(Long resourceId, String title, String category, String description, String condition, boolean availability, Long ownerId, String ownerName) {
    public static ResourceResponse from(Resource r){return new ResourceResponse(r.getResourceId(),r.getTitle(),r.getCategory(),r.getDescription(),r.getCondition(),r.isAvailability(),r.getOwner().getUserId(),r.getOwner().getName());}
}
