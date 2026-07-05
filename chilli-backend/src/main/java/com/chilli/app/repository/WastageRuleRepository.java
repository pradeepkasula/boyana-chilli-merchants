package com.chilli.app.repository;

import com.chilli.app.domain.WastageRule;
import com.chilli.app.enums.ChilliType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface WastageRuleRepository extends JpaRepository<WastageRule, Long> {

    List<WastageRule> findByChilliTypeAndIsActiveTrueOrderByWeightFromKg(ChilliType chilliType);

    @Query("SELECT COUNT(w) FROM WastageRule w WHERE w.chilliType = :chilliType " +
           "AND w.isActive = true AND w.id != :excludeId " +
           "AND w.weightFromKg < :toKg AND w.weightToKg > :fromKg")
    long countOverlapping(@Param("chilliType") ChilliType chilliType,
                          @Param("fromKg") BigDecimal fromKg,
                          @Param("toKg") BigDecimal toKg,
                          @Param("excludeId") Long excludeId);
}
