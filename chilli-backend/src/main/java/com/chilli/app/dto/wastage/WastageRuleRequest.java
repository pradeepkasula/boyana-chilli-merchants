package com.chilli.app.dto.wastage;

import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.WastageType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WastageRuleRequest {
    @NotNull
    private ChilliType chilliType;

    @NotNull
    @DecimalMin("0.001")
    private BigDecimal weightFromKg;

    @NotNull
    @DecimalMin("0.001")
    private BigDecimal weightToKg;

    @NotNull
    private WastageType wastageType;

    @NotNull
    @DecimalMin("0.001")
    private BigDecimal wastageValue;

    private String description;

    @AssertTrue(message = "weightToKg must be greater than weightFromKg")
    public boolean isWeightRangeValid() {
        return weightFromKg != null && weightToKg != null && weightToKg.compareTo(weightFromKg) > 0;
    }
}
