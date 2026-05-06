from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel
from models import (
    AIVerdict,
    BackgroundCheckStatus,
    CertificationStatus,
    IncidentType,
    LeagueStatus,
    MatchStatus,
    ReviewStatus,
    TeamStatus,
    UserRole,
    VideoStatus,
)


class UserBase(BaseModel):
    email: str
    full_name: str
    role: UserRole
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class LeagueBase(BaseModel):
    name: str
    season_start: date
    season_end: date
    description: Optional[str] = None
    format_type: Optional[str] = None
    num_teams: int
    half_length: int = 45
    extra_time: int = 15
    ai_review_enabled: bool = True
    var_protocol: bool = True
    status: LeagueStatus


class LeagueCreate(LeagueBase):
    pass


class LeagueUpdate(BaseModel):
    name: Optional[str] = None
    season_start: Optional[date] = None
    season_end: Optional[date] = None
    description: Optional[str] = None
    format_type: Optional[str] = None
    num_teams: Optional[int] = None
    half_length: Optional[int] = None
    extra_time: Optional[int] = None
    ai_review_enabled: Optional[bool] = None
    var_protocol: Optional[bool] = None
    status: Optional[LeagueStatus] = None


class LeagueOut(LeagueBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class TeamBase(BaseModel):
    name: str
    league_id: int
    founded_year: Optional[int] = None
    manager: Optional[str] = None
    stadium: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None
    status: TeamStatus


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    league_id: Optional[int] = None
    founded_year: Optional[int] = None
    manager: Optional[str] = None
    stadium: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[TeamStatus] = None


class TeamOut(TeamBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class MatchBase(BaseModel):
    league_id: int
    home_team_id: int
    away_team_id: int
    kickoff_time: datetime
    venue: Optional[str] = None
    status: MatchStatus
    video_status: VideoStatus
    home_score: int = 0
    away_score: int = 0
    official_id: Optional[int] = None


class MatchCreate(MatchBase):
    pass


class MatchUpdate(BaseModel):
    league_id: Optional[int] = None
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None
    kickoff_time: Optional[datetime] = None
    venue: Optional[str] = None
    status: Optional[MatchStatus] = None
    video_status: Optional[VideoStatus] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    official_id: Optional[int] = None


class MatchOut(MatchBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class IncidentBase(BaseModel):
    match_id: int
    incident_type: IncidentType
    match_time: str
    team_player: Optional[str] = None
    description: Optional[str] = None
    ai_verdict: AIVerdict
    confidence_score: Optional[float] = None
    review_status: ReviewStatus
    referee_note: Optional[str] = None


class IncidentAnalyze(BaseModel):
    match_id: int
    incident_type: IncidentType
    match_time: str
    team_player: Optional[str] = None
    description: Optional[str] = None


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    match_id: Optional[int] = None
    incident_type: Optional[IncidentType] = None
    match_time: Optional[str] = None
    team_player: Optional[str] = None
    description: Optional[str] = None
    ai_verdict: Optional[AIVerdict] = None
    confidence_score: Optional[float] = None
    review_status: Optional[ReviewStatus] = None
    referee_note: Optional[str] = None


class IncidentOut(IncidentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class OfficialBase(BaseModel):
    user_id: int
    role_level: Optional[str] = None
    years_experience: Optional[int] = None
    certification_status: CertificationStatus
    background_check: BackgroundCheckStatus
    availability: bool = True
    leagues: Optional[List[str]] = None


class OfficialCreate(OfficialBase):
    pass


class OfficialUpdate(BaseModel):
    user_id: Optional[int] = None
    role_level: Optional[str] = None
    years_experience: Optional[int] = None
    certification_status: Optional[CertificationStatus] = None
    background_check: Optional[BackgroundCheckStatus] = None
    availability: Optional[bool] = None
    leagues: Optional[List[str]] = None


class OfficialOut(OfficialBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str
