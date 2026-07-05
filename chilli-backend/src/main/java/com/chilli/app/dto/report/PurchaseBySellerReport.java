package com.chilli.app.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseBySellerReport {
    private Long sellerId;
    private String sellerName;
    private Long purchaseCount;
    private BigDecimal totalActualWt;
    private BigDecimal totalGrossWt;
    private BigDecimal totalPrice;
}
