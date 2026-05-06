from datetime import datetime
import enum
from sqlalchemy import Boolean, Column, Date, DateTime, Enum, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from database import Base


class UserRole(str, enum.Enum):
    league_admin = "league_admin"
    match_official = "match_official"
    team_viewer = "team_viewer"


class LeagueStatus(str, enum.Enum):
    active = "active"
    draft = "draft"
    archived = "archived"


class TeamStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class MatchStatus(str, enum.Enum):
    scheduled = "scheduled"
    live = "live"
    completed = "completed"


class VideoStatus(str, enum.Enum):
    not_started = "not_started"
    upload = "upload"
    live_stream = "live_stream"


class IncidentType(str, enum.Enum):
    offside = "offside"
    goal_line = "goal_line"


class AIVerdict(str, enum.Enum):
    onside = "onside"
    offside = "offside"
    goal = "goal"
    no_goal = "no_goal"
    review = "review"


class ReviewStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    flagged = "flagged"


class CertificationStatus(str, enum.Enum):
    verified = "verified"
    pending = "pending"
    expired = "expired"


class BackgroundCheckStatus(str, enum.Enum):
    cleared = "cleared"
    pending = "pending"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, name="user_role"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    official_profile = relationship("Official", back_populates="user", uselist=False)


class League(Base):
    __tablename__ = "leagues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    season_start = Column(Date, nullable=False)
    season_end = Column(Date, nullable=False)
    description = Column(Text, nullable=True)
    format_type = Column(String(100), nullable=True)
    num_teams = Column(Integer, nullable=False)
    half_length = Column(Integer, default=45)
    extra_time = Column(Integer, default=15)
    ai_review_enabled = Column(Boolean, default=True)
    var_protocol = Column(Boolean, default=True)
    status = Column(Enum(LeagueStatus, name="league_status"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    teams = relationship("Team", back_populates="league")
    matches = relationship("Match", back_populates="league")


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    league_id = Column(Integer, ForeignKey("leagues.id"), nullable=False)
    founded_year = Column(Integer, nullable=True)
    manager = Column(String(255), nullable=True)
    stadium = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(Enum(TeamStatus, name="team_status"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    league = relationship("League", back_populates="teams")
    home_matches = relationship("Match", back_populates="home_team", foreign_keys="Match.home_team_id")
    away_matches = relationship("Match", back_populates="away_team", foreign_keys="Match.away_team_id")


class Official(Base):
    __tablename__ = "officials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_level = Column(String(100), nullable=True)
    years_experience = Column(Integer, nullable=True)
    certification_status = Column(Enum(CertificationStatus, name="cert_status"), nullable=False)
    background_check = Column(Enum(BackgroundCheckStatus, name="background_check"), nullable=False)
    availability = Column(Boolean, default=True)
    leagues = Column(JSON, nullable=True)

    user = relationship("User", back_populates="official_profile")
    matches = relationship("Match", back_populates="official")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"), nullable=False)
    home_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    away_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    kickoff_time = Column(DateTime, nullable=False)
    venue = Column(String(255), nullable=True)
    status = Column(Enum(MatchStatus, name="match_status"), nullable=False)
    video_status = Column(Enum(VideoStatus, name="video_status"), nullable=False)
    home_score = Column(Integer, default=0)
    away_score = Column(Integer, default=0)
    official_id = Column(Integer, ForeignKey("officials.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    league = relationship("League", back_populates="matches")
    home_team = relationship("Team", back_populates="home_matches", foreign_keys=[home_team_id])
    away_team = relationship("Team", back_populates="away_matches", foreign_keys=[away_team_id])
    official = relationship("Official", back_populates="matches")
    incidents = relationship("Incident", back_populates="match")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    incident_type = Column(Enum(IncidentType, name="incident_type"), nullable=False)
    match_time = Column(String(50), nullable=False)
    team_player = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    ai_verdict = Column(Enum(AIVerdict, name="ai_verdict"), nullable=False)
    confidence_score = Column(Float, nullable=True)
    review_status = Column(Enum(ReviewStatus, name="review_status"), nullable=False)
    referee_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    match = relationship("Match", back_populates="incidents")
