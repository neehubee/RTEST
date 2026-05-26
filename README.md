# Expense Tracker

A personal expense tracker built as a full-stack web app. Add, view, edit, and delete expenses with filtering and monthly summaries.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev server, component-based UI, familiar ecosystem |
| Backend | Node.js + Express | Lightweight, quick to set up, good fit for a REST API |
| Database | PostgreSQL | Reliable relational DB, good date/aggregation support for summaries |
| DB Access | `pg` (raw SQL) | No ORM overhead, full control over queries |
| HTTP Client | Axios | Clean API for frontend requests |

---

## Project Structure

```
expense-tracker/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ExpenseForm.jsx      # Add / edit form
│       │   ├── ExpenseTable.jsx     # Expense list with edit/delete
│       │   ├── Filters.jsx          # Filter inputs
│       │   └── Summary.jsx          # Monthly summary
│       ├── App.jsx                  # Main page, state management
│       └── index.css                # All styles
└── server/                  # Node.js + Express backend
    ├── controllers/
    │   └── expenseController.js     # DB logic + response handling
    ├── middleware/
    │   └── validateExpense.js       # Input validation
    ├── routes/
    │   └── expenseRoutes.js         # Route definitions
    ├── db.js                        # PostgreSQL connection pool
    └── server.js                    # App entry point
```

---

## Setup

### Prerequisites

- Node.js
- PostgreSQL (running locally)

### 1. Clone the repo

```bash
git clone <repo-url>
cd expense-tracker
```

### 2. Database setup

Open psql or pgAdmin and run:

```sql
CREATE DATABASE expense_tracker;

\c expense_tracker

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  category VARCHAR(100),
  date DATE NOT NULL,
  note TEXT
);
```

### 3. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (use `.env.example` as reference):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

Start the backend:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 4. Frontend setup

```bash
cd client
npm install
npm run dev
```

App runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/expenses` | List all expenses (supports filters) |
| POST | `/expenses` | Add new expense |
| PUT | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |
| GET | `/expenses/summary` | Monthly total + category breakdown |

### Filter query params for GET /expenses

| Param | Type | Example |
|---|---|---|
| `category` | string | `?category=Food` |
| `from` | date | `?from=2026-05-01` |
| `to` | date | `?to=2026-05-31` |
| `title` | string | `?title=coffee` |

---

## Features Completed

- Add expense with title, amount, category, date (defaults to today), optional note
- View all expenses sorted by date descending
- Edit any expense — clicking Edit pre-fills the same form
- Delete any expense with confirmation prompt
- Monthly summary: total spent + breakdown by category
- Filter by category, date range, and partial title match
- Input validation on both frontend and backend
- Empty state handling when no expenses found
- MVC architecture on the backend with a dedicated validation middleware layer

---

## What Was Skipped

- **Authentication** — not required per spec
- **Multi-currency** — not required per spec
- **Deployment** — runs locally only
- **Test suite** — not required per spec
- **Pagination** — not needed at this scale
- **Charts** — plain text summary is sufficient and faster to build

---

## Known Rough Edges

- No debounce on the title filter input — fires a request on every keystroke
- Date filter does not warn the user in the UI if `from` is after `to` (backend returns an error, but the frontend just shows an empty list)
- Category is a free-form dropdown with fixed options — no way to add custom categories without a code change
- No loading indicators on fetch — on slow connections the table may appear empty briefly before data loads
