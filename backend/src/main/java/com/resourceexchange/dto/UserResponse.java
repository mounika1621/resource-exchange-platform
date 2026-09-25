package com.resourceexchange.dto;
import com.resourceexchange.entity.User;
public record UserResponse(Long userId,String name,String email,String phone,String role,boolean enabled){
    public static UserResponse from(User u){return new UserResponse(u.getUserId(),u.getName(),u.getEmail(),u.getPhone(),u.getRole().name(),u.isEnabled());}
}
