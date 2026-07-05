package com.chilli.app.domain;

import com.chilli.app.domain.base.AuditableEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.PurchaseStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchases",
        indexes = {
                @Index(name = "idx_purchase_seller", columnList = "seller_id"),
                @Index(name = "idx_purchase_date", columnList = "purchase_date"),
                @Index(name = "idx_purchase_chilli", columnList = "chilli_type")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Purchase extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Party seller;

    @Enumerated(EnumType.STRING)
    @Column(name = "chilli_type", nullable = false, length = 20)
    private ChilliType chilliType;

    @Column(name = "price_per_kg", nullable = false, precision = 12, scale = 4)
    private BigDecimal pricePerKg;

    @Column(name = "no_of_bags", nullable = false)
    private Integer noOfBags;

    @Column(name = "total_actual_wt", precision = 12, scale = 3)
    private BigDecimal totalActualWt;

    @Column(name = "total_gross_wt", precision = 12, scale = 3)
    private BigDecimal totalGrossWt;

    @Column(name = "total_price", precision = 16, scale = 4)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PurchaseStatus status = PurchaseStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @JsonIgnore
    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PurchaseBag> bags = new ArrayList<>();
}
