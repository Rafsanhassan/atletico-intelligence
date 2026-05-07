# Atlético Intelligence ⚽

An AI-powered soccer incident review platform that brings affordable video review technology to small and semi-professional leagues. Built as a technical assignment prototype in 2–3 days.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://atletico-intelligence.vercel.app |
| Backend API | https://your-railway-url.up.railway.app |

### Default Login Credentials

| Role | Email | Password |
|---|---|---|
| League Admin | admin@atletico.com | Admin123! |
| Match Official | official@league.com | Admin123! |
| Team Viewer | viewer@northend.com | Admin123! |

---

## What It Does

Traditional VAR systems cost hundreds of thousands of dollars and require multi-camera rigs. Most grassroots and semi-professional leagues operate with a single fixed camera and have no technological support for offside or goal-line decisions.

Atlético Intelligence closes that gap. A match official uploads a video or connects a live feed, triggers a review at the right moment, and the system returns an AI verdict with a 3D positional visual — all within seconds.

### MVP Scope (as per BRD)

- ✅ **Offside Review** — primary feature, frame analysis with last defender vs attacker positioning
- ✅ **Goal / No-Goal Review** — virtual goal-line barrier detection
- ❌ **Foul Review** — explicitly excluded from MVP scope

---

## Features

### Role-Based Access Control
Three distinct roles with JWT authentication enforced on every API endpoint server-side:

**League Admin**
- Create and manage leagues, seasons, teams, and matches
- View all incidents across all matches
- Configure AI review settings and data retention policies
- Manage match officials and their certifications

**Match Official (Video Ref)**
- Access live match console
- Upload match video or connect live stream
- Trigger offside and goal-line reviews
- Add referee notes to incidents (max 300 characters, profanity filtered)
- Finalize or draft incident recommendations

**Team Viewer**
- Read-only access to approved incident clips for their club only
- View AI verdicts and 3D positional diagrams
- Browse match history and download clips
- No access to other teams' incidents

### AI Analysis Pipeline
- Powered by **YOLOv8 nano** (Ultralytics) for real player detection
- Samples **5 frames** across the video and selects the frame with the highest player detection count
- For offside: sorts detected players by x-coordinate, identifies attacker vs last defender, compares positions
- For goal-line: detects player activity concentration in the goal zone
- Returns annotated frame image with bounding boxes, offside line, and verdict overlay drawn by OpenCV
- Confidence scoring — incidents below 75% confidence are automatically flagged for manual review rather than auto-confirmed
- Graceful fallback to simulated verdict if detection fails

### Incident Management
- Chronological incident log per match
- Each incident stores: type, match time, team/player, description, AI verdict, confidence score, review status, referee note
- Incident metadata is retained even if the clip is deleted
- Audit trail tracking all actions with timestamps

### 3D Positional Visual
- SVG top-down field diagram generated from real YOLO detection coordinates
- Shows attacker (ATT) and last defender (DEF) positions relative to the offside line
- Goal-line view shows ball position relative to the line
- Toggle between top-down and perspective views

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy |
| Database | SQLite (prototype) → PostgreSQL ready |
| Authentication | JWT (python-jose, passlib/bcrypt) |
| AI / CV | YOLOv8 nano (Ultralytics), OpenCV |
| Charts | Recharts |
| Frontend Deployment | Vercel |
| Backend Deployment | Railway |

---

## Project Structure

```
atletico-intelligence/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance with JWT interceptor
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Auth state, login/logout
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── OfficialLayout.jsx
│   │   │   │   └── TeamViewerLayout.jsx
│   │   │   └── ui/
│   │   │       ├── Spinner.jsx
│   │   │       └── Toast.jsx
│   │   └── pages/
│   │       ├── LandingPage.jsx
│   │       ├── auth/
│   │       │   ├── LoginPage.jsx
│   │       │   └── RegisterPage.jsx
│   │       ├── admin/
│   │       │   ├── Dashboard.jsx
│   │       │   ├── LeaguesList.jsx
│   │       │   ├── LeagueForm.jsx
│   │       │   ├── MatchList.jsx
│   │       │   ├── TeamsList.jsx
│   │       │   ├── TeamForm.jsx
│   │       │   ├── OfficialsList.jsx
│   │       │   └── OfficialDetail.jsx
│   │       ├── official/
│   │       │   ├── Dashboard.jsx
│   │       │   ├── MyAssignments.jsx
│   │       │   ├── LiveConsole.jsx
│   │       │   ├── IncidentsLog.jsx
│   │       │   └── IncidentDetail.jsx
│   │       └── viewer/
│   │           ├── Dashboard.jsx
│   │           ├── MatchHistory.jsx
│   │           ├── ClipsIncidents.jsx
│   │           └── IncidentDetail.jsx
│   ├── vercel.json
│   └── package.json
│
└── backend/
    ├── main.py                       # FastAPI app, CORS, startup seed
    ├── database.py                   # SQLAlchemy engine, session
    ├── models.py                     # SQLAlchemy ORM models
    ├── schemas.py                    # Pydantic request/response schemas
    ├── auth.py                       # JWT creation and verification
    ├── routers/
    │   ├── auth.py                   # Login, register, /me
    │   ├── leagues.py
    │   ├── matches.py                # Includes video upload endpoint
    │   ├── teams.py
    │   ├── incidents.py              # Includes /analyze and /analyze-frame
    │   ├── officials.py
    │   └── users.py
    ├── requirements.txt
    ├── Procfile                      # For Railway: uvicorn main:app ...
    └── vercel.json                   # Serverless config (if on Vercel)
```

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

On first run the database is created and seeded automatically with:
- 3 demo users (one per role)
- 3 leagues
- Sample teams and matches

> **Note:** YOLOv8 weights (`yolov8n.pt`, ~6MB) download automatically on the first AI analysis request via Ultralytics. This happens once and is cached locally.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create local env file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/login | Returns JWT token |
| POST | /auth/register | Create new account |
| GET | /auth/me | Current user info |

### Incidents
| Method | Endpoint | Description |
|---|---|---|
| GET | /incidents/match/{match_id} | All incidents for a match |
| GET | /incidents/{id} | Single incident detail |
| POST | /incidents/analyze | Mock AI verdict (no video required) |
| POST | /incidents/analyze-frame | Real YOLO analysis (video upload) |
| PUT | /incidents/{id} | Update referee note / review status |
| DELETE | /incidents/{id} | Delete incident |

### Other Resources
Standard CRUD endpoints for `/leagues`, `/teams`, `/matches`, `/officials`, `/users`

---

## AI System — How It Works

### Offside Detection
1. Video is received as a multipart upload
2. Five frames are sampled at 25%, 40%, 50%, 60%, and 75% of the video duration
3. YOLOv8 runs person detection (COCO class 0) on each frame
4. The frame with the highest player detection count is selected
5. Detected players are sorted by x-coordinate (left to right on the field)
6. The rightmost player is treated as the attacker; second-rightmost as the last defender
7. If attacker x > defender x by more than 15px: **Offside**; otherwise: **Onside**
8. An annotated frame is generated using OpenCV with bounding boxes, labels, and the offside line drawn on

### Goal-Line Detection
1. Same frame selection process
2. A virtual goal line is defined at 75% of the frame width
3. Players detected with x > 70% of frame width are counted as being in the goal zone
4. Presence of players in the goal zone → **Goal**; absence → **No Goal**

### Confidence Scoring
- Base confidence is calculated from the number of players detected
- Incidents below 75% confidence are automatically flagged (`review_status = "flagged"`) rather than confirmed
- Low-confidence incidents appear in orange in the incidents log

### Limitations and Honest Notes
- **Single frame only** — real offside detection requires frame-accurate tracking at the exact moment of the pass. This system picks the best available frame, which may not be the pass moment.
- **No camera calibration** — pixel x-coordinates are used directly. True offside requires homography transformation from pixel space to real-world metres.
- **Pretrained on COCO** — YOLOv8 nano is a general object detection model. It was not fine-tuned on soccer footage. Detection quality varies significantly with camera angle, lighting, and player clustering.
- **Single-camera limitation** — the BRD itself acknowledges this system works with single-camera setups which are inherently less accurate than multi-camera VAR.
- **No ball tracking** — ball detection is unreliable with a nano model. Goal detection uses player positioning as a proxy.

These are known limitations of a prototype built within a 2–3 day scope. With more time, the improvements would be: fine-tuning on soccer-specific detection data, implementing temporal tracking across frames (e.g. ByteTrack), proper camera calibration, and actual ball position detection.

---

## Deployment

### Frontend — Vercel

```bash
cd frontend
npm run build
npx vercel --prod
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL` = your Railway backend URL

`frontend/vercel.json` handles React Router client-side routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend — Railway

1. Connect GitHub repo to Railway
2. Set Root Directory to `backend`
3. Railway auto-detects the `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Set environment variables:
   - `YOLO_CONFIG_DIR` = `/tmp`
   - `ULTRALYTICS_CONFIG_DIR` = `/tmp`
   - `HOME` = `/tmp`
   - `SECRET_KEY` = any random 32-character string

> **Database note:** The prototype uses SQLite at `/tmp/atletico.db`. On Railway this persists for the duration of the server session but resets on redeploy or restart. For production, replace with PostgreSQL — the SQLAlchemy abstraction means it's a single line change in `database.py`.

> **YOLO on Railway free tier:** The free tier has limited RAM (~512MB). YOLOv8 nano requires approximately 500MB to load. If the annotated frame is not appearing in the deployed version, this is a memory constraint. The system falls back gracefully to a simulated verdict in this case. Running on any paid tier or dedicated server resolves this completely.

---

## Known Limitations Summary

| Area | Limitation | Resolution with more time/resources |
|---|---|---|
| AI accuracy | Pretrained model, not fine-tuned on soccer | Fine-tune YOLOv8 on labeled soccer dataset |
| Frame selection | Single frame, not ball-contact frame | Temporal tracking + ball detection |
| Offside math | Pixel x-coordinate comparison | Camera calibration + homography transform |
| Ball detection | Not implemented, uses player proxy | Dedicated ball detection model |
| Data persistence | SQLite resets on Railway restart | PostgreSQL with persistent volume |
| YOLO on cloud | Memory limits on free tier | Paid Railway instance or GPU server |
| Clip playback | Shows static frame, not trimmed clip | FFmpeg clip extraction from uploaded video |
| Live stream | Not implemented (POC uses uploads only) | RTMP/HLS ingestion as per BRD phase 2 |
| Team viewer approval | All confirmed incidents visible | Explicit admin approval/share workflow |

---

## Branches

| Branch | Description |
|---|---|
| `main` | Stable base version |
| `version-2` | Latest — includes YOLO annotated frame, improved frame selection, Railway fixes |

---

## Built With

- [FastAPI](https://fastapi.tiangolo.com/)
- [Ultralytics YOLOv8](https://docs.ultralytics.com/)
- [OpenCV](https://opencv.org/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Railway](https://railway.app/)
- [Vercel](https://vercel.com/)

---

## Author

**Md Rafsan Hassan**  
Built as part of a technical assignment for Atlético Intelligence.
