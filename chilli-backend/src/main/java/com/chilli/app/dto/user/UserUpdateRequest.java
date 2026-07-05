package com.chilli.app.dto.user;

import com.chilli.app.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank
    private String fullName;
    private String email;
    private String phone;
    @NotNull
    private Role role;
    @NotNull
    private Boolean isActive;
}
