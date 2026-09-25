package com.resourceexchange.repository;
import com.resourceexchange.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    List<ExchangeRequest> findByRequesterUserIdOrderByRequestDateDesc(Long userId);
    List<ExchangeRequest> findByResourceOwnerUserIdOrderByRequestDateDesc(Long ownerId);
    List<ExchangeRequest> findAllByOrderByRequestDateDesc();
}
