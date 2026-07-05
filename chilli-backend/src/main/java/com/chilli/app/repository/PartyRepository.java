package com.chilli.app.repository;

import com.chilli.app.domain.Party;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyRepository extends JpaRepository<Party, Long> {

    @Query("SELECT p FROM Party p WHERE p.isActive = true " +
           "AND (:canSell IS NULL OR p.canSell = :canSell) " +
           "AND (:canBuy IS NULL OR p.canBuy = :canBuy) " +
           "AND (:search IS NULL OR LOWER(p.partyName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Party> search(@Param("canSell") Boolean canSell,
                       @Param("canBuy") Boolean canBuy,
                       @Param("search") String search,
                       Pageable pageable);

    @Query("SELECT p FROM Party p WHERE p.canSell = true AND p.isActive = true ORDER BY p.partyName")
    List<Party> findAllSellers();

    @Query("SELECT p FROM Party p WHERE p.canBuy = true AND p.isActive = true ORDER BY p.partyName")
    List<Party> findAllBuyers();
}
