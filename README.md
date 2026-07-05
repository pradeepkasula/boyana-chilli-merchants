# Chilli Enterprises App

A full-stack business management application for a Chilli Merchant.  
The merchant buys chilli bags from sellers (farmers, brokers, enterprises), tracks bag weights, applies wastage rules, and generates purchase reports.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 (multi-theme) |
| Backend | Java 21, Spring Boot 3.4.5, Spring Security (JWT) |
| Database | MySQL 8.0+ |
| ORM | JPA / Hibernate with Flyway migrations |
| Auth | JWT (HS256, 8-hour expiry), BCrypt passwords |

---

## Project Structure

```
Chilli_Enterprises_App/
├── chilli-backend/         # Spring Boot REST API
├── chilli-frontend/        # React + Vite SPA
└── database/
    └── chilli_db_setup.sql # Standalone DB setup script
```

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Java JDK | 21+ | Set `JAVA_HOME` |
| Apache Maven | 3.9+ | Available on `PATH` |
| Node.js | 18+ | npm included |
| MySQL Server | 8.0+ | Running locally on port 3306 |

---

## 1 — Database Setup

### Option A — Let Spring Boot + Flyway create the schema (recommended)

Just start the backend (step 2). Flyway runs all 6 migrations automatically on first boot and `DataInitializer` seeds the admin user. No manual SQL step needed.

### Option B — Run the standalone SQL script first

Use this if you want to pre-create the schema with sample data (wastage rules, parties) before starting the backend.

```bash
mysql -u root -p < database/chilli_db_setup.sql
```

This creates `chilli_db` with all 6 tables, indexes, 9 sample wastage rules, 4 sample parties, the default admin user, and the Flyway migration history records so the backend starts cleanly without re-running migrations.

> **Important:** Do not run the setup script on a database where the backend has already started — it drops and recreates all tables. If you need to reset, drop the database first:
> ```bash
> mysql -u root -p -e "DROP DATABASE chilli_db;"
> ```
> Then run the setup script or just start the backend.

### Default credentials seeded

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin` |
| Role | `SUPER_ADMIN` |

> **Note:** Change the admin password after the first login in a production environment.

---

## 2 — Backend Setup & Run

### Environment variables (optional)

The backend uses sensible defaults for local development. You can override them:

```bash
# MySQL credentials (default: root / root)
DB_USERNAME=root
DB_PASSWORD=root

# JWT secret (change in production!)
JWT_SECRET=chilli-enterprises-super-secret-key-change-in-production-2024
```

### Run with Maven

```bash
cd chilli-backend
mvn spring-boot:run
```

The API will start at **http://localhost:8080**

### Build a runnable JAR

```bash
cd chilli-backend
mvn clean package -DskipTests
java -jar target/chilli-backend-1.0.0-SNAPSHOT.jar
```

### Verify backend is running

```bash
curl http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Expected: HTTP 200 with a JWT token in the response.

### Swagger / OpenAPI UI

```
http://localhost:8080/swagger-ui/index.html
```

---

## 3 — Frontend Setup & Run

```bash
cd chilli-frontend
npm install        # first time only
npm run dev
```

The app will open at **http://localhost:5173**

The Vite dev server proxies all `/api/*` requests to `http://localhost:8080`, so no CORS issues during development.

### Build for production

```bash
cd chilli-frontend
npm run build
# Output is in chilli-frontend/dist/
```

---

## 4 — Default Login

Open **http://localhost:5173** in your browser.

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin` |

---

## 5 — User Roles

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full access, user management, audit log |
| `ADMIN` | All modules + audit log, can confirm/cancel purchases |
| `OPERATOR` | Parties, wastage rules, create purchases |
| `VIEWER` | Read-only access to all modules |

---

## 6 — Key Features

### Party Management
Register sellers (Farmer / Broker / Other Enterprise) and buyers. A party can have both `can_sell` and `can_buy` set to handle dual-role scenarios.

### Wastage Rules
Define weight-range rules per chilli type (Red / White / Mixed). Each rule specifies either a **percentage** deduction or a **flat KG** deduction. Overlapping rules for the same chilli type are rejected.

### Purchase Entry
1. Select seller, chilli type, price per KG, number of bags.
2. System generates one weight-input row per bag.
3. Entering a bag's actual weight triggers a live wastage preview (debounced 300 ms).
4. Gross weight = actual weight − wastage amount.
5. Bag price = gross weight × price per KG.
6. Running totals (actual weight / gross weight / total price) update in real time.
7. Save as DRAFT, then Confirm when ready.

### Reports
- **By Seller** — total purchases, total gross weight, total amount per seller in a date range.
- **By Chilli Type** — same breakdown grouped by RED / WHITE / MIXED.

### Audit Trail
Every create / update / delete is logged with the old JSON and new JSON so changes can be reviewed. Accessible to ADMIN and SUPER_ADMIN.

### Themes
Four built-in themes selectable from the top bar: **Light**, **Dark**, **Chilli Red**, **Ocean**.

---

## 7 — API Reference (key endpoints)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `GET` | `/api/auth/me` | Any | Current user info |
| `GET/POST` | `/api/parties` | Any / OPERATOR | List or create parties |
| `GET/POST` | `/api/wastage-rules` | Any / ADMIN | List or create rules |
| `POST` | `/api/wastage-rules/preview` | Any | Preview wastage for given weight + type |
| `GET/POST` | `/api/purchases` | Any / OPERATOR | List or create purchases |
| `PATCH` | `/api/purchases/{id}/confirm` | ADMIN | Confirm a draft purchase |
| `GET` | `/api/reports/purchase-by-seller` | Any | Report grouped by seller |
| `GET` | `/api/reports/purchase-by-chilli` | Any | Report grouped by chilli type |
| `GET` | `/api/audit-logs` | ADMIN | Paginated audit log |
| `GET/POST` | `/api/users` | ADMIN | User management |

Full interactive docs: **http://localhost:8080/swagger-ui/index.html**

---

## 8 — Database Schema (overview)

```
users            — login accounts with roles
parties          — sellers / buyers (dual-role via can_sell, can_buy flags)
wastage_rules    — weight-range deduction rules per chilli type
purchases        — purchase header (seller, date, chilli type, price)
purchase_bags    — individual bag weights + computed gross weights
audit_log        — full before/after JSON audit trail
```

All tables include `inserted_by`, `inserted_date`, `updated_by`, `updated_date` columns.

---

## 9 — Troubleshooting

### Backend fails to start — "Unknown database 'chilli_db'"
Run the database setup script first:
```bash
mysql -u root -p < database/chilli_db_setup.sql
```

### Backend fails to start — "Access denied for user 'root'"
Set the correct credentials as environment variables:
```bash
set DB_USERNAME=your_username
set DB_PASSWORD=your_password
```

### Frontend shows "Network Error" / blank page
Ensure the backend is running on port 8080 before opening the frontend.

### Port 8080 already in use
Find and kill the conflicting process:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <pid> /F
```

### Flyway "Detected failed migration" error
This happens if you ran the standalone SQL script on a database that Flyway had already partially migrated. Fix:
```bash
# Reset the database completely then restart the backend
mysql -u root -p -e "DROP DATABASE chilli_db; CREATE DATABASE chilli_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
# Then run: mvn spring-boot:run  (Flyway will apply all 6 migrations fresh)
```

---

## 10 — Running in Production

1. Set strong `JWT_SECRET`, `DB_USERNAME`, `DB_PASSWORD` environment variables.
2. Change `spring.jpa.show-sql` to `false` (already the default).
3. Build the frontend: `npm run build` → serve `dist/` via nginx or a static host.
4. Build the backend JAR: `mvn clean package -DskipTests`.
5. Run: `java -jar chilli-backend-1.0.0-SNAPSHOT.jar`.
6. Update CORS origins in `SecurityConfig.java` to match your production domain.
