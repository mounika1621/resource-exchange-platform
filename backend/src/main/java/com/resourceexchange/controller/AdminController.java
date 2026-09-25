package com.resourceexchange.controller;
import com.resourceexchange.dto.*; import com.resourceexchange.entity.*; import com.resourceexchange.exception.ApiException; import com.resourceexchange.repository.*; import com.resourceexchange.service.RequestService; import org.springframework.http.HttpStatus; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/admin") @PreAuthorize("hasRole('ADMIN')") public class AdminController {
 private final UserRepository users; private final ResourceRepository resources; private final RequestService requests;
 public AdminController(UserRepository users,ResourceRepository resources,RequestService requests){this.users=users;this.resources=resources;this.requests=requests;}
 @GetMapping("/users") public List<UserResponse> users(){return users.findAll().stream().map(UserResponse::from).toList();}
 @PutMapping("/users/{id}/enabled") public UserResponse enabled(@PathVariable Long id,@RequestParam boolean value){User u=users.findById(id).orElseThrow(()->new ApiException("User not found",HttpStatus.NOT_FOUND));u.setEnabled(value);return UserResponse.from(users.save(u));}
 @DeleteMapping("/resources/{id}") public Map<String,String> deleteResource(@PathVariable Long id){Resource r=resources.findById(id).orElseThrow(()->new ApiException("Resource not found",HttpStatus.NOT_FOUND));r.setAvailability(false);resources.save(r);return Map.of("message","Resource removed from exchange");}
 @GetMapping("/requests") public List<RequestResponse> requests(){return requests.all();}
 @PutMapping("/requests/{id}/status") public RequestResponse requestStatus(@PathVariable Long id,@RequestBody StatusRequest s){return requests.status(id,s.getStatus());}
}
