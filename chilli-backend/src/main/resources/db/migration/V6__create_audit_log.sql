CREATE TABLE IF NOT EXISTS audit_log (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(100) NOT NULL,
    entity_id   VARCHAR(100) NOT NULL,
    action      VARCHAR(20)  NOT NULL,
    old_value   JSON,
    new_value   JSON,
    changed_by  VARCHAR(100) NOT NULL,
    changed_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address  VARCHAR(45)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_audit_entity  ON audit_log(entity_name, entity_id);
CREATE INDEX idx_audit_changed ON audit_log(changed_at);
CREATE INDEX idx_audit_user    ON audit_log(changed_by);
