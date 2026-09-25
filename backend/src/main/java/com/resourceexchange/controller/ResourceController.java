package com.resourceexchange.controller;
import com.resourceexchange.dto.*; import com.resourceexchange.service.ResourceService; import jakarta.validation.Valid; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/resources") public class ResourceController {
 private final ResourceService service; public ResourceController(ResourceService service){this.service=service;}
 @GetMapping public List<ResourceResponse> search(@RequestParam(required=false) String q,@RequestParam(required=false) String category){return service.search(q,category);}
 @GetMapping("/public") public List<ResourceResponse> publicSearch(@RequestParam(required=false) String q,@RequestParam(required=false) String category){return service.search(q,category);}
 @GetMapping("/mine") public List<ResourceResponse> mine(){return service.mine();}
 @GetMapping("/{id}") public ResourceResponse one(@PathVariable Long id){return ResourceResponse.from(service.get(id));}
 @PostMapping public ResourceResponse create(@Valid @RequestBody ResourceRequest r){return service.create(r);}
 @PutMapping("/{id}") public ResourceResponse update(@PathVariable Long id,@Valid @RequestBody ResourceRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
 @PutMapping("/{id}/availability") public ResourceResponse availability(@PathVariable Long id,@RequestParam boolean available){return service.setAvailability(id,available);}
}
