# Finora — Frontend & UX Engineer

## Role
The person who takes raw JSON from an API and turns it into something a human actually wants to look at. Making financial data feel less like a tax form and more like a story worth reading.

---

## Responsibilities
- Build the React 19 + TypeScript UI
- Design and implement all pages: Auth, Dashboard, Transactions, Reports, Settings
- Integrate Redux Toolkit + redux-persist for global state (encrypted at rest)
- Connect all API calls via RTK Query / axios feature slices
- Build data visualizations: line charts, pie charts, stat cards
- Implement filtering, searching, pagination, and bulk operations on transactions
- Handle file uploads (profile photo, receipt scan)
- Manage theme (dark/light) with next-themes

---

## Pages & Features Owned

| Page | Key Features |
|---|---|
| **Auth** | Register + Login forms, Zod validation, JWT token storage |
| **Dashboard** | Summary stats (total income, expenses, balance), income/expense line chart, expense pie chart, recent transactions |
| **Transactions** | Full table with search, filter by type/category/date, pagination, bulk delete, duplicate, CSV import, receipt scan via AI |
| **Reports** | Report history list, monthly report generation with date range picker, report settings toggle |
| **Settings** | Profile photo upload, name/email update, password change |

---

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite 6
- **State**: Redux Toolkit + redux-persist (encrypted with `redux-persist-transform-encrypt`)
- **Routing**: React Router DOM v7
- **Forms**: React Hook Form + Zod resolvers
- **UI Components**: Radix UI primitives + shadcn/ui pattern
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Tables**: TanStack Table v8
- **Date**: react-day-picker + date-fns
- **CSV**: react-papaparse
- **Notifications**: Sonner (toast)
- **URL state**: nuqs (query param sync)

---

## Challenges Solved

**1. Complex table state**
Transactions table has simultaneous search, type filter, category filter, date range filter, pagination, and row selection for bulk delete — all synced to URL params via `nuqs` so filters survive page refresh.

**2. Encrypted persisted state**
Redux state (user session, tokens) is persisted to localStorage but encrypted using `redux-persist-transform-encrypt` — so even if someone opens DevTools, they see ciphertext.

**3. Receipt AI UX**
User uploads a receipt image → backend calls Gemini → returns structured transaction data → frontend pre-fills the transaction form. The UX makes it feel instant and magical.

**4. Currency input precision**
Uses `react-currency-input-field` to handle locale-aware currency formatting in forms, preventing users from entering invalid amounts.

---

## User Journey

```
Land on /auth → Register/Login
       ↓
Dashboard → See financial summary at a glance
       ↓
Transactions → Add / import / scan receipt → manage history
       ↓
Reports → View monthly history → generate custom report
       ↓
Settings → Personalize profile
```

---

## Present vs Future

| Today | Future |
|---|---|
| Recharts line + pie charts | 3D interactive financial globe |
| Manual transaction entry | Voice input → AI parses → auto-fills form |
| Date range filter | Natural language filter: "show last 3 months of food spending" |
| Static dashboard | Real-time WebSocket dashboard (live balance updates) |
| Light/dark theme | Adaptive UI that changes based on financial mood/stress score |
| Receipt image upload | Camera scan with on-device OCR (no upload needed) |

---

## Contribution Story
Numbers are cold. Spreadsheets are intimidating. Finora's frontend exists to make your financial life feel warm, clear, and in control. Every chart, every filter, every toast notification is a deliberate design decision to reduce cognitive load. Because the best financial tool is the one people actually use — and people use what feels good.
