from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/leagues", tags=["leagues"])


@router.get("", response_model=list[schemas.LeagueOut])
def list_leagues(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return db.query(models.League).all()


@router.post("", response_model=schemas.LeagueOut)
def create_league(
    league_in: schemas.LeagueCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    league = models.League(**league_in.dict())
    db.add(league)
    db.commit()
    db.refresh(league)
    return league


@router.get("/{league_id}", response_model=schemas.LeagueOut)
def get_league(league_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    league = db.query(models.League).filter(models.League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    return league


@router.put("/{league_id}", response_model=schemas.LeagueOut)
def update_league(
    league_id: int, league_in: schemas.LeagueUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    league = db.query(models.League).filter(models.League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    update_data = league_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(league, key, value)
    db.commit()
    db.refresh(league)
    return league


@router.delete("/{league_id}")
def delete_league(league_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    league = db.query(models.League).filter(models.League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    db.delete(league)
    db.commit()
    return {"status": "deleted"}
