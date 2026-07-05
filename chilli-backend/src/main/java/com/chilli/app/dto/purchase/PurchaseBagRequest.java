package com.chilli.app.dto.purchase;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PurchaseBagRequest {
    @NotBlank
    private String bagSerialNo;

    @NotNull
    @DecimalMin("0.001")
    private BigDecimal actualWeight;
}
