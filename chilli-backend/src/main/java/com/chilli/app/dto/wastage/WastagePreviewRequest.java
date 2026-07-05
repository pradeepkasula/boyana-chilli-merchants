package com.chilli.app.dto.wastage;

import com.chilli.app.enums.ChilliType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WastagePreviewRequest {
    @NotNull
    private ChilliType chilliType;

    @NotNull
    @DecimalMin("0.001")
    private BigDecimal actualWeight;
}
