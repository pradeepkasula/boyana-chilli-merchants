package com.chilli.app.repository;

import com.chilli.app.domain.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:entityName IS NULL OR a.entityName = :entityName) " +
           "AND (:entityId IS NULL OR a.entityId = :entityId) " +
           "AND (:changedBy IS NULL OR a.changedBy = :changedBy) " +
           "AND (:fromDate IS NULL OR a.changedAt >= :fromDate) " +
           "AND (:toDate IS NULL OR a.changedAt <= :toDate) " +
           "ORDER BY a.changedAt DESC")
    Page<AuditLog> search(@Param("entityName") String entityName,
                          @Param("entityId") String entityId,
                          @Param("changedBy") String changedBy,
                          @Param("fromDate") LocalDateTime fromDate,
                          @Param("toDate") LocalDateTime toDate,
                          Pageable pageable);
}
