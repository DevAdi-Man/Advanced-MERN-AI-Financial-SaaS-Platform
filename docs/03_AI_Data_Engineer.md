# Finora — AI & Data Engineer

## Role
The intelligence layer. The part of Finora that makes it feel less like a spreadsheet and more like a financial advisor who never sleeps, never judges, and always has context.

---

## Responsibilities
- Integrate and prompt-engineer Google Gemini AI
- Build the receipt scanning pipeline (image → structured transaction)
- Design the report insight generation system
- Own the MongoDB Aggregate Pipeline analytics engine
- Define prompt templates for consistent, structured AI output
- Ensure AI responses are parsed safely and never crash the app

---

## AI Features Owned

### 1. Receipt Scanner
- User uploads a receipt image (JPEG/PNG, max 2MB via Cloudinary)
- Backend sends the image to **Gemini 2.0 Flash** with a structured extraction prompt
- Gemini returns JSON: `{ title, amount, category, date, paymentMethod, description }`
- Frontend pre-fills the transaction form — zero manual typing

### 2. Report Insight Generator
- Triggered when user generates a financial report for a date range
- Aggregate pipeline computes: total income, total expenses, balance, savings rate, top 5 expense categories
- Data is passed to Gemini with a prompt requesting actionable financial insights
- Gemini returns a JSON array of insight objects rendered in the report UI
- Response is requested as `application/json` MIME type — no markdown stripping needed (mostly)

---

## Analytics Engine (MongoDB Aggregates)

All analytics are pure MongoDB — no external analytics service needed.

| Service | Pipeline Logic |
|---|---|
| `summaryAnalyticsService` | `$match → $group` totals + savings rate + expense ratio. Runs a second pipeline for the previous period to compute % change. |
| `chartAnalyticsService` | Groups transactions by `YYYY-MM-DD`, outputs daily income/expense series for the line chart |
| `expensePieChartBreakdownService` | Groups expenses by category, takes top 3 + merges rest into "Others" via `$facet` |
| `generateReportService` | `$facet` for summary + top 5 categories in one query, then feeds Gemini |

---

## Tech Stack
- **AI Model**: Google Gemini 2.0 Flash (`@google/genai`)
- **Prompt format**: Structured JSON output via `responseMimeType: "application/json"`
- **Analytics**: MongoDB Aggregate Pipeline (Mongoose)
- **Data transforms**: `convertToCents` / `convertToDollarUnit` for precision
- **Date math**: `date-fns` (differenceInDays, subDays, subYears)

---

## Challenges Solved

**1. Gemini returns markdown-wrapped JSON**
Even with `responseMimeType: "application/json"`, Gemini occasionally wraps output in ` ```json ``` ` fences. Solved with a regex strip before `JSON.parse`, plus a try/catch that returns `[]` on failure — so a bad AI response never crashes the report.

**2. Percentage change with zero-division**
Previous period may have zero income/expenses. `calaulatePercentageChange(0, X)` returns `100` (full growth), `calaulatePercentageChange(0, 0)` returns `0`. Result is capped at `[-100, 100]` to prevent absurd percentages.

**3. Pie chart "Others" bucket**
Using `$facet` to split the pipeline: top 3 categories go one way, the rest are `$group`-ed into a single "others" entry, then `$concatArrays` merges them back. Single query, no post-processing in Node.

**4. Amount stored as cents**
All AI-returned amounts and all aggregate results are in cents internally. `convertToDollarUnit` is applied at the service boundary before returning to the client — the AI layer never sees raw cents.

---

## Present vs Future

| Today | Future |
|---|---|
| Gemini 2.0 Flash for receipt scan | On-device OCR (no upload, instant) |
| Rule-based prompt for insights | Fine-tuned financial LLM on user's own history |
| Static report insights | Conversational AI: "Why did I overspend in March?" |
| Aggregate pipeline analytics | Real-time streaming analytics (Change Streams → WebSocket) |
| Category assigned by user | Auto-categorization via Gemini on every transaction save |
| No anomaly detection | Fraud/anomaly alerts: "This expense looks unusual" |
| Monthly report | Weekly micro-insights pushed to email/notification |

---

## Contribution Story
Most finance apps show you what happened. Finora's AI layer tells you what it *means*. A receipt becomes a transaction in seconds. A month of spending becomes a narrative with actionable advice. The aggregate pipelines are the data foundation — precise, fast, and built to scale to millions of transactions without breaking a sweat. The AI sits on top and turns that foundation into wisdom.
