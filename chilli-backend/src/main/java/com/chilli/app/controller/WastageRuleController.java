package com.chilli.app.controller;

import com.chilli.app.dto.common.ApiResponse;
import com.chilli.app.dto.wastage.*;
import com.chilli.app.service.WastageRuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wastage-rules")
@RequiredArgsConstructor
public class WastageRuleController {

    private final WastageRuleService wastageRuleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WastageRuleResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(wastageRuleService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WastageRuleResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(wastageRuleService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<WastageRuleResponse>> create(@Valid @RequestBody WastageRuleRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Wastage rule created", wastageRuleService.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<WastageRuleResponse>> update(@PathVariable Long id,
                                                                    @Valid @RequestBody WastageRuleRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Wastage rule updated", wastageRuleService.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        wastageRuleService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Wastage rule deleted", null));
    }

    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<WastagePreviewResponse>> preview(
            @Valid @RequestBody WastagePreviewRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(wastageRuleService.preview(req)));
    }
}
