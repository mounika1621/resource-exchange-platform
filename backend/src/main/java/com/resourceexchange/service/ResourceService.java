package com.resourceexchange.service;
import com.resourceexchange.dto.*; import com.resourceexchange.entity.Resource; import com.resourceexchange.exception.ApiException; import com.resourceexchange.repository.ResourceRepository;
import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import java.util.List;
@Service public class ResourceService {
 private final ResourceRepository repo; private final CurrentUserService current;
 public ResourceService(ResourceRepository repo,CurrentUserService current){this.repo=repo;this.current=current;}
 public List<ResourceResponse> search(String q,String category){List<Resource> list;if(q!=null&&!q.isBlank()) list=repo.findByAvailabilityTrueAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(q); else if(category!=null&&!category.isBlank()) list=repo.findByAvailabilityTrueAndCategoryContainingIgnoreCaseOrderByCreatedAtDesc(category); else list=repo.findByAvailabilityTrueOrderByCreatedAtDesc();return list.stream().map(ResourceResponse::from).toList();}
 public List<ResourceResponse> mine(){return repo.findByOwnerUserIdOrderByCreatedAtDesc(current.get().getUserId()).stream().map(ResourceResponse::from).toList();}
 public ResourceResponse create(ResourceRequest r){Resource x=new Resource();copy(r,x);x.setOwner(current.get());return ResourceResponse.from(repo.save(x));}
 public ResourceResponse update(Long id,ResourceRequest r){Resource x=get(id);checkOwner(x);copy(r,x);return ResourceResponse.from(repo.save(x));}
 public void delete(Long id){Resource x=get(id);checkOwner(x);repo.delete(x);}
 public ResourceResponse setAvailability(Long id,boolean available){Resource x=get(id);checkOwner(x);x.setAvailability(available);return ResourceResponse.from(repo.save(x));}
 public Resource get(Long id){return repo.findById(id).orElseThrow(()->new ApiException("Resource not found",HttpStatus.NOT_FOUND));}
 public void checkOwner(Resource r){if(!r.getOwner().getUserId().equals(current.get().getUserId())) throw new ApiException("Only the resource owner can modify this resource",HttpStatus.FORBIDDEN);}
 private void copy(ResourceRequest r,Resource x){x.setTitle(r.getTitle());x.setCategory(r.getCategory());x.setDescription(r.getDescription());x.setCondition(r.getCondition());x.setAvailability(r.isAvailability());}
}
