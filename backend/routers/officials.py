from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/officials", tags=["officials"])


@router.get("", response_model=list[schemas.OfficialOut])
def list_officials(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return db.query(models.Official).all()


@router.post("", response_model=schemas.OfficialOut)
def create_official(
    official_in: schemas.OfficialCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
):
    official = models.Official(**official_in.dict())
    db.add(official)
    db.commit()
    db.refresh(official)
    return official


@router.get("/{official_id}", response_model=schemas.OfficialOut)
def get_official(official_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    official = db.query(models.Official).filter(models.Official.id == official_id).first()
    if not official:
        raise HTTPException(status_code=404, detail="Official not found")
    return official


@router.put("/{official_id}", response_model=schemas.OfficialOut)
def update_official(
    official_id: int,
    official_in: schemas.OfficialUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    official = db.query(models.Official).filter(models.Official.id == official_id).first()
    if not official:
        raise HTTPException(status_code=404, detail="Official not found")
    update_data = official_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(official, key, value)
    db.commit()
    db.refresh(official)
    return official
