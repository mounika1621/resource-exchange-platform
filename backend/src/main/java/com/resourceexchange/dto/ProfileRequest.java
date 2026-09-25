package com.resourceexchange.dto;
import jakarta.validation.constraints.NotBlank;
public class ProfileRequest { @NotBlank private String name; private String phone; public String getName(){return name;} public void setName(String v){name=v;} public String getPhone(){return phone;} public void setPhone(String v){phone=v;} }
