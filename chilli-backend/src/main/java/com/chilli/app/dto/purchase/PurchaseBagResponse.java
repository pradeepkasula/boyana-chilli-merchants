package com.chilli.app.dto.purchase;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseBagResponse {
    private Long id;
    private String bagSerialNo;
    private BigDecimal actualWeight;
    private BigDecimal wastageAmount;
    private BigDecimal grossWeight;
    private BigDecimal pricePerKg;
    private BigDecimal bagPrice;
    private Long wastageRuleId;
}
