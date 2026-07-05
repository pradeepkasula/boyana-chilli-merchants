package com.chilli.app.dto.party;

import com.chilli.app.enums.SellerType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PartyRequest {
    @NotBlank
    private String partyName;
    private SellerType sellerType;
    private Boolean canSell = false;
    private Boolean canBuy = false;
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

    @AssertTrue(message = "Party must be either a seller, a buyer, or both")
    public boolean isRoleAssigned() {
        return Boolean.TRUE.equals(canSell) || Boolean.TRUE.equals(canBuy);
    }
}
