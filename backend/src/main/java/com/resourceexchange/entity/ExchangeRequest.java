package com.resourceexchange.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exchange_requests")
public class ExchangeRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;
    @Column(nullable = false) private LocalDateTime requestDate = LocalDateTime.now();
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
@JoinColumn(name = "requester_id", nullable = false)
private User requester;

@ManyToOne(fetch = FetchType.EAGER, optional = false)
@JoinColumn(name = "resource_id", nullable = false)
private Resource resource;

    public Long getRequestId() { return requestId; }
    public LocalDateTime getRequestDate() { return requestDate; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }
    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }
}
