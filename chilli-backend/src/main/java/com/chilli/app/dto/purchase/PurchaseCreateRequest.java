package com.chilli.app.dto.purchase;

import com.chilli.app.enums.ChilliType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class PurchaseCreateRequest {
    @NotNull
    private LocalDate purchaseDate;

    @NotNull
    private Long sellerId;

    @NotNull
    private ChilliType chilliType;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal pricePerKg;

    @NotNull
    @Min(1)
    private Integer noOfBags;

    private String remarks;

    @NotNull
    @Size(min = 1)
    @Valid
    private List<PurchaseBagRequest> bags;

    @AssertTrue(message = "Number of bags must match the bags list size")
    public boolean isBagCountMatch() {
        return bags != null && noOfBags != null && bags.size() == noOfBags;
    }
}
