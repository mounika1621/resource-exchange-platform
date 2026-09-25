package com.resourceexchange.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class Resource {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resourceId;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String category;
    @Column(nullable = false, length = 2000) private String description;
    @Column(name = "resource_condition")
    private String condition;
    @Column(nullable = false) private boolean availability = true;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
@JoinColumn(name = "owner_id", nullable = false)
private User owner;
    @Column(nullable = false) private LocalDateTime createdAt = LocalDateTime.now();

    public Long getResourceId() { return resourceId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public boolean isAvailability() { return availability; }
    public void setAvailability(boolean availability) { this.availability = availability; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
