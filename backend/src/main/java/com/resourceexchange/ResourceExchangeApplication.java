package com.resourceexchange;

import com.resourceexchange.entity.Role;
import com.resourceexchange.entity.User;
import com.resourceexchange.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ResourceExchangeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ResourceExchangeApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@resourceexchange.com")) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@resourceexchange.com");
                admin.setPassword(encoder.encode("Admin@123"));
                admin.setPhone("9999999999");
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
            }
        };
    }
}
