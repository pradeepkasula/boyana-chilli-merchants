package com.chilli.app.domain;

import com.chilli.app.domain.base.AuditableEntity;
import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.WastageType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "wastage_rules",
        indexes = {
                @Index(name = "idx_wastage_chilli", columnList = "chilli_type,weight_from_kg,weight_to_kg")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WastageRule extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "chilli_type", nullable = false, length = 20)
    private ChilliType chilliType;

    @Column(name = "weight_from_kg", nullable = false, precision = 10, scale = 3)
    private BigDecimal weightFromKg;

    @Column(name = "weight_to_kg", nullable = false, precision = 10, scale = 3)
    private BigDecimal weightToKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "wastage_type", nullable = false, length = 20)
    private WastageType wastageType;

    @Column(name = "wastage_value", nullable = false, precision = 10, scale = 3)
    private BigDecimal wastageValue;

    @Column(length = 500)
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
