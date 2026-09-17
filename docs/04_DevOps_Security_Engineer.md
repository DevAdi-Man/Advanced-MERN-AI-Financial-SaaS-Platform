# Finora — DevOps & Security Engineer

## Role
The invisible foundation. Nobody notices DevOps when it works — and that's exactly the point. Every deployment, every secret, every container, every uptime metric is owned here.

---

## Responsibilities
- Manage local development environment (Podman containers)
- Maintain the Makefile-based developer workflow
- Secure all secrets and environment variables
- Ensure MongoDB runs correctly with replica set for transaction support
- Manage dependency versions and audit vulnerabilities
- Define the path to production deployment

---

## Current Infrastructure

### Local Dev Stack
```
┌─────────────────────────────────────────────┐
│  Developer Machine                          │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │  React/Vite  │    │  Express/Node.js  │   │
│  │  :5173       │───▶│  :8000            │   │
│  └──────────────┘    └────────┬─────────┘   │
│                               │             │
│                    ┌──────────▼──────────┐  │
│                    │  Podman Container   │  │
│                    │  MongoDB 7          │  │
│                    │  --replSet rs0      │  │
│                    │  :27017             │  │
│                    └─────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Makefile Commands
| Command | Purpose |
|---|---|
| `make db-start` | Start MongoDB container (idempotent — skips if already exists) |
| `make db-stop` | Stop and remove container |
| `make install` | `npm install` for both backend and client |
| `make backend` | Run backend dev server |
| `make frontend` | Run frontend dev server |
| `make dev` | Start DB + both servers in parallel |
| `make seed` | Seed demo user + 30 transactions + 6 months report history |
| `make clean` | Stop container + remove volume |

---

## Security Measures

### Secrets Management
- All secrets in `backend/.env` — never committed (in `.gitignore`)
- Client secrets in `client/.env` — only `VITE_` prefixed vars exposed to browser
- Redux state encrypted at rest via `redux-persist-transform-encrypt`
- JWT uses separate `JWT_SECRET` and `JWT_REFRESH_SECRET` — compromise of one doesn't break both

### Auth Security
- Access token: short-lived (`15m`)
- Refresh token: longer-lived (`7d`)
- Passwords hashed with `bcrypt` via Mongoose pre-save hook — plaintext never touches the DB
- Passport JWT strategy extracts token from `Authorization: Bearer` header only

### API Security
- CORS restricted to `FRONTEND_ORIGIN` only
- File uploads: type-checked (`image/jpeg`, `image/png` only), size-limited (2MB max)
- Input validation via Zod on all routes before hitting service layer
- Error handler middleware catches all unhandled errors — no stack traces leak to client in production

### MongoDB
- Runs as replica set (`--replSet rs0`) — required for multi-document transactions
- In production: should use auth + TLS + IP allowlist

---

## Environment Variables Inventory

| Variable | Where | Status |
|---|---|---|
| `MONGO_URI` | backend | ✅ Set |
| `JWT_SECRET` | backend | ✅ Set |
| `JWT_REFRESH_SECRET` | backend | ✅ Set |
| `GEMINI_API_KEY` | backend | ✅ Set |
| `CLOUDINARY_CLOUD_NAME` | backend | ✅ Set |
| `CLOUDINARY_API_KEY` | backend | ✅ Set |
| `CLOUDINARY_API_SECRET` | backend | ✅ Set |
| `RESEND_API_KEY` | backend | ✅ Set |
| `RESEND_MAILER_SENDER` | backend | ✅ Set |
| `FRONTEND_ORIGIN` | backend | ✅ Set |
| `VITE_API_URL` | client | ✅ Set |
| `VITE_REDUX_PERSIST_SECRET_KEY` | client | ✅ Set |

---

## Production Deployment Path

### Recommended Stack
```
Frontend  →  Vercel / Netlify (static)
Backend   →  Railway / Render / EC2
Database  →  MongoDB Atlas (M10+, replica set built-in)
Files     →  Cloudinary (already integrated)
Email     →  Resend (already integrated)
```

### Steps to Deploy
1. Push `client/` to Vercel — set `VITE_API_URL` to production backend URL
2. Deploy `backend/` to Railway — set all env vars from `backend/.env`
3. Replace `MONGO_URI` with MongoDB Atlas connection string
4. Update `FRONTEND_ORIGIN` to production frontend URL
5. Set `NODE_ENV=production` — disables cron job auto-init in dev mode

---

## Present vs Future

| Today | Future |
|---|---|
| Podman local container | Docker Compose for full local stack |
| Manual `make dev` | GitHub Actions CI: lint + test on every PR |
| No tests | Jest (backend) + Vitest (frontend) test suites |
| Single Node.js process | PM2 cluster mode / containerized with health checks |
| MongoDB Atlas (future) | Atlas with automated backups + point-in-time recovery |
| Manual deploys | CD pipeline: merge to main → auto-deploy |
| No monitoring | Sentry (errors) + Datadog / Grafana (metrics) |
| No rate limiting | Express rate-limiter on auth routes |
| Helmet (basic) | Full security headers audit + CSP policy |

---

## Contribution Story
Every line of application code runs on infrastructure someone built and secured. The Makefile means a new developer can go from zero to running app in under 5 minutes. The replica set means transactions are ACID-compliant. The `.env` discipline means secrets stay secret. DevOps is the reason Finora can be trusted with your financial data — and trust, in fintech, is everything.
