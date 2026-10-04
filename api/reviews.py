from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.models import UserReview, User, ReviewVote
from schemas.schemas import ReviewCreate, ReviewUpdate, ReviewVoteCreate

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.get("/movie/{movie_id}")
def get_movie_reviews(
    movie_id: int,
    filter_type: str = Query("all"), # all, positive, critical, recent
    current_user_id: Optional[int] = Query(1),
    db: Session = Depends(get_db)
):
    query = db.query(UserReview).filter(UserReview.movie_id == movie_id)

    if filter_type == "positive":
        query = query.filter(UserReview.rating >= 4.0)
    elif filter_type == "critical":
        query = query.filter(UserReview.rating <= 3.0)

    query = query.order_by(UserReview.created_at.desc())
    reviews = query.all()

    # User votes lookup
    user_votes = {}
    if current_user_id:
        votes = db.query(ReviewVote).filter(ReviewVote.user_id == current_user_id).all()
        for v in votes:
            user_votes.setdefault(v.review_id, set()).add(v.vote_type)

    result = []
    for r in reviews:
        has_liked = "like" in user_votes.get(r.id, set())
        has_marked = "helpful" in user_votes.get(r.id, set())
        result.append({
            "id": r.id,
            "user_id": r.user_id,
            "user_name": r.user.full_name if r.user else "CineVerse Critic",
            "user_username": r.user.username if r.user else "critic",
            "user_avatar": r.user.avatar_url if r.user else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
            "movie_id": r.movie_id,
            "movie_title": r.movie_title,
            "poster_path": r.poster_path,
            "rating": r.rating,
            "review_text": r.review_text,
            "has_spoilers": r.has_spoilers,
            "likes_count": r.likes_count,
            "helpful_count": r.helpful_count,
            "created_at": r.created_at.isoformat(),
            "updated_at": r.updated_at.isoformat(),
            "user_has_liked": has_liked,
            "user_has_marked_helpful": has_marked
        })
    return result

@router.post("")
def create_review(
    review: ReviewCreate,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_review = UserReview(
        user_id=user.id,
        movie_id=review.movie_id,
        movie_title=review.movie_title,
        poster_path=review.poster_path,
        rating=review.rating,
        review_text=review.review_text,
        has_spoilers=review.has_spoilers
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return {
        "id": new_review.id,
        "user_id": user.id,
        "user_name": user.full_name,
        "user_username": user.username,
        "user_avatar": user.avatar_url,
        "movie_id": new_review.movie_id,
        "movie_title": new_review.movie_title,
        "poster_path": new_review.poster_path,
        "rating": new_review.rating,
        "review_text": new_review.review_text,
        "has_spoilers": new_review.has_spoilers,
        "likes_count": 0,
        "helpful_count": 0,
        "created_at": new_review.created_at.isoformat(),
        "updated_at": new_review.updated_at.isoformat()
    }

@router.put("/{review_id}")
def update_review(
    review_id: int,
    payload: ReviewUpdate,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    rev = db.query(UserReview).filter(UserReview.id == review_id, UserReview.user_id == user_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found or unauthorized")

    if payload.rating is not None:
        rev.rating = payload.rating
    if payload.review_text is not None:
        rev.review_text = payload.review_text
    if payload.has_spoilers is not None:
        rev.has_spoilers = payload.has_spoilers

    db.commit()
    db.refresh(rev)
    return {"message": "Review updated successfully", "id": rev.id}

@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    rev = db.query(UserReview).filter(UserReview.id == review_id, UserReview.user_id == user_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found or unauthorized")

    db.delete(rev)
    db.commit()
    return {"message": "Review deleted successfully"}

@router.post("/{review_id}/vote")
def vote_review(
    review_id: int,
    vote_data: ReviewVoteCreate,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    rev = db.query(UserReview).filter(UserReview.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")

    existing = db.query(ReviewVote).filter(
        ReviewVote.review_id == review_id,
        ReviewVote.user_id == user_id,
        ReviewVote.vote_type == vote_data.vote_type
    ).first()

    if existing:
        # Toggle off
        db.delete(existing)
        if vote_data.vote_type == "like" and rev.likes_count > 0:
            rev.likes_count -= 1
        elif vote_data.vote_type == "helpful" and rev.helpful_count > 0:
            rev.helpful_count -= 1
        db.commit()
        return {"action": "removed", "likes_count": rev.likes_count, "helpful_count": rev.helpful_count}
    else:
        # Toggle on
        new_vote = ReviewVote(user_id=user_id, review_id=review_id, vote_type=vote_data.vote_type)
        db.add(new_vote)
        if vote_data.vote_type == "like":
            rev.likes_count += 1
        elif vote_data.vote_type == "helpful":
            rev.helpful_count += 1
        db.commit()
        return {"action": "added", "likes_count": rev.likes_count, "helpful_count": rev.helpful_count}
