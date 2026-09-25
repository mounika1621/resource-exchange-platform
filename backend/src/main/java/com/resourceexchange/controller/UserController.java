package com.resourceexchange.controller;
import com.resourceexchange.dto.*; import com.resourceexchange.entity.User; import com.resourceexchange.exception.ApiException; import com.resourceexchange.repository.UserRepository; import com.resourceexchange.service.CurrentUserService; import jakarta.validation.Valid; import org.springframework.http.HttpStatus; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/users") public class UserController {
 private final CurrentUserService current; private final UserRepository users; private final PasswordEncoder encoder;
 public UserController(CurrentUserService current,UserRepository users,PasswordEncoder encoder){this.current=current;this.users=users;this.encoder=encoder;}
 @GetMapping("/me") public UserResponse me(){return UserResponse.from(current.get());}
 @PutMapping("/me") public UserResponse update(@Valid @RequestBody ProfileRequest r){User u=current.get();u.setName(r.getName());u.setPhone(r.getPhone());return UserResponse.from(users.save(u));}
 @PutMapping("/me/password") public MapResponse password(@RequestBody MapPassword p){User u=current.get();if(p.oldPassword()==null||p.newPassword()==null||!encoder.matches(p.oldPassword(),u.getPassword()))throw new ApiException("Current password is incorrect",HttpStatus.BAD_REQUEST);if(p.newPassword().length()<6)throw new ApiException("New password must contain at least 6 characters",HttpStatus.BAD_REQUEST);u.setPassword(encoder.encode(p.newPassword()));users.save(u);return new MapResponse("Password updated successfully");}
 public record MapPassword(String oldPassword,String newPassword){} public record MapResponse(String message){}
}
