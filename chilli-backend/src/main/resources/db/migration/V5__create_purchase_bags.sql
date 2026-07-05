CREATE TABLE IF NOT EXISTS purchase_bags (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_id      BIGINT         NOT NULL,
    bag_serial_no    VARCHAR(50)    NOT NULL,
    actual_weight    DECIMAL(10,3)  NOT NULL,
    wastage_rule_id  BIGINT,
    wastage_amount   DECIMAL(10,3)  NOT NULL DEFAULT 0,
    gross_weight     DECIMAL(10,3)  NOT NULL,
    price_per_kg     DECIMAL(12,4)  NOT NULL,
    bag_price        DECIMAL(14,4)  NOT NULL,
    inserted_by      VARCHAR(100)   NOT NULL DEFAULT 'SYSTEM',
    inserted_date    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by       VARCHAR(100),
    updated_date     DATETIME,
    CONSTRAINT fk_bag_purchase FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    CONSTRAINT fk_bag_rule     FOREIGN KEY (wastage_rule_id) REFERENCES wastage_rules(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_bag_purchase ON purchase_bags(purchase_id);
