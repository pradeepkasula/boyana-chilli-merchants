package com.chilli.app.controller;

import com.chilli.app.dto.common.ApiResponse;
import com.chilli.app.dto.common.PageResponse;
import com.chilli.app.dto.purchase.PurchaseCreateRequest;
import com.chilli.app.dto.purchase.PurchaseResponse;
import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.PurchaseStatus;
import com.chilli.app.service.PurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PurchaseResponse>>> search(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Long sellerId,
            @RequestParam(required = false) ChilliType chilliType,
            @RequestParam(required = false) PurchaseStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                purchaseService.search(fromDate, toDate, sellerId, chilliType, status,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "purchaseDate")))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(purchaseService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERATOR')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> create(@Valid @RequestBody PurchaseCreateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase created", purchaseService.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERATOR')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> update(@PathVariable Long id,
                                                                 @Valid @RequestBody PurchaseCreateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase updated", purchaseService.update(id, req)));
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase confirmed", purchaseService.confirm(id)));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase cancelled", purchaseService.cancel(id)));
    }
}
