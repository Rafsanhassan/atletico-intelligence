import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("", response_model=list[schemas.MatchOut])
def list_matches(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return db.query(models.Match).all()


@router.post("", response_model=schemas.MatchOut)
def create_match(
    match_in: schemas.MatchCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    match = models.Match(**match_in.dict())
    db.add(match)
    db.commit()
    db.refresh(match)
    return match


@router.get("/{match_id}", response_model=schemas.MatchOut)
def get_match(match_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@router.put("/{match_id}", response_model=schemas.MatchOut)
def update_match(
    match_id: int, match_in: schemas.MatchUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    update_data = match_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(match, key, value)
    db.commit()
    db.refresh(match)
    return match


@router.post("/{match_id}/upload-video")
def upload_match_video(
    match_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    if file.content_type != "video/mp4":
        raise HTTPException(status_code=400, detail="Only video/mp4 uploads are supported")

    os.makedirs("uploads", exist_ok=True)
    file_path = os.path.join("uploads", f"{match_id}.mp4")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    match.video_status = models.VideoStatus.upload
    db.commit()

    return {"video_url": f"/videos/{match_id}.mp4", "status": "uploaded"}
