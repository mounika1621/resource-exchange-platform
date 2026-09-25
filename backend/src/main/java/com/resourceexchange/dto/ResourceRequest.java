package com.resourceexchange.dto;
import jakarta.validation.constraints.NotBlank;
public class ResourceRequest {
    @NotBlank private String title;
    @NotBlank private String category;
    @NotBlank private String description;
    private String condition;
    private boolean availability = true;
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getCategory(){return category;} public void setCategory(String v){category=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public String getCondition(){return condition;} public void setCondition(String v){condition=v;}
    public boolean isAvailability(){return availability;} public void setAvailability(boolean v){availability=v;}
}
