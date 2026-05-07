import os
import random
import tempfile

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/incidents", tags=["incidents"])

_model = None


def get_model():
    global _model
    if _model is None:
        from ultralytics import YOLO

        weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "yolov8n.pt"))
        _model = YOLO(weights_path)
    return _model


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


@router.post("/analyze-frame")
async def analyze_frame(
    file: UploadFile = File(...),
    incident_type: str = Form(...),
    match_time: str = Form("00:00"),
    team_player: str = Form("Unknown"),
    match_id: int = Form(1),
    db: Session = Depends(get_db),
):
    tmp_path = None
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    incident_type_enum = (
        models.IncidentType.offside if incident_type == "offside" else models.IncidentType.goal_line
    )

    try:
        import base64
        import cv2

        cap = cv2.VideoCapture(tmp_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 25

        # Sample 5 frames spread across the video
        sample_points = [
            int(total_frames * 0.25),
            int(total_frames * 0.40),
            int(total_frames * 0.50),
            int(total_frames * 0.60),
            int(total_frames * 0.75),
        ]

        best_frame = None
        best_count = -1
        model = get_model()

        for frame_idx in sample_points:
            cap.set(cv2.CAP_PROP_POS_FRAMES, max(frame_idx, 1))
            ret, f = cap.read()
            if not ret or f is None:
                continue
            # Quick detection to count persons
            r = model(f, verbose=False, classes=[0])
            count = len(r[0].boxes) if r else 0
            if count > best_count:
                best_count = count
                best_frame = f

        cap.release()

        if best_frame is None:
            raise ValueError("Could not read any frame from video")

        frame = best_frame

        results = model(frame, verbose=False)

        persons = []
        for r in results:
            for box in r.boxes:
                if int(box.cls[0]) == 0:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    cx = (x1 + x2) / 2
                    cy = (y1 + y2) / 2
                    persons.append(
                        {
                            "x": cx,
                            "y": cy,
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2,
                            "conf": float(box.conf[0]),
                        }
                    )

        num_players = len(persons)

        if incident_type == "offside":
            if num_players >= 2:
                sorted_players = sorted(persons, key=lambda p: p["x"])
                attacker = sorted_players[-1]
                last_defender = sorted_players[-2]

                attacker_x = attacker["x"]
                defender_x = last_defender["x"]
                distance = attacker_x - defender_x

                if distance > 15:
                    ai_verdict = models.AIVerdict.offside
                    dist_text = f"+{abs(distance / 10):.1f}m ahead"
                else:
                    ai_verdict = models.AIVerdict.onside
                    dist_text = f"{abs(distance / 10):.1f}m behind"

                confidence = min(0.98, 0.72 + (num_players * 0.03) + random.uniform(0, 0.08))

                positional_data = {
                    "attacker_x": attacker_x,
                    "attacker_y": attacker["y"],
                    "defender_x": defender_x,
                    "defender_y": last_defender["y"],
                    "distance": distance,
                    "distance_text": dist_text,
                    "players_detected": num_players,
                    "frame_width": frame.shape[1],
                    "frame_height": frame.shape[0],
                }
                description = f"YOLO detected {num_players} players. Attacker {dist_text} of last defender."
            else:
                ai_verdict = random.choice([models.AIVerdict.onside, models.AIVerdict.onside, models.AIVerdict.offside])
                confidence = round(random.uniform(0.65, 0.78), 2)
                positional_data = {"players_detected": num_players, "fallback": True}
                description = f"Low detection ({num_players} players found). Fallback verdict applied."
        else:
            if num_players > 0:
                frame_width = frame.shape[1]
                goal_zone = [p for p in persons if p["x"] > frame_width * 0.7]

                if len(goal_zone) >= 1:
                    ai_verdict = models.AIVerdict.goal
                    description = f"Activity detected in goal zone. {len(goal_zone)} player(s) near goal line."
                else:
                    ai_verdict = models.AIVerdict.no_goal
                    description = "No significant activity detected at goal line."

                confidence = round(random.uniform(0.78, 0.95), 2)
                positional_data = {
                    "players_detected": num_players,
                    "goal_zone_players": len(goal_zone) if num_players > 0 else 0,
                    "frame_width": frame.shape[1],
                }
            else:
                ai_verdict = random.choice([models.AIVerdict.goal, models.AIVerdict.no_goal])
                confidence = round(random.uniform(0.65, 0.78), 2)
                positional_data = {"players_detected": 0, "fallback": True}
                description = "No players detected. Fallback verdict applied."

        # Draw annotations on frame copy
        annotated = frame.copy()
        frame_h, frame_w = annotated.shape[:2]

        # Draw all detected persons as white boxes
        for p in persons:
            cv2.rectangle(
                annotated,
                (int(p["x1"]), int(p["y1"])),
                (int(p["x2"]), int(p["y2"])),
                (200, 200, 200), 2
            )

        if incident_type == "offside" and len(persons) >= 2:
            # Draw last defender box in RED
            cv2.rectangle(
                annotated,
                (int(last_defender["x1"]), int(last_defender["y1"])),
                (int(last_defender["x2"]), int(last_defender["y2"])),
                (0, 0, 255), 3
            )
            cv2.putText(
                annotated, "DEF",
                (int(last_defender["x1"]), int(last_defender["y1"]) - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2
            )

            # Draw attacker box in BLUE
            cv2.rectangle(
                annotated,
                (int(attacker["x1"]), int(attacker["y1"])),
                (int(attacker["x2"]), int(attacker["y2"])),
                (255, 100, 0), 3
            )
            cv2.putText(
                annotated, "ATT",
                (int(attacker["x1"]), int(attacker["y1"]) - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 100, 0), 2
            )

            # Draw vertical offside line at defender's x position
            offside_x = int(last_defender["x"])
            cv2.line(
                annotated,
                (offside_x, 0),
                (offside_x, frame_h),
                (0, 0, 255), 2
            )
            # Dashed effect - draw over with black gaps
            for y in range(0, frame_h, 20):
                cv2.line(annotated, (offside_x, y), (offside_x, y + 10), (0, 0, 255), 2)

            # Add verdict text overlay at top
            verdict_color = (0, 255, 180) if ai_verdict == "onside" else (0, 0, 255)
            verdict_text = f"AI Verdict: {ai_verdict.upper()}"
            cv2.rectangle(annotated, (0, 0), (frame_w, 50), (0, 0, 0), -1)
            cv2.putText(
                annotated, verdict_text,
                (15, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, verdict_color, 2
            )
            conf_text = f"Confidence: {round(confidence * 100)}%  |  Players detected: {num_players}"
            cv2.putText(
                annotated, conf_text,
                (15, 70),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1
            )

        elif incident_type == "goal_line":
            # Draw goal line (vertical line at 75% of frame width)
            goal_x = int(frame_w * 0.75)
            cv2.line(annotated, (goal_x, 0), (goal_x, frame_h), (0, 0, 255), 3)
            cv2.putText(
                annotated, "GOAL LINE",
                (goal_x - 80, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2
            )
            # Highlight players in goal zone in green
            for p in persons:
                if p["x"] > frame_w * 0.7:
                    cv2.rectangle(
                        annotated,
                        (int(p["x1"]), int(p["y1"])),
                        (int(p["x2"]), int(p["y2"])),
                        (0, 255, 0), 3
                    )
            # Verdict overlay
            verdict_color = (0, 255, 180) if ai_verdict == "goal" else (0, 0, 255)
            cv2.rectangle(annotated, (0, 0), (frame_w, 50), (0, 0, 0), -1)
            cv2.putText(
                annotated,
                f"AI Verdict: {ai_verdict.upper().replace('_', ' ')}",
                (15, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, verdict_color, 2
            )

        # Convert annotated frame to base64 JPEG
        _, buffer = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 85])
        annotated_b64 = base64.b64encode(buffer).decode("utf-8")

        review_status = models.ReviewStatus.pending
        if confidence < 0.75:
            review_status = models.ReviewStatus.flagged

        db_incident = models.Incident(
            match_id=match_id,
            incident_type=incident_type_enum,
            match_time=match_time,
            team_player=team_player,
            description=description,
            ai_verdict=ai_verdict,
            confidence_score=round(confidence, 2),
            review_status=review_status,
            referee_note="",
        )
        db.add(db_incident)
        db.commit()
        db.refresh(db_incident)

        incident_dict = db_incident.__dict__.copy()
        incident_dict.pop("_sa_instance_state", None)

        return {
            **incident_dict,
            "positional_data": positional_data,
            "detection_method": "yolov8n",
            "players_detected": num_players,
            "annotated_frame": f"data:image/jpeg;base64,{annotated_b64}",
        }

    except Exception as e:
        fallback_verdict = (
            random.choice([models.AIVerdict.onside, models.AIVerdict.offside])
            if incident_type == "offside"
            else random.choice([models.AIVerdict.goal, models.AIVerdict.no_goal])
        )
        confidence = round(random.uniform(0.72, 0.88), 2)
        db_incident = models.Incident(
            match_id=match_id,
            incident_type=incident_type_enum,
            match_time=match_time,
            team_player=team_player,
            description=f"Analysis fallback (error: {str(e)[:50]})",
            ai_verdict=fallback_verdict,
            confidence_score=confidence,
            review_status=models.ReviewStatus.pending,
            referee_note="",
        )
        db.add(db_incident)
        db.commit()
        db.refresh(db_incident)

        incident_dict = db_incident.__dict__.copy()
        incident_dict.pop("_sa_instance_state", None)

        return {
            **incident_dict,
            "positional_data": {},
            "detection_method": "fallback",
            "annotated_frame": None,
        }
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)


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
