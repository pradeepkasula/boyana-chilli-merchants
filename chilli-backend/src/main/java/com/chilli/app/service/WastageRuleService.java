package com.chilli.app.service;

import com.chilli.app.domain.WastageRule;
import com.chilli.app.dto.wastage.*;
import com.chilli.app.enums.AuditAction;
import com.chilli.app.exception.BusinessRuleException;
import com.chilli.app.exception.ResourceNotFoundException;
import com.chilli.app.repository.WastageRuleRepository;
import com.chilli.app.util.JsonUtil;
import com.chilli.app.util.WastageCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WastageRuleService {

    private final WastageRuleRepository wastageRuleRepository;
    private final AuditLogService auditLogService;

    public List<WastageRuleResponse> findAll() {
        return wastageRuleRepository.findAll().stream().map(this::toResponse).toList();
    }

    public WastageRuleResponse findById(Long id) {
        return toResponse(getRule(id));
    }

    @Transactional
    public WastageRuleResponse create(WastageRuleRequest req) {
        validateNoOverlap(req.getChilliType(), req.getWeightFromKg(), req.getWeightToKg(), -1L);
        WastageRule rule = WastageRule.builder()
                .chilliType(req.getChilliType())
                .weightFromKg(req.getWeightFromKg())
                .weightToKg(req.getWeightToKg())
                .wastageType(req.getWastageType())
                .wastageValue(req.getWastageValue())
                .description(req.getDescription())
                .build();
        WastageRule saved = wastageRuleRepository.save(rule);
        auditLogService.log("wastage_rules", saved.getId(), AuditAction.CREATE, null, JsonUtil.toJson(saved));
        return toResponse(saved);
    }

    @Transactional
    public WastageRuleResponse update(Long id, WastageRuleRequest req) {
        WastageRule rule = getRule(id);
        validateNoOverlap(req.getChilliType(), req.getWeightFromKg(), req.getWeightToKg(), id);
        String oldJson = JsonUtil.toJson(rule);
        rule.setChilliType(req.getChilliType());
        rule.setWeightFromKg(req.getWeightFromKg());
        rule.setWeightToKg(req.getWeightToKg());
        rule.setWastageType(req.getWastageType());
        rule.setWastageValue(req.getWastageValue());
        rule.setDescription(req.getDescription());
        WastageRule saved = wastageRuleRepository.save(rule);
        auditLogService.log("wastage_rules", id, AuditAction.UPDATE, oldJson, JsonUtil.toJson(saved));
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        WastageRule rule = getRule(id);
        String oldJson = JsonUtil.toJson(rule);
        rule.setIsActive(false);
        wastageRuleRepository.save(rule);
        auditLogService.log("wastage_rules", id, AuditAction.DELETE, oldJson, null);
    }

    public WastagePreviewResponse preview(WastagePreviewRequest req) {
        List<WastageRule> rules = wastageRuleRepository
                .findByChilliTypeAndIsActiveTrueOrderByWeightFromKg(req.getChilliType());
        WastageCalculator.Result result = WastageCalculator.calculate(req.getActualWeight(), rules);
        return WastagePreviewResponse.builder()
                .actualWeight(req.getActualWeight())
                .wastageAmount(result.wastageAmount())
                .grossWeight(result.grossWeight())
                .wastageRuleId(result.matchedRule() != null ? result.matchedRule().getId() : null)
                .ruleDescription(result.matchedRule() != null ? result.matchedRule().getDescription() : null)
                .build();
    }

    private void validateNoOverlap(com.chilli.app.enums.ChilliType type,
                                    java.math.BigDecimal from, java.math.BigDecimal to, Long excludeId) {
        long count = wastageRuleRepository.countOverlapping(type, from, to, excludeId);
        if (count > 0) {
            throw new BusinessRuleException("Overlapping wastage rule already exists for this chilli type and weight range");
        }
    }

    public WastageRule getRule(Long id) {
        return wastageRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wastage rule not found: " + id));
    }

    private WastageRuleResponse toResponse(WastageRule r) {
        return WastageRuleResponse.builder()
                .id(r.getId())
                .chilliType(r.getChilliType())
                .weightFromKg(r.getWeightFromKg())
                .weightToKg(r.getWeightToKg())
                .wastageType(r.getWastageType())
                .wastageValue(r.getWastageValue())
                .description(r.getDescription())
                .isActive(r.getIsActive())
                .insertedBy(r.getInsertedBy())
                .insertedDate(r.getInsertedDate())
                .updatedBy(r.getUpdatedBy())
                .updatedDate(r.getUpdatedDate())
                .build();
    }
}
