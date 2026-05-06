from datetime import date, datetime, timedelta
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, SessionLocal, engine
import models
import schemas
from auth import router as auth_router, get_password_hash
from routers import incidents, leagues, matches, officials, teams, users

app = FastAPI(title="Atletico Intelligence API")

os.makedirs("uploads", exist_ok=True)
app.mount("/videos", StaticFiles(directory="uploads"), name="videos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users.router)
app.include_router(leagues.router)
app.include_router(teams.router)
app.include_router(matches.router)
app.include_router(incidents.router)
app.include_router(officials.router)


def seed_data(db: Session):
    if db.query(models.User).first():
        return

    admin_user = models.User(
        email="admin@atletico.com",
        full_name="League Admin",
        hashed_password=get_password_hash("Admin123!"),
        role=models.UserRole.league_admin,
        is_active=True,
    )
    official_user = models.User(
        email="official@league.com",
        full_name="Match Official",
        hashed_password=get_password_hash("Admin123!"),
        role=models.UserRole.match_official,
        is_active=True,
    )
    viewer_user = models.User(
        email="viewer@northend.com",
        full_name="Team Viewer",
        hashed_password=get_password_hash("Admin123!"),
        role=models.UserRole.team_viewer,
        is_active=True,
    )
    db.add_all([admin_user, official_user, viewer_user])
    db.commit()

    leagues = [
        models.League(
            name="Premier League",
            season_start=date(2026, 8, 1),
            season_end=date(2027, 5, 31),
            description="Top flight competition",
            format_type="Round robin",
            num_teams=4,
            status=models.LeagueStatus.active,
        ),
        models.League(
            name="Championship",
            season_start=date(2026, 8, 8),
            season_end=date(2027, 5, 20),
            description="Second tier competition",
            format_type="Round robin",
            num_teams=4,
            status=models.LeagueStatus.active,
        ),
        models.League(
            name="League One",
            season_start=date(2026, 8, 15),
            season_end=date(2027, 5, 15),
            description="Third tier competition",
            format_type="Round robin",
            num_teams=4,
            status=models.LeagueStatus.active,
        ),
    ]
    db.add_all(leagues)
    db.commit()

    team_names = {
        "Premier League": ["North End", "City United", "Riverdale", "Athletico Bay"],
        "Championship": ["Westbridge", "Old Town", "Harbor FC", "Starlight"],
        "League One": ["Forge FC", "Kingsport", "Highland", "Metro Rovers"],
    }

    teams = []
    for league in leagues:
        for name in team_names[league.name]:
            teams.append(
                models.Team(
                    name=name,
                    league_id=league.id,
                    founded_year=1901,
                    manager="Staff",
                    stadium=f"{name} Stadium",
                    contact_email=f"contact@{name.replace(' ', '').lower()}.com",
                    notes=None,
                    status=models.TeamStatus.active,
                )
            )
    db.add_all(teams)
    db.commit()

    official = models.Official(
        user_id=official_user.id,
        role_level="Senior",
        years_experience=8,
        certification_status=models.CertificationStatus.verified,
        background_check=models.BackgroundCheckStatus.cleared,
        availability=True,
        leagues=[league.name for league in leagues],
    )
    db.add(official)
    db.commit()
    db.refresh(official)

    premier_teams = [team for team in teams if team.league_id == leagues[0].id]
    now = datetime.utcnow()

    matches_seed = [
        models.Match(
            league_id=leagues[0].id,
            home_team_id=premier_teams[0].id,
            away_team_id=premier_teams[1].id,
            kickoff_time=now - timedelta(minutes=20),
            venue="North End Stadium",
            status=models.MatchStatus.live,
            video_status=models.VideoStatus.live_stream,
            home_score=1,
            away_score=0,
            official_id=official.id,
        ),
        models.Match(
            league_id=leagues[0].id,
            home_team_id=premier_teams[2].id,
            away_team_id=premier_teams[3].id,
            kickoff_time=now - timedelta(days=1),
            venue="Riverdale Park",
            status=models.MatchStatus.completed,
            video_status=models.VideoStatus.upload,
            home_score=2,
            away_score=2,
            official_id=official.id,
        ),
        models.Match(
            league_id=leagues[1].id,
            home_team_id=teams[4].id,
            away_team_id=teams[5].id,
            kickoff_time=now - timedelta(days=2),
            venue="Westbridge Arena",
            status=models.MatchStatus.completed,
            video_status=models.VideoStatus.upload,
            home_score=0,
            away_score=1,
            official_id=official.id,
        ),
        models.Match(
            league_id=leagues[2].id,
            home_team_id=teams[8].id,
            away_team_id=teams[9].id,
            kickoff_time=now + timedelta(days=1),
            venue="Forge Ground",
            status=models.MatchStatus.scheduled,
            video_status=models.VideoStatus.not_started,
            home_score=0,
            away_score=0,
            official_id=official.id,
        ),
    ]
    db.add_all(matches_seed)
    db.commit()
    db.refresh(matches_seed[1])
    db.refresh(matches_seed[2])

    incidents_seed = [
        models.Incident(
            match_id=matches_seed[1].id,
            incident_type=models.IncidentType.offside,
            match_time="45+1",
            team_player="Riverdale #9",
            description="Tight offside call on counter attack",
            ai_verdict=models.AIVerdict.offside,
            confidence_score=0.91,
            review_status=models.ReviewStatus.confirmed,
            referee_note="VAR confirmed offside",
        ),
        models.Incident(
            match_id=matches_seed[1].id,
            incident_type=models.IncidentType.goal_line,
            match_time="67",
            team_player="Athletico Bay #11",
            description="Goal line technology triggered",
            ai_verdict=models.AIVerdict.goal,
            confidence_score=0.96,
            review_status=models.ReviewStatus.confirmed,
            referee_note="Goal awarded",
        ),
        models.Incident(
            match_id=matches_seed[1].id,
            incident_type=models.IncidentType.offside,
            match_time="72",
            team_player="Riverdale #7",
            description="Delayed flag for offside in buildup",
            ai_verdict=models.AIVerdict.review,
            confidence_score=0.52,
            review_status=models.ReviewStatus.pending,
            referee_note=None,
        ),
        models.Incident(
            match_id=matches_seed[1].id,
            incident_type=models.IncidentType.goal_line,
            match_time="88",
            team_player="Athletico Bay #4",
            description="Scramble near the goal line",
            ai_verdict=models.AIVerdict.no_goal,
            confidence_score=0.71,
            review_status=models.ReviewStatus.flagged,
            referee_note="Awaiting review",
        ),
        models.Incident(
            match_id=matches_seed[2].id,
            incident_type=models.IncidentType.offside,
            match_time="12",
            team_player="Harbor FC #10",
            description="Early offside on free kick",
            ai_verdict=models.AIVerdict.onside,
            confidence_score=0.66,
            review_status=models.ReviewStatus.flagged,
            referee_note="Assistant flagged late",
        ),
        models.Incident(
            match_id=matches_seed[2].id,
            incident_type=models.IncidentType.goal_line,
            match_time="34",
            team_player="Westbridge #5",
            description="Shot cleared off the line",
            ai_verdict=models.AIVerdict.no_goal,
            confidence_score=0.88,
            review_status=models.ReviewStatus.confirmed,
            referee_note="No goal",
        ),
        models.Incident(
            match_id=matches_seed[2].id,
            incident_type=models.IncidentType.offside,
            match_time="59",
            team_player="Harbor FC #21",
            description="Tight offside on through ball",
            ai_verdict=models.AIVerdict.offside,
            confidence_score=0.93,
            review_status=models.ReviewStatus.confirmed,
            referee_note="VAR confirmed",
        ),
        models.Incident(
            match_id=matches_seed[2].id,
            incident_type=models.IncidentType.goal_line,
            match_time="81",
            team_player="Westbridge #9",
            description="Header near line",
            ai_verdict=models.AIVerdict.review,
            confidence_score=0.48,
            review_status=models.ReviewStatus.pending,
            referee_note=None,
        ),
    ]
    db.add_all(incidents_seed)
    db.commit()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
