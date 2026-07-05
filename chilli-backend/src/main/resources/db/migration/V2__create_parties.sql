CREATE TABLE IF NOT EXISTS parties (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    party_name     VARCHAR(200) NOT NULL,
    seller_type    VARCHAR(30),
    can_sell       BOOLEAN      NOT NULL DEFAULT FALSE,
    can_buy        BOOLEAN      NOT NULL DEFAULT FALSE,
    contact_person VARCHAR(200),
    phone          VARCHAR(20),
    email          VARCHAR(200),
    address_line1  VARCHAR(300),
    address_line2  VARCHAR(300),
    city           VARCHAR(100),
    state          VARCHAR(100),
    pincode        VARCHAR(10),
    gstin          VARCHAR(20),
    pan            VARCHAR(20),
    bank_name      VARCHAR(200),
    bank_account   VARCHAR(50),
    bank_ifsc      VARCHAR(20),
    notes          TEXT,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    inserted_by    VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    inserted_date  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by     VARCHAR(100),
    updated_date   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_parties_name     ON parties(party_name);
CREATE INDEX idx_parties_can_sell ON parties(can_sell);
CREATE INDEX idx_parties_can_buy  ON parties(can_buy);
