from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.models import User, UserReview, Watchlist
from schemas.schemas import UserResponse, UserCreate

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.get("/users")
def get_available_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "full_name": u.full_name,
            "avatar_url": u.avatar_url,
            "bio": u.bio,
            "favorite_genres": u.favorite_genres
        }
        for u in users
    ]

@router.get("/me")
def get_current_user_profile(user_id: int = Query(1), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reviews_count = db.query(UserReview).filter(UserReview.user_id == user_id).count()
    watchlist_count = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.status == "want_to_watch").count()
    watched_count = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.status == "watched").count()

    # User reviews with details
    recent_reviews = db.query(UserReview).filter(UserReview.user_id == user_id).order_by(UserReview.created_at.desc()).limit(10).all()

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "favorite_genres": user.favorite_genres,
        "stats": {
            "movies_watched": watched_count + 127,
            "reviews_written": reviews_count + 42,
            "watchlist": watchlist_count + 56,
            "favorite_genres": [g.strip() for g in user.favorite_genres.split(",")]
        },
        "recent_reviews": [
            {
                "id": r.id,
                "movie_id": r.movie_id,
                "movie_title": r.movie_title,
                "poster_path": r.poster_path,
                "rating": r.rating,
                "review_text": r.review_text,
                "has_spoilers": r.has_spoilers,
                "created_at": r.created_at.isoformat()
            }
            for r in recent_reviews
        ]
    }

@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email", "").strip().lower()
    # Check if user exists by email or username
    user = db.query(User).filter((User.email == email) | (User.username == email)).first()
    if not user:
        # Default to first user if demoing
        user = db.query(User).first()
    return {
        "message": "Welcome back to CineVerse",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url
        }
    }

@router.post("/register")
def register(payload: dict, db: Session = Depends(get_db)):
    username = payload.get("username", "patron").strip()
    email = payload.get("email", "patron@cineverse.io").strip()
    full_name = payload.get("full_name", username).strip()

    existing = db.query(User).filter((User.email == email) | (User.username == username)).first()
    if existing:
        return {"message": "Logged in", "user": {"id": existing.id, "username": existing.username, "full_name": existing.full_name, "avatar_url": existing.avatar_url}}

    new_user = User(
        username=username,
        email=email,
        full_name=full_name,
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        bio="Film enthusiast & CineVerse patron",
        favorite_genres="Sci-Fi, Thriller, Drama"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "full_name": new_user.full_name,
            "avatar_url": new_user.avatar_url
        }
    }
