CREATE TABLE IF NOT EXISTS wastage_rules (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    chilli_type    VARCHAR(20)    NOT NULL,
    weight_from_kg DECIMAL(10,3)  NOT NULL,
    weight_to_kg   DECIMAL(10,3)  NOT NULL,
    wastage_type   VARCHAR(20)    NOT NULL,
    wastage_value  DECIMAL(10,3)  NOT NULL,
    description    VARCHAR(500),
    is_active      BOOLEAN        NOT NULL DEFAULT TRUE,
    inserted_by    VARCHAR(100)   NOT NULL DEFAULT 'SYSTEM',
    inserted_date  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by     VARCHAR(100),
    updated_date   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_wastage_chilli ON wastage_rules(chilli_type, weight_from_kg, weight_to_kg);
