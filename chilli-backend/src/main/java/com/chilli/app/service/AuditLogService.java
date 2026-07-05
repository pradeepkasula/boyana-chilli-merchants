package com.chilli.app.service;

import com.chilli.app.domain.AuditLog;
import com.chilli.app.enums.AuditAction;
import com.chilli.app.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async("auditExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String entityName, Long entityId, AuditAction action,
                    String oldValue, String newValue) {
        String changedBy = getCurrentUsername();
        AuditLog entry = AuditLog.builder()
                .entityName(entityName)
                .entityId(entityId != null ? entityId.toString() : "unknown")
                .action(action)
                .oldValue(oldValue)
                .newValue(newValue)
                .changedBy(changedBy)
                .build();
        auditLogRepository.save(entry);
    }

    private String getCurrentUsername() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                return auth.getName();
            }
        } catch (Exception ignored) {}
        return "SYSTEM";
    }
}
