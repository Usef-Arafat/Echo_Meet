# Echo Meet 🎙️

AI-powered video conferencing — peer-to-peer video via PeerJS, smart summaries after every call.

![Echo Meet](https://img.shields.io/badge/Echo-Meet-E91E8C?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

## Features

- 🎥 **Peer-to-peer video** via PeerJS (free, no account needed)
- 🤖 **AI meeting summaries** after every call
- 📋 **Action item extraction** automatically
- 🔗 **Instant invite links** — share and join in one click
- 🎨 **100% Echo Meet branded** — no third-party logos

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python 3.12) |
| Database | Supabase (PostgreSQL) |
| Video | PeerJS (browser-to-browser, free) |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- A Supabase project (free tier works)

---

### 1. Clone the repo

```bash
git clone https://github.com/Usef-Arafat/Echo_Meet.git
cd Echo_Meet
```

---

### 2. Database setup

In your [Supabase SQL Editor](https://supabase.com/dashboard), run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS meetings (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_name         TEXT NOT NULL,
    daily_room_url    TEXT,
    started_at        TIMESTAMP DEFAULT NOW(),
    ended_at          TIMESTAMP,
    duration_seconds  INTEGER,
    participant_count INTEGER DEFAULT 0,
    transcript        JSONB,
    summary           TEXT,
    action_items      JSONB,
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meetings_room_name ON meetings(room_name);
CREATE INDEX IF NOT EXISTS idx_meetings_started_at ON meetings(started_at DESC);
```

---

### 3. Backend setup

```bash
cd backend

# Copy and fill in your credentials
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL

# Install dependencies
pip install -r requirements.txt --break-system-packages

# Start the server
python3 -m uvicorn main:app --reload --port 8002
```

> ✅ Verify: http://localhost:8002/health → `{"status":"ok","database":"connected"}`

---

### 4. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> ✅ Open: http://localhost:5173

---

### 5. Test a video call

1. Open http://localhost:5173
2. Click **Start Free Meeting**
3. Click **Launch Meeting** — your camera starts
4. Copy the invite link shown on screen
5. Open the link in a **second browser tab** or send to a teammate
6. Both tabs → two-way video call! 🎉

---

## Project Structure

```
echo-meet/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Meeting.jsx    # PeerJS video room
│   │   │   └── Summary.jsx    # Post-meeting summary
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── RoomModal.jsx  # Room creation modal
│   │       └── AIBadge.jsx
│   └── public/logo.svg
│
└── backend/                   # FastAPI app
    ├── main.py
    ├── requirements.txt
    ├── .env.example
    └── routes/
        ├── meetings.py        # Meeting CRUD + peer signaling
        ├── transcribe.py      # AI transcription (stub)
        └── summarize.py       # AI summarization (stub)
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
DATABASE_URL=postgresql://user:password@host:5432/postgres
ANTHROPIC_API_KEY=          # optional — for AI summaries
OPENAI_API_KEY=             # optional — for AI summaries
```

> ⚠️ Never commit your `.env` file — it's in `.gitignore`

---

## Brand Colors

| Name | Hex |
|---|---|
| Background | `#1E1A3C` |
| Pink | `#E91E8C` |
| Teal | `#2DBFB8` |
| Blue | `#2D7DD2` |
| Orange | `#F47C2B` |
| CTA Gradient | `linear-gradient(to right, #E91E8C, #F47C2B)` |

---

## Team

Built with ❤️ by the Echo Meet team.
