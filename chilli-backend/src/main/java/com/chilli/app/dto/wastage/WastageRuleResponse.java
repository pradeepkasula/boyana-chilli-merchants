package com.chilli.app.dto.wastage;

import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.WastageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WastageRuleResponse {
    private Long id;
    private ChilliType chilliType;
    private BigDecimal weightFromKg;
    private BigDecimal weightToKg;
    private WastageType wastageType;
    private BigDecimal wastageValue;
    private String description;
    private Boolean isActive;
    private String insertedBy;
    private LocalDateTime insertedDate;
    private String updatedBy;
    private LocalDateTime updatedDate;
}
