package com.chilli.app.service;

import com.chilli.app.domain.*;
import com.chilli.app.dto.common.PageResponse;
import com.chilli.app.dto.purchase.*;
import com.chilli.app.enums.AuditAction;
import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.PurchaseStatus;
import com.chilli.app.exception.BusinessRuleException;
import com.chilli.app.exception.ResourceNotFoundException;
import com.chilli.app.repository.PurchaseBagRepository;
import com.chilli.app.repository.PurchaseRepository;
import com.chilli.app.repository.WastageRuleRepository;
import com.chilli.app.util.JsonUtil;
import com.chilli.app.util.WastageCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseBagRepository purchaseBagRepository;
    private final WastageRuleRepository wastageRuleRepository;
    private final PartyService partyService;
    private final AuditLogService auditLogService;

    public PageResponse<PurchaseResponse> search(LocalDate fromDate, LocalDate toDate,
                                                   Long sellerId, ChilliType chilliType,
                                                   PurchaseStatus status, Pageable pageable) {
        Page<Purchase> page = purchaseRepository.search(fromDate, toDate, sellerId, chilliType, status, pageable);
        return PageResponse.<PurchaseResponse>builder()
                .content(page.getContent().stream().map(p -> toResponse(p, false)).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public PurchaseResponse findById(Long id) {
        Purchase purchase = purchaseRepository.findByIdWithSeller(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + id));
        return toResponse(purchase, true);
    }

    @Transactional
    public PurchaseResponse create(PurchaseCreateRequest req) {
        Party seller = partyService.getParty(req.getSellerId());
        if (!seller.getCanSell()) {
            throw new BusinessRuleException("Party is not registered as a seller");
        }

        List<WastageRule> rules = wastageRuleRepository
                .findByChilliTypeAndIsActiveTrueOrderByWeightFromKg(req.getChilliType());

        Purchase purchase = Purchase.builder()
                .purchaseDate(req.getPurchaseDate())
                .seller(seller)
                .chilliType(req.getChilliType())
                .pricePerKg(req.getPricePerKg())
                .noOfBags(req.getNoOfBags())
                .remarks(req.getRemarks())
                .status(PurchaseStatus.DRAFT)
                .build();
        purchase = purchaseRepository.save(purchase);

        List<PurchaseBag> bags = new ArrayList<>();
        for (PurchaseBagRequest bagReq : req.getBags()) {
            WastageCalculator.Result result = WastageCalculator.calculate(bagReq.getActualWeight(), rules);
            BigDecimal bagPrice = result.grossWeight()
                    .multiply(req.getPricePerKg())
                    .setScale(4, RoundingMode.HALF_UP);
            PurchaseBag bag = PurchaseBag.builder()
                    .purchase(purchase)
                    .bagSerialNo(bagReq.getBagSerialNo())
                    .actualWeight(bagReq.getActualWeight())
                    .wastageRule(result.matchedRule())
                    .wastageAmount(result.wastageAmount())
                    .grossWeight(result.grossWeight())
                    .pricePerKg(req.getPricePerKg())
                    .bagPrice(bagPrice)
                    .build();
            bags.add(bag);
        }
        purchaseBagRepository.saveAll(bags);
        updateTotals(purchase, bags);
        Purchase saved = purchaseRepository.save(purchase);
        auditLogService.log("purchases", saved.getId(), AuditAction.CREATE, null, JsonUtil.toJson(saved));
        purchase.setBags(bags);
        return toResponse(purchase, true);
    }

    @Transactional
    public PurchaseResponse update(Long id, PurchaseCreateRequest req) {
        Purchase purchase = getPurchase(id);
        if (purchase.getStatus() != PurchaseStatus.DRAFT) {
            throw new BusinessRuleException("Only DRAFT purchases can be updated");
        }
        String oldJson = JsonUtil.toJson(purchase);

        Party seller = partyService.getParty(req.getSellerId());
        if (!seller.getCanSell()) {
            throw new BusinessRuleException("Party is not registered as a seller");
        }

        purchaseBagRepository.deleteByPurchaseId(id);

        List<WastageRule> rules = wastageRuleRepository
                .findByChilliTypeAndIsActiveTrueOrderByWeightFromKg(req.getChilliType());

        purchase.setSeller(seller);
        purchase.setPurchaseDate(req.getPurchaseDate());
        purchase.setChilliType(req.getChilliType());
        purchase.setPricePerKg(req.getPricePerKg());
        purchase.setNoOfBags(req.getNoOfBags());
        purchase.setRemarks(req.getRemarks());

        List<PurchaseBag> bags = new ArrayList<>();
        for (PurchaseBagRequest bagReq : req.getBags()) {
            WastageCalculator.Result result = WastageCalculator.calculate(bagReq.getActualWeight(), rules);
            BigDecimal bagPrice = result.grossWeight()
                    .multiply(req.getPricePerKg())
                    .setScale(4, RoundingMode.HALF_UP);
            PurchaseBag bag = PurchaseBag.builder()
                    .purchase(purchase)
                    .bagSerialNo(bagReq.getBagSerialNo())
                    .actualWeight(bagReq.getActualWeight())
                    .wastageRule(result.matchedRule())
                    .wastageAmount(result.wastageAmount())
                    .grossWeight(result.grossWeight())
                    .pricePerKg(req.getPricePerKg())
                    .bagPrice(bagPrice)
                    .build();
            bags.add(bag);
        }
        purchaseBagRepository.saveAll(bags);
        updateTotals(purchase, bags);
        Purchase saved = purchaseRepository.save(purchase);
        auditLogService.log("purchases", id, AuditAction.UPDATE, oldJson, JsonUtil.toJson(saved));
        purchase.setBags(bags);
        return toResponse(purchase, true);
    }

    @Transactional
    public PurchaseResponse confirm(Long id) {
        Purchase purchase = getPurchase(id);
        if (purchase.getStatus() != PurchaseStatus.DRAFT) {
            throw new BusinessRuleException("Only DRAFT purchases can be confirmed");
        }
        String oldJson = JsonUtil.toJson(purchase);
        purchase.setStatus(PurchaseStatus.CONFIRMED);
        Purchase saved = purchaseRepository.save(purchase);
        auditLogService.log("purchases", id, AuditAction.UPDATE, oldJson, JsonUtil.toJson(saved));
        return toResponse(saved, false);
    }

    @Transactional
    public PurchaseResponse cancel(Long id) {
        Purchase purchase = getPurchase(id);
        if (purchase.getStatus() == PurchaseStatus.CANCELLED) {
            throw new BusinessRuleException("Purchase is already cancelled");
        }
        String oldJson = JsonUtil.toJson(purchase);
        purchase.setStatus(PurchaseStatus.CANCELLED);
        Purchase saved = purchaseRepository.save(purchase);
        auditLogService.log("purchases", id, AuditAction.UPDATE, oldJson, JsonUtil.toJson(saved));
        return toResponse(saved, false);
    }

    private void updateTotals(Purchase purchase, List<PurchaseBag> bags) {
        BigDecimal totalActual = bags.stream()
                .map(PurchaseBag::getActualWeight)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalGross = bags.stream()
                .map(PurchaseBag::getGrossWeight)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPrice = bags.stream()
                .map(PurchaseBag::getBagPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        purchase.setTotalActualWt(totalActual.setScale(3, RoundingMode.HALF_UP));
        purchase.setTotalGrossWt(totalGross.setScale(3, RoundingMode.HALF_UP));
        purchase.setTotalPrice(totalPrice.setScale(4, RoundingMode.HALF_UP));
    }

    private Purchase getPurchase(Long id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + id));
    }

    private PurchaseResponse toResponse(Purchase p, boolean includeBags) {
        List<PurchaseBagResponse> bagResponses = null;
        if (includeBags) {
            bagResponses = (p.getBags() != null ? p.getBags() : List.<PurchaseBag>of()).stream()
                    .map(this::toBagResponse).toList();
        }
        return PurchaseResponse.builder()
                .id(p.getId())
                .purchaseDate(p.getPurchaseDate())
                .sellerId(p.getSeller() != null ? p.getSeller().getId() : null)
                .sellerName(p.getSeller() != null ? p.getSeller().getPartyName() : null)
                .chilliType(p.getChilliType())
                .pricePerKg(p.getPricePerKg())
                .noOfBags(p.getNoOfBags())
                .totalActualWt(p.getTotalActualWt())
                .totalGrossWt(p.getTotalGrossWt())
                .totalPrice(p.getTotalPrice())
                .status(p.getStatus())
                .remarks(p.getRemarks())
                .bags(bagResponses)
                .insertedBy(p.getInsertedBy())
                .insertedDate(p.getInsertedDate())
                .updatedBy(p.getUpdatedBy())
                .updatedDate(p.getUpdatedDate())
                .build();
    }

    private PurchaseBagResponse toBagResponse(PurchaseBag b) {
        return PurchaseBagResponse.builder()
                .id(b.getId())
                .bagSerialNo(b.getBagSerialNo())
                .actualWeight(b.getActualWeight())
                .wastageAmount(b.getWastageAmount())
                .grossWeight(b.getGrossWeight())
                .pricePerKg(b.getPricePerKg())
                .bagPrice(b.getBagPrice())
                .wastageRuleId(b.getWastageRule() != null ? b.getWastageRule().getId() : null)
                .build();
    }
}
