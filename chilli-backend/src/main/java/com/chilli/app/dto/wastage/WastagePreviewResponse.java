package com.chilli.app.dto.wastage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WastagePreviewResponse {
    private BigDecimal actualWeight;
    private BigDecimal wastageAmount;
    private BigDecimal grossWeight;
    private Long wastageRuleId;
    private String ruleDescription;
}
