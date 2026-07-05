package com.chilli.app.dto.purchase;

import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.PurchaseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponse {
    private Long id;
    private LocalDate purchaseDate;
    private Long sellerId;
    private String sellerName;
    private ChilliType chilliType;
    private BigDecimal pricePerKg;
    private Integer noOfBags;
    private BigDecimal totalActualWt;
    private BigDecimal totalGrossWt;
    private BigDecimal totalPrice;
    private PurchaseStatus status;
    private String remarks;
    private List<PurchaseBagResponse> bags;
    private String insertedBy;
    private LocalDateTime insertedDate;
    private String updatedBy;
    private LocalDateTime updatedDate;
}
