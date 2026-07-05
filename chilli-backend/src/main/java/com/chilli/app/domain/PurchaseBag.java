package com.chilli.app.domain;

import com.chilli.app.domain.base.AuditableEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_bags",
        indexes = {
                @Index(name = "idx_bag_purchase", columnList = "purchase_id")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseBag extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id", nullable = false)
    private Purchase purchase;

    @Column(name = "bag_serial_no", nullable = false, length = 50)
    private String bagSerialNo;

    @Column(name = "actual_weight", nullable = false, precision = 10, scale = 3)
    private BigDecimal actualWeight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wastage_rule_id")
    private WastageRule wastageRule;

    @Column(name = "wastage_amount", nullable = false, precision = 10, scale = 3)
    @Builder.Default
    private BigDecimal wastageAmount = BigDecimal.ZERO;

    @Column(name = "gross_weight", nullable = false, precision = 10, scale = 3)
    private BigDecimal grossWeight;

    @Column(name = "price_per_kg", nullable = false, precision = 12, scale = 4)
    private BigDecimal pricePerKg;

    @Column(name = "bag_price", nullable = false, precision = 14, scale = 4)
    private BigDecimal bagPrice;
}
