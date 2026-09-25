package com.resourceexchange.service;
import com.resourceexchange.entity.User; import com.resourceexchange.exception.ApiException; import com.resourceexchange.repository.UserRepository; import org.springframework.http.HttpStatus; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Service;
@Service public class CurrentUserService {
 private final UserRepository users; public CurrentUserService(UserRepository users){this.users=users;}
 public User get(){String email=SecurityContextHolder.getContext().getAuthentication().getName();return users.findByEmail(email).orElseThrow(()->new ApiException("User not found",HttpStatus.UNAUTHORIZED));}
}
