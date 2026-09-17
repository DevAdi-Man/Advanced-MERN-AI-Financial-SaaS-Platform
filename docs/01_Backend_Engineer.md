# Finora — Backend & API Engineer

## Role
Architect of the financial engine. The person who turns chaotic money data into structured, queryable, secured intelligence — like organizing a city's entire economy into a single, perfectly indexed spreadsheet.

---

## Responsibilities
- Design and maintain REST APIs with Node.js + Express
- Model MongoDB schemas for users, transactions, reports, and analytics
- Implement JWT-based auth (access + refresh token rotation)
- Own the transaction engine: CRUD, bulk ops, CSV import, duplicate detection
- Build MongoDB Aggregate Pipelines for analytics (income vs expense, category breakdown, trends)
- Manage cron jobs for recurring transactions and monthly report generation
- Integrate third-party services: Cloudinary (receipts), Resend (email), Google Gemini AI (receipt scanning)

---

## Features Owned
| Feature | Description |
|---|---|
| Auth system | Register, login, JWT access/refresh tokens |
| Transaction engine | Create, edit, delete, bulk delete, duplicate, CSV import |
| Recurring transactions | Cron job at `00:05 * * *` — auto-creates next occurrence |
| Analytics API | Aggregate pipeline: totals, trends, category breakdown by date range |
| Report system | Monthly report generation + email delivery via Resend |
| Receipt AI scan | Gemini 2.0 Flash parses uploaded receipt images into transaction data |
| File uploads | Cloudinary integration via Multer for profile photos and receipts |

---

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: MongoDB via Mongoose 8
- **Auth**: JWT (jsonwebtoken) + Passport.js (JWT strategy)
- **AI**: `@google/genai` — Gemini 2.0 Flash
- **Email**: Resend
- **Storage**: Cloudinary + multer-storage-cloudinary
- **Validation**: Zod
- **Scheduler**: node-cron
- **Dev**: ts-node-dev

---

## Challenges Solved

**1. Transactions require MongoDB sessions (replica set)**
Standalone MongoDB doesn't support multi-document transactions. Solved by running MongoDB with `--replSet rs0` in Podman, enabling ACID-compliant writes across User + ReportSetting collections on register.

**2. Amount precision**
Financial amounts are stored as integers (cents) in MongoDB using `set/get` converters on the Mongoose schema — avoiding floating point drift entirely.

**3. Aggregate pipeline performance**
Date-range filtering, grouping by category, and computing running totals are done in a single pipeline pass using `$match → $group → $project` — no N+1 queries.

**4. Recurring transaction scheduling**
Cron runs nightly, finds all transactions where `nextRecurringDate <= now`, clones them, and advances `nextRecurringDate` by the interval — all inside a session transaction.

---

## Present vs Future

| Today | Future |
|---|---|
| REST APIs | GraphQL subscriptions for real-time updates |
| Monolith Express app | Microservices (auth, transactions, analytics as separate services) |
| node-cron scheduler | Event-driven with Kafka/BullMQ |
| Gemini receipt scan | Multi-modal AI: voice memos → transactions |
| Monthly email reports | Real-time push notifications + Slack/WhatsApp alerts |
| Single MongoDB instance | Sharded cluster with read replicas |

---

## Contribution Story
Every rupee, dollar, or euro a user spends passes through this layer. The backend doesn't just store data — it enforces consistency, prevents corruption, schedules the future, and teaches an AI to read receipts. It is the silent engine that makes Finora feel magical on the surface while doing the heavy lifting underneath. Like a central bank, but faster, smarter, and running on TypeScript.
