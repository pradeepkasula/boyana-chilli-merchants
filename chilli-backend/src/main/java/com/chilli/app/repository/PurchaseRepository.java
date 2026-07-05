package com.chilli.app.repository;

import com.chilli.app.domain.Purchase;
import com.chilli.app.enums.ChilliType;
import com.chilli.app.enums.PurchaseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query(value = "SELECT p FROM Purchase p JOIN FETCH p.seller WHERE " +
           "(:fromDate IS NULL OR p.purchaseDate >= :fromDate) " +
           "AND (:toDate IS NULL OR p.purchaseDate <= :toDate) " +
           "AND (:sellerId IS NULL OR p.seller.id = :sellerId) " +
           "AND (:chilliType IS NULL OR p.chilliType = :chilliType) " +
           "AND (:status IS NULL OR p.status = :status)",
           countQuery = "SELECT COUNT(p) FROM Purchase p WHERE " +
           "(:fromDate IS NULL OR p.purchaseDate >= :fromDate) " +
           "AND (:toDate IS NULL OR p.purchaseDate <= :toDate) " +
           "AND (:sellerId IS NULL OR p.seller.id = :sellerId) " +
           "AND (:chilliType IS NULL OR p.chilliType = :chilliType) " +
           "AND (:status IS NULL OR p.status = :status)")
    Page<Purchase> search(@Param("fromDate") LocalDate fromDate,
                          @Param("toDate") LocalDate toDate,
                          @Param("sellerId") Long sellerId,
                          @Param("chilliType") ChilliType chilliType,
                          @Param("status") PurchaseStatus status,
                          Pageable pageable);

    @Query("SELECT p FROM Purchase p JOIN FETCH p.seller WHERE p.id = :id")
    java.util.Optional<Purchase> findByIdWithSeller(@Param("id") Long id);

    @Query("SELECT p FROM Purchase p JOIN FETCH p.seller WHERE p.purchaseDate BETWEEN :fromDate AND :toDate AND p.status = 'CONFIRMED'")
    List<Purchase> findConfirmedBetween(@Param("fromDate") LocalDate fromDate,
                                        @Param("toDate") LocalDate toDate);
}
