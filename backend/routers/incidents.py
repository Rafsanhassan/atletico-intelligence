import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.post("/analyze", response_model=schemas.IncidentOut)
def analyze_incident(
    payload: schemas.IncidentAnalyze, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    match = db.query(models.Match).filter(models.Match.id == payload.match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    if payload.incident_type == models.IncidentType.offside:
        verdict = random.choices(
            [models.AIVerdict.onside, models.AIVerdict.offside], weights=[0.6, 0.4], k=1
        )[0]
        rationale = (
            "Attacker kept behind the last defender at point of contact."
            if verdict == models.AIVerdict.onside
            else "Attacker ahead of the last defender by a narrow margin."
        )
    else:
        verdict = random.choices(
            [models.AIVerdict.goal, models.AIVerdict.no_goal], weights=[0.6, 0.4], k=1
        )[0]
        rationale = (
            "Ball fully crossed the goal line between the posts."
            if verdict == models.AIVerdict.goal
            else "Ball did not fully cross the goal line."
        )

    confidence = round(random.uniform(0.72, 0.98), 2)
    review_status = models.ReviewStatus.pending
    ai_verdict = verdict

    if confidence < 0.75:
        review_status = models.ReviewStatus.flagged
        ai_verdict = models.AIVerdict.review
        rationale = f"Low confidence ({confidence}). Manual review recommended."

    incident = models.Incident(
        match_id=payload.match_id,
        incident_type=payload.incident_type,
        match_time=payload.match_time,
        team_player=payload.team_player,
        description=payload.description,
        ai_verdict=ai_verdict,
        confidence_score=confidence,
        review_status=review_status,
        referee_note=rationale,
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


@router.get("", response_model=list[schemas.IncidentOut])
def list_incidents(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return db.query(models.Incident).all()


@router.post("", response_model=schemas.IncidentOut)
def create_incident(
    incident_in: schemas.IncidentCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    incident = models.Incident(**incident_in.dict())
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


@router.get("/{incident_id}", response_model=schemas.IncidentOut)
def get_incident(incident_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.put("/{incident_id}", response_model=schemas.IncidentOut)
def update_incident(
    incident_id: int, incident_in: schemas.IncidentUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    update_data = incident_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(incident, key, value)
    db.commit()
    db.refresh(incident)
    return incident


@router.delete("/{incident_id}")
def delete_incident(incident_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    db.delete(incident)
    db.commit()
    return {"status": "deleted"}


@router.get("/match/{match_id}", response_model=list[schemas.IncidentOut])
def list_match_incidents(match_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return db.query(models.Incident).filter(models.Incident.match_id == match_id).all()
