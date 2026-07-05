package com.chilli.app.service;

import com.chilli.app.dto.report.PurchaseByChilliReport;
import com.chilli.app.dto.report.PurchaseBySellerReport;
import com.chilli.app.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final PurchaseRepository purchaseRepository;

    @Transactional(readOnly = true)
    public List<PurchaseBySellerReport> purchaseBySeller(LocalDate fromDate, LocalDate toDate, Long sellerId) {
        return purchaseRepository.findConfirmedBetween(fromDate, toDate).stream()
                .filter(p -> sellerId == null || p.getSeller().getId().equals(sellerId))
                .collect(Collectors.groupingBy(p -> p.getSeller().getId()))
                .entrySet().stream()
                .map(e -> {
                    var list = e.getValue();
                    var first = list.get(0);
                    return new PurchaseBySellerReport(
                            first.getSeller().getId(),
                            first.getSeller().getPartyName(),
                            (long) list.size(),
                            list.stream().map(p -> p.getTotalActualWt() != null ? p.getTotalActualWt() : java.math.BigDecimal.ZERO)
                                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add),
                            list.stream().map(p -> p.getTotalGrossWt() != null ? p.getTotalGrossWt() : java.math.BigDecimal.ZERO)
                                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add),
                            list.stream().map(p -> p.getTotalPrice() != null ? p.getTotalPrice() : java.math.BigDecimal.ZERO)
                                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add)
                    );
                })
                .sorted((a, b) -> b.getTotalPrice().compareTo(a.getTotalPrice()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PurchaseByChilliReport> purchaseByChilli(LocalDate fromDate, LocalDate toDate) {
        return purchaseRepository.findConfirmedBetween(fromDate, toDate).stream()
                .collect(Collectors.groupingBy(p -> p.getChilliType()))
                .entrySet().stream()
                .map(e -> {
                    var list = e.getValue();
                    return new PurchaseByChilliReport(
                            e.getKey(),
                            (long) list.size(),
                            list.stream().map(p -> p.getTotalActualWt() != null ? p.getTotalActualWt() : java.math.BigDecimal.ZERO)
                                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add),
                            list.stream().map(p -> p.getTotalGrossWt() != null ? p.getTotalGrossWt() : java.math.BigDecimal.ZERO)
                                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add),
                            list.stream().map(p -> p.getTotalPrice() != null ? p.getTotalPrice() : java.math.BigDecimal.ZERO)
                                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add)
                    );
                })
                .toList();
    }
}
