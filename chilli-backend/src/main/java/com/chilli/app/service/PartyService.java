package com.chilli.app.service;

import com.chilli.app.domain.Party;
import com.chilli.app.dto.common.PageResponse;
import com.chilli.app.dto.party.PartyRequest;
import com.chilli.app.dto.party.PartyResponse;
import com.chilli.app.enums.AuditAction;
import com.chilli.app.exception.ResourceNotFoundException;
import com.chilli.app.repository.PartyRepository;
import com.chilli.app.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartyService {

    private final PartyRepository partyRepository;
    private final AuditLogService auditLogService;

    public PageResponse<PartyResponse> search(Boolean canSell, Boolean canBuy, String search, Pageable pageable) {
        Page<Party> page = partyRepository.search(canSell, canBuy, search, pageable);
        return toPageResponse(page);
    }

    public List<PartyResponse> findAllSellers() {
        return partyRepository.findAllSellers().stream().map(this::toResponse).toList();
    }

    public List<PartyResponse> findAllBuyers() {
        return partyRepository.findAllBuyers().stream().map(this::toResponse).toList();
    }

    public PartyResponse findById(Long id) {
        return toResponse(getParty(id));
    }

    @Transactional
    public PartyResponse create(PartyRequest req) {
        Party party = buildParty(new Party(), req);
        Party saved = partyRepository.save(party);
        auditLogService.log("parties", saved.getId(), AuditAction.CREATE, null, JsonUtil.toJson(saved));
        return toResponse(saved);
    }

    @Transactional
    public PartyResponse update(Long id, PartyRequest req) {
        Party party = getParty(id);
        String oldJson = JsonUtil.toJson(party);
        buildParty(party, req);
        Party saved = partyRepository.save(party);
        auditLogService.log("parties", id, AuditAction.UPDATE, oldJson, JsonUtil.toJson(saved));
        return toResponse(saved);
    }

    @Transactional
    public void toggleStatus(Long id, boolean active) {
        Party party = getParty(id);
        String oldJson = JsonUtil.toJson(party);
        party.setIsActive(active);
        partyRepository.save(party);
        auditLogService.log("parties", id, AuditAction.UPDATE, oldJson, JsonUtil.toJson(party));
    }

    private Party buildParty(Party party, PartyRequest req) {
        party.setPartyName(req.getPartyName());
        party.setSellerType(req.getSellerType());
        party.setCanSell(Boolean.TRUE.equals(req.getCanSell()));
        party.setCanBuy(Boolean.TRUE.equals(req.getCanBuy()));
        party.setContactPerson(req.getContactPerson());
        party.setPhone(req.getPhone());
        party.setEmail(req.getEmail());
        party.setAddressLine1(req.getAddressLine1());
        party.setAddressLine2(req.getAddressLine2());
        party.setCity(req.getCity());
        party.setState(req.getState());
        party.setPincode(req.getPincode());
        party.setGstin(req.getGstin());
        party.setPan(req.getPan());
        party.setBankName(req.getBankName());
        party.setBankAccount(req.getBankAccount());
        party.setBankIfsc(req.getBankIfsc());
        party.setNotes(req.getNotes());
        return party;
    }

    public Party getParty(Long id) {
        return partyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found: " + id));
    }

    private PageResponse<PartyResponse> toPageResponse(Page<Party> page) {
        return PageResponse.<PartyResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private PartyResponse toResponse(Party p) {
        return PartyResponse.builder()
                .id(p.getId())
                .partyName(p.getPartyName())
                .sellerType(p.getSellerType())
                .canSell(p.getCanSell())
                .canBuy(p.getCanBuy())
                .contactPerson(p.getContactPerson())
                .phone(p.getPhone())
                .email(p.getEmail())
                .addressLine1(p.getAddressLine1())
                .addressLine2(p.getAddressLine2())
                .city(p.getCity())
                .state(p.getState())
                .pincode(p.getPincode())
                .gstin(p.getGstin())
                .pan(p.getPan())
                .bankName(p.getBankName())
                .bankAccount(p.getBankAccount())
                .bankIfsc(p.getBankIfsc())
                .notes(p.getNotes())
                .isActive(p.getIsActive())
                .insertedBy(p.getInsertedBy())
                .insertedDate(p.getInsertedDate())
                .updatedBy(p.getUpdatedBy())
                .updatedDate(p.getUpdatedDate())
                .build();
    }
}
