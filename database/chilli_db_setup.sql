-- =============================================================================
-- Chilli Enterprises App — Full Database Setup Script
-- MySQL 8.0+ / MySQL 8.4
-- =============================================================================
-- Usage:
--   mysql -u root -p < chilli_db_setup.sql
-- Or paste into MySQL Workbench / DBeaver / any MySQL client.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Create & select database
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS chilli_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE chilli_db;

-- -----------------------------------------------------------------------------
-- 2. Drop tables in safe order (FK-aware)
--    Only needed when re-running this script on an existing database.
-- -----------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS purchase_bags;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS wastage_rules;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS flyway_schema_history;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 3. users
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(200) NOT NULL,
    email         VARCHAR(200),
    phone         VARCHAR(20),
    role          VARCHAR(30)  NOT NULL DEFAULT 'VIEWER'
                               COMMENT 'SUPER_ADMIN | ADMIN | OPERATOR | VIEWER',
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    inserted_by   VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    inserted_date DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by    VARCHAR(100),
    updated_date  DATETIME
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Application users with role-based access';

-- -----------------------------------------------------------------------------
-- 4. parties  (unified seller + buyer registry)
-- -----------------------------------------------------------------------------
CREATE TABLE parties (
    id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
    party_name     VARCHAR(200) NOT NULL,
    seller_type    VARCHAR(30)
                   COMMENT 'FARMER | BROKER | OTHER_ENTERPRISE | NULL',
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
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Sellers and/or buyers; dual-role via can_sell / can_buy flags';

CREATE INDEX idx_parties_name     ON parties (party_name);
CREATE INDEX idx_parties_can_sell ON parties (can_sell);
CREATE INDEX idx_parties_can_buy  ON parties (can_buy);

-- -----------------------------------------------------------------------------
-- 5. wastage_rules
-- -----------------------------------------------------------------------------
CREATE TABLE wastage_rules (
    id             BIGINT        AUTO_INCREMENT PRIMARY KEY,
    chilli_type    VARCHAR(20)   NOT NULL COMMENT 'RED | WHITE | MIXED',
    weight_from_kg DECIMAL(10,3) NOT NULL,
    weight_to_kg   DECIMAL(10,3) NOT NULL,
    wastage_type   VARCHAR(20)   NOT NULL COMMENT 'PERCENTAGE | FLAT_KG',
    wastage_value  DECIMAL(10,3) NOT NULL,
    description    VARCHAR(500),
    is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
    inserted_by    VARCHAR(100)  NOT NULL DEFAULT 'SYSTEM',
    inserted_date  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by     VARCHAR(100),
    updated_date   DATETIME,
    CONSTRAINT chk_weight_range CHECK (weight_to_kg > weight_from_kg),
    CONSTRAINT chk_wastage_pos  CHECK (wastage_value > 0)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Rules that determine how much weight is deducted per bag per chilli type';

CREATE INDEX idx_wastage_chilli ON wastage_rules (chilli_type, weight_from_kg, weight_to_kg);

-- -----------------------------------------------------------------------------
-- 6. purchases  (one header per purchase session)
-- -----------------------------------------------------------------------------
CREATE TABLE purchases (
    id              BIGINT        AUTO_INCREMENT PRIMARY KEY,
    purchase_date   DATE          NOT NULL,
    seller_id       BIGINT        NOT NULL,
    chilli_type     VARCHAR(20)   NOT NULL COMMENT 'RED | WHITE | MIXED',
    price_per_kg    DECIMAL(12,4) NOT NULL,
    no_of_bags      INT           NOT NULL,
    total_actual_wt DECIMAL(12,3)          COMMENT 'Computed: SUM of actual_weight across bags',
    total_gross_wt  DECIMAL(12,3)          COMMENT 'Computed: SUM of gross_weight across bags',
    total_price     DECIMAL(16,4)          COMMENT 'Computed: SUM of bag_price across bags',
    status          VARCHAR(20)   NOT NULL DEFAULT 'DRAFT'
                                  COMMENT 'DRAFT | CONFIRMED | CANCELLED',
    remarks         TEXT,
    inserted_by     VARCHAR(100)  NOT NULL DEFAULT 'SYSTEM',
    inserted_date   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    updated_date    DATETIME,
    CONSTRAINT fk_purchase_seller FOREIGN KEY (seller_id) REFERENCES parties (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Chilli purchase header; bags are in purchase_bags';

CREATE INDEX idx_purchase_seller ON purchases (seller_id);
CREATE INDEX idx_purchase_date   ON purchases (purchase_date);
CREATE INDEX idx_purchase_chilli ON purchases (chilli_type);
CREATE INDEX idx_purchase_status ON purchases (status);

-- -----------------------------------------------------------------------------
-- 7. purchase_bags  (one row per physical bag)
-- -----------------------------------------------------------------------------
CREATE TABLE purchase_bags (
    id              BIGINT        AUTO_INCREMENT PRIMARY KEY,
    purchase_id     BIGINT        NOT NULL,
    bag_serial_no   VARCHAR(50)   NOT NULL   COMMENT 'e.g. Bag 1, Bag 2',
    actual_weight   DECIMAL(10,3) NOT NULL   COMMENT 'Weight entered by user (kg)',
    wastage_rule_id BIGINT                   COMMENT 'Rule applied; NULL if no rule matched',
    wastage_amount  DECIMAL(10,3) NOT NULL DEFAULT 0,
    gross_weight    DECIMAL(10,3) NOT NULL   COMMENT 'actual_weight - wastage_amount',
    price_per_kg    DECIMAL(12,4) NOT NULL   COMMENT 'Snapshot of purchase price at entry time',
    bag_price       DECIMAL(14,4) NOT NULL   COMMENT 'gross_weight * price_per_kg',
    inserted_by     VARCHAR(100)  NOT NULL DEFAULT 'SYSTEM',
    inserted_date   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    updated_date    DATETIME,
    CONSTRAINT fk_bag_purchase FOREIGN KEY (purchase_id)     REFERENCES purchases    (id),
    CONSTRAINT fk_bag_rule     FOREIGN KEY (wastage_rule_id) REFERENCES wastage_rules (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Individual bag weights and computed prices within a purchase';

CREATE INDEX idx_bag_purchase ON purchase_bags (purchase_id);

-- -----------------------------------------------------------------------------
-- 8. audit_log
-- -----------------------------------------------------------------------------
CREATE TABLE audit_log (
    id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(100) NOT NULL  COMMENT 'Table / entity being changed',
    entity_id   VARCHAR(100) NOT NULL  COMMENT 'PK of the changed record',
    action      VARCHAR(20)  NOT NULL  COMMENT 'CREATE | UPDATE | DELETE',
    old_value   JSON                   COMMENT 'State before the change',
    new_value   JSON                   COMMENT 'State after the change',
    changed_by  VARCHAR(100) NOT NULL,
    changed_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address  VARCHAR(45)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Full audit trail; every CREATE/UPDATE/DELETE is logged here';

CREATE INDEX idx_audit_entity  ON audit_log (entity_name, entity_id);
CREATE INDEX idx_audit_changed ON audit_log (changed_at);
CREATE INDEX idx_audit_user    ON audit_log (changed_by);

-- =============================================================================
-- 9. Default admin user
--    Username : admin
--    Password : admin
--    Hash     : BCrypt strength-12 (generated by Spring Security BCryptPasswordEncoder)
-- =============================================================================
INSERT INTO users (username, password_hash, full_name, email, role, is_active, inserted_by, inserted_date)
VALUES (
    'admin',
    '$2a$12$ZQEYKBtH6..SZk8gWZxSge4R5fLMZS.wkJWeDT.Q3gJxtsTbk7t3G',
    'Super Administrator',
    'admin@chilli.local',
    'SUPER_ADMIN',
    TRUE,
    'SYSTEM',
    NOW()
);

-- =============================================================================
-- 10. Sample wastage rules  (optional demo data — delete if not needed)
-- =============================================================================
INSERT INTO wastage_rules (chilli_type, weight_from_kg, weight_to_kg, wastage_type, wastage_value, description, inserted_by)
VALUES
-- Red chilli rules
('RED',   0.001,  25.000, 'PERCENTAGE', 2.0,  'Red chilli ≤ 25 kg — 2% wastage',    'SYSTEM'),
('RED',  25.001,  50.000, 'PERCENTAGE', 3.0,  'Red chilli 25-50 kg — 3% wastage',   'SYSTEM'),
('RED',  50.001, 999.999, 'PERCENTAGE', 4.0,  'Red chilli > 50 kg — 4% wastage',    'SYSTEM'),
-- White chilli rules
('WHITE',  0.001,  25.000, 'PERCENTAGE', 1.5,  'White chilli ≤ 25 kg — 1.5% wastage', 'SYSTEM'),
('WHITE', 25.001,  50.000, 'PERCENTAGE', 2.5,  'White chilli 25-50 kg — 2.5% wastage','SYSTEM'),
('WHITE', 50.001, 999.999, 'PERCENTAGE', 3.5,  'White chilli > 50 kg — 3.5% wastage', 'SYSTEM'),
-- Mixed chilli rules
('MIXED',  0.001,  25.000, 'FLAT_KG',   0.500, 'Mixed chilli ≤ 25 kg — 0.5 kg flat',  'SYSTEM'),
('MIXED', 25.001,  50.000, 'FLAT_KG',   0.750, 'Mixed chilli 25-50 kg — 0.75 kg flat', 'SYSTEM'),
('MIXED', 50.001, 999.999, 'FLAT_KG',   1.000, 'Mixed chilli > 50 kg — 1 kg flat',     'SYSTEM');

-- =============================================================================
-- 11. Sample party (seller)  (optional demo data — delete if not needed)
-- =============================================================================
INSERT INTO parties (party_name, seller_type, can_sell, can_buy, contact_person, phone, city, state, is_active, inserted_by)
VALUES
('Raju Farms',          'FARMER',           TRUE,  FALSE, 'Raju',        '9876543210', 'Guntur',   'Andhra Pradesh', TRUE, 'SYSTEM'),
('Srinivas Brokers',    'BROKER',           TRUE,  FALSE, 'Srinivas',    '9876543211', 'Warangal', 'Telangana',      TRUE, 'SYSTEM'),
('Krishna Enterprises', 'OTHER_ENTERPRISE', TRUE,  TRUE,  'Krishna',     '9876543212', 'Vijayawada','Andhra Pradesh',TRUE, 'SYSTEM'),
('Venkat Traders',      'FARMER',           TRUE,  FALSE, 'Venkatesh',   '9876543213', 'Nellore',  'Andhra Pradesh', TRUE, 'SYSTEM');

-- =============================================================================
-- 12. Flyway schema history
--     Tells Flyway that V1-V6 migrations have already been applied so it
--     does not attempt to re-run them when the Spring Boot backend starts.
--     Checksums match the actual Flyway migration files in chilli-backend.
-- =============================================================================
CREATE TABLE IF NOT EXISTS flyway_schema_history (
    installed_rank INT          NOT NULL,
    version        VARCHAR(50),
    description    VARCHAR(200) NOT NULL,
    type           VARCHAR(20)  NOT NULL,
    script         VARCHAR(1000) NOT NULL,
    checksum       INT,
    installed_by   VARCHAR(100) NOT NULL,
    installed_on   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    execution_time INT          NOT NULL,
    success        BOOLEAN      NOT NULL,
    PRIMARY KEY (installed_rank)
) ENGINE = InnoDB;

INSERT INTO flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success)
VALUES
(1, '1', 'create users',         'SQL', 'V1__create_users.sql',          -947753015,  'root', NOW(), 53,  1),
(2, '2', 'create parties',       'SQL', 'V2__create_parties.sql',          341916636,  'root', NOW(), 132, 1),
(3, '3', 'create wastage rules', 'SQL', 'V3__create_wastage_rules.sql',    322450750,  'root', NOW(), 66,  1),
(4, '4', 'create purchases',     'SQL', 'V4__create_purchases.sql',        683363659,  'root', NOW(), 138, 1),
(5, '5', 'create purchase bags', 'SQL', 'V5__create_purchase_bags.sql',  -1581309376, 'root', NOW(), 93,  1),
(6, '6', 'create audit log',     'SQL', 'V6__create_audit_log.sql',       1033594717,  'root', NOW(), 117, 1);

-- =============================================================================
-- Verify setup
-- =============================================================================
SELECT 'Setup complete!' AS status;

SELECT
    table_name                            AS `Table`,
    table_rows                            AS `Rows`,
    ROUND(data_length / 1024, 1)          AS `Data KB`,
    table_comment                         AS `Description`
FROM information_schema.tables
WHERE table_schema = 'chilli_db'
ORDER BY table_name;
