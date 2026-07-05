package com.chilli.app.controller;

import com.chilli.app.dto.common.ApiResponse;
import com.chilli.app.dto.common.PageResponse;
import com.chilli.app.dto.party.PartyRequest;
import com.chilli.app.dto.party.PartyResponse;
import com.chilli.app.service.PartyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PartyResponse>>> search(
            @RequestParam(required = false) Boolean canSell,
            @RequestParam(required = false) Boolean canBuy,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                partyService.search(canSell, canBuy, search,
                        PageRequest.of(page, size, Sort.by("partyName")))));
    }

    @GetMapping("/sellers")
    public ResponseEntity<ApiResponse<List<PartyResponse>>> sellers() {
        return ResponseEntity.ok(ApiResponse.ok(partyService.findAllSellers()));
    }

    @GetMapping("/buyers")
    public ResponseEntity<ApiResponse<List<PartyResponse>>> buyers() {
        return ResponseEntity.ok(ApiResponse.ok(partyService.findAllBuyers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PartyResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(partyService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERATOR')")
    public ResponseEntity<ApiResponse<PartyResponse>> create(@Valid @RequestBody PartyRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Party created", partyService.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERATOR')")
    public ResponseEntity<ApiResponse<PartyResponse>> update(@PathVariable Long id,
                                                              @Valid @RequestBody PartyRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Party updated", partyService.update(id, req)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id,
                                                           @RequestParam boolean active) {
        partyService.toggleStatus(id, active);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", null));
    }
}
