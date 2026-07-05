package com.chilli.app.repository;

import com.chilli.app.domain.PurchaseBag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseBagRepository extends JpaRepository<PurchaseBag, Long> {
    List<PurchaseBag> findByPurchaseIdOrderByBagSerialNo(Long purchaseId);
    void deleteByPurchaseId(Long purchaseId);
}
