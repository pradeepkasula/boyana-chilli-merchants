package com.chilli.app.controller;

import com.chilli.app.dto.common.ApiResponse;
import com.chilli.app.dto.report.PurchaseByChilliReport;
import com.chilli.app.dto.report.PurchaseBySellerReport;
import com.chilli.app.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/purchase-by-seller")
    public ResponseEntity<ApiResponse<List<PurchaseBySellerReport>>> bySeller(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Long sellerId) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.purchaseBySeller(fromDate, toDate, sellerId)));
    }

    @GetMapping("/purchase-by-chilli")
    public ResponseEntity<ApiResponse<List<PurchaseByChilliReport>>> byChilli(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.purchaseByChilli(fromDate, toDate)));
    }
}
