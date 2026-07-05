CREATE TABLE IF NOT EXISTS purchases (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_date   DATE           NOT NULL,
    seller_id       BIGINT         NOT NULL,
    chilli_type     VARCHAR(20)    NOT NULL,
    price_per_kg    DECIMAL(12,4)  NOT NULL,
    no_of_bags      INT            NOT NULL,
    total_actual_wt DECIMAL(12,3),
    total_gross_wt  DECIMAL(12,3),
    total_price     DECIMAL(16,4),
    status          VARCHAR(20)    NOT NULL DEFAULT 'DRAFT',
    remarks         TEXT,
    inserted_by     VARCHAR(100)   NOT NULL DEFAULT 'SYSTEM',
    inserted_date   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    updated_date    DATETIME,
    CONSTRAINT fk_purchase_seller FOREIGN KEY (seller_id) REFERENCES parties(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_purchase_seller ON purchases(seller_id);
CREATE INDEX idx_purchase_date   ON purchases(purchase_date);
CREATE INDEX idx_purchase_chilli ON purchases(chilli_type);
