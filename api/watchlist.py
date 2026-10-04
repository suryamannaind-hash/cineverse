from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.models import Watchlist, User
from schemas.schemas import WatchlistCreate, WatchlistUpdate

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])

@router.get("")
def get_watchlist(
    status: Optional[str] = Query(None), # want_to_watch, watched, favorite
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    query = db.query(Watchlist).filter(Watchlist.user_id == user_id)
    if status and status != "all":
        query = query.filter(Watchlist.status == status)
    items = query.order_by(Watchlist.created_at.desc()).all()

    return [
        {
            "id": item.id,
            "user_id": item.user_id,
            "movie_id": item.movie_id,
            "movie_title": item.movie_title,
            "poster_path": item.poster_path,
            "backdrop_path": item.backdrop_path,
            "vote_average": item.vote_average,
            "release_date": item.release_date,
            "genres": item.genres,
            "status": item.status,
            "rating": item.rating,
            "created_at": item.created_at.isoformat()
        }
        for item in items
    ]

@router.get("/check/{movie_id}")
def check_watchlist(
    movie_id: int,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    item = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.movie_id == movie_id).first()
    return {"in_watchlist": item is not None, "status": item.status if item else None}

@router.post("")
def add_to_watchlist(
    item: WatchlistCreate,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    existing = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.movie_id == item.movie_id).first()
    if existing:
        existing.status = item.status or "want_to_watch"
        if item.rating is not None:
            existing.rating = item.rating
        db.commit()
        db.refresh(existing)
        return {"action": "updated", "id": existing.id, "status": existing.status}

    new_item = Watchlist(
        user_id=user_id,
        movie_id=item.movie_id,
        movie_title=item.movie_title,
        poster_path=item.poster_path,
        backdrop_path=item.backdrop_path,
        vote_average=item.vote_average or 0.0,
        release_date=item.release_date,
        genres=item.genres or "",
        status=item.status or "want_to_watch",
        rating=item.rating
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"action": "added", "id": new_item.id, "status": new_item.status}

@router.delete("/{movie_id}")
def remove_from_watchlist(
    movie_id: int,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    existing = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.movie_id == movie_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Movie not found in your watchlist")

    db.delete(existing)
    db.commit()
    return {"action": "removed", "movie_id": movie_id}
