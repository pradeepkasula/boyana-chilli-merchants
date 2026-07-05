package com.chilli.app.dto.party;

import com.chilli.app.enums.SellerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartyResponse {
    private Long id;
    private String partyName;
    private SellerType sellerType;
    private Boolean canSell;
    private Boolean canBuy;
    private String contactPerson;
    private String phone;
    private String email;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String gstin;
    private String pan;
    private String bankName;
    private String bankAccount;
    private String bankIfsc;
    private String notes;
    private Boolean isActive;
    private String insertedBy;
    private LocalDateTime insertedDate;
    private String updatedBy;
    private LocalDateTime updatedDate;
}
