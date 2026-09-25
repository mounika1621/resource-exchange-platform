package com.resourceexchange.service;
import com.resourceexchange.dto.*; import com.resourceexchange.entity.*; import com.resourceexchange.exception.ApiException; import com.resourceexchange.repository.UserRepository; import com.resourceexchange.security.JwtService;
import org.springframework.http.HttpStatus; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service;
@Service public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(UserRepository users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
 public AuthResponse register(RegisterRequest r){
  if(users.existsByEmail(r.getEmail().toLowerCase())) throw new ApiException("Email already registered",HttpStatus.CONFLICT);
  User u=new User();u.setName(r.getName());u.setEmail(r.getEmail().toLowerCase());u.setPassword(encoder.encode(r.getPassword()));u.setPhone(r.getPhone());u.setRole(Role.USER);u.setEnabled(true);users.save(u);
  return new AuthResponse(jwt.generate(u.getEmail(),u.getRole().name()),UserResponse.from(u));
 }
 public AuthResponse login(LoginRequest r){
  User u=users.findByEmail(r.getEmail().toLowerCase()).orElseThrow(()->new ApiException("Invalid email or password",HttpStatus.UNAUTHORIZED));
  if(!u.isEnabled()||!encoder.matches(r.getPassword(),u.getPassword())) throw new ApiException("Invalid email or password",HttpStatus.UNAUTHORIZED);
  return new AuthResponse(jwt.generate(u.getEmail(),u.getRole().name()),UserResponse.from(u));
 }
}
