package com.chilli.app.dto.report;

import com.chilli.app.enums.ChilliType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseByChilliReport {
    private ChilliType chilliType;
    private Long purchaseCount;
    private BigDecimal totalActualWt;
    private BigDecimal totalGrossWt;
    private BigDecimal totalPrice;
}
