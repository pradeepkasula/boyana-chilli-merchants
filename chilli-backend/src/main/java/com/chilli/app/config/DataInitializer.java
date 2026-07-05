package com.chilli.app.config;

import com.chilli.app.domain.User;
import com.chilli.app.enums.Role;
import com.chilli.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("admin"))
                    .fullName("Super Administrator")
                    .email("admin@chilli.local")
                    .role(Role.SUPER_ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created.");
        }
    }
}
