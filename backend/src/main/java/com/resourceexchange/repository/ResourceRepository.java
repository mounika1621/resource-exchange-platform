package com.resourceexchange.repository;
import com.resourceexchange.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByAvailabilityTrueOrderByCreatedAtDesc();
    List<Resource> findByOwnerUserIdOrderByCreatedAtDesc(Long userId);
    List<Resource> findByAvailabilityTrueAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);
    List<Resource> findByAvailabilityTrueAndCategoryContainingIgnoreCaseOrderByCreatedAtDesc(String category);
}
