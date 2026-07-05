package com.chilli.app.dto.user;

import com.chilli.app.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private Boolean isActive;
    private String insertedBy;
    private LocalDateTime insertedDate;
    private String updatedBy;
    private LocalDateTime updatedDate;
}
