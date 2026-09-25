package com.resourceexchange.controller;
import com.resourceexchange.dto.*; import com.resourceexchange.entity.RequestStatus; import com.resourceexchange.service.RequestService; import jakarta.validation.Valid; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/requests") public class RequestController {
 private final RequestService service; public RequestController(RequestService service){this.service=service;}
 @PostMapping("/{resourceId}") public RequestResponse create(@PathVariable Long resourceId){return service.create(resourceId);}
 @GetMapping("/mine") public List<RequestResponse> mine(){return service.mine();}
 @GetMapping("/owner") public List<RequestResponse> owner(){return service.ownerRequests();}
 @PutMapping("/{id}/status") public RequestResponse status(@PathVariable Long id,@Valid @RequestBody StatusRequest r){return service.status(id,r.getStatus());}
}
