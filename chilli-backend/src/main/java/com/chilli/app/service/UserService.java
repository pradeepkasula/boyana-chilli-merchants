package com.chilli.app.service;

import com.chilli.app.domain.User;
import com.chilli.app.dto.common.PageResponse;
import com.chilli.app.dto.user.*;
import com.chilli.app.enums.AuditAction;
import com.chilli.app.exception.BusinessRuleException;
import com.chilli.app.exception.ResourceNotFoundException;
import com.chilli.app.repository.UserRepository;
import com.chilli.app.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public PageResponse<UserResponse> findAll(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        return toPageResponse(page);
    }

    public UserResponse findById(Long id) {
        return toResponse(getUser(id));
    }

    @Transactional
    public UserResponse create(UserCreateRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new BusinessRuleException("Username already exists: " + req.getUsername());
        }
        User user = User.builder()
                .username(req.getUsername())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .role(req.getRole())
                .build();
        User saved = userRepository.save(user);
        auditLogService.log("users", saved.getId(), AuditAction.CREATE, null, JsonUtil.toJson(saved));
        return toResponse(saved);
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest req) {
        User user = getUser(id);
        String oldJson = JsonUtil.toJson(user);
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setRole(req.getRole());
        user.setIsActive(req.getIsActive());
        User saved = userRepository.save(user);
        auditLogService.log("users", id, AuditAction.UPDATE, oldJson, JsonUtil.toJson(saved));
        return toResponse(saved);
    }

    @Transactional
    public void resetPassword(Long id, PasswordResetRequest req) {
        User user = getUser(id);
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        auditLogService.log("users", id, AuditAction.UPDATE, null, "{\"action\":\"password_reset\"}");
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    private PageResponse<UserResponse> toPageResponse(Page<User> page) {
        return PageResponse.<UserResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .isActive(u.getIsActive())
                .insertedBy(u.getInsertedBy())
                .insertedDate(u.getInsertedDate())
                .updatedBy(u.getUpdatedBy())
                .updatedDate(u.getUpdatedDate())
                .build();
    }
}
