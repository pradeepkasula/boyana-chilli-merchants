package com.chilli.app.domain;

import com.chilli.app.domain.base.AuditableEntity;
import com.chilli.app.enums.SellerType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parties",
        indexes = {
                @Index(name = "idx_parties_name", columnList = "party_name"),
                @Index(name = "idx_parties_can_sell", columnList = "can_sell"),
                @Index(name = "idx_parties_can_buy", columnList = "can_buy")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Party extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "party_name", nullable = false, length = 200)
    private String partyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "seller_type", length = 30)
    private SellerType sellerType;

    @Column(name = "can_sell", nullable = false)
    @Builder.Default
    private Boolean canSell = false;

    @Column(name = "can_buy", nullable = false)
    @Builder.Default
    private Boolean canBuy = false;

    @Column(name = "contact_person", length = 200)
    private String contactPerson;

    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String email;

    @Column(name = "address_line1", length = 300)
    private String addressLine1;

    @Column(name = "address_line2", length = 300)
    private String addressLine2;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(length = 20)
    private String gstin;

    @Column(length = 20)
    private String pan;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @Column(name = "bank_account", length = 50)
    private String bankAccount;

    @Column(name = "bank_ifsc", length = 20)
    private String bankIfsc;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
