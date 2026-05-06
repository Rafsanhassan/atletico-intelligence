from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=list[schemas.TeamOut])
def list_teams(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return db.query(models.Team).all()


@router.post("", response_model=schemas.TeamOut)
def create_team(
    team_in: schemas.TeamCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    team = models.Team(**team_in.dict())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@router.get("/{team_id}", response_model=schemas.TeamOut)
def get_team(team_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.put("/{team_id}", response_model=schemas.TeamOut)
def update_team(
    team_id: int, team_in: schemas.TeamUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    update_data = team_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(team, key, value)
    db.commit()
    db.refresh(team)
    return team


@router.delete("/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    db.delete(team)
    db.commit()
    return {"status": "deleted"}
