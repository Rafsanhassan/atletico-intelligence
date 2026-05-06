# Atletico Intelligence

## Project overview
Atletico Intelligence is a soccer incident review platform that helps leagues, match officials, and clubs review offside and goal-line decisions with AI-assisted tooling. The frontend provides role-based dashboards and review workflows, while the backend exposes a FastAPI API with JWT authentication.

## Tech stack
- React + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- FastAPI + SQLAlchemy (backend)

## Setup instructions

### Backend
From the backend folder:

```
uvicorn main:app --reload --port 8000
```

### Frontend
From the frontend folder:

```
npm install
npm run dev
```

## Default login credentials
- League Admin: admin@atletico.com / Admin123!
- Match Official: official@league.com / Admin123!
- Team Viewer: viewer@northend.com / Admin123!

## Features implemented
- Role-based dashboards for admin, official, and team viewer
- League, team, and official management screens
- Live console and incident review layouts
- JWT authentication flows
- Dark themed UI with reusable components

## Known limitation
- No real video processing; video feeds are placeholders
- AI verdicts and analytics are mocked
