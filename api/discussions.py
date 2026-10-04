from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.models import Discussion, DiscussionReply, User
from schemas.schemas import DiscussionCreate, DiscussionReplyCreate

router = APIRouter(prefix="/api/discussions", tags=["Discussions"])

@router.get("")
def get_discussions(
    category: Optional[str] = Query(None), # General, Debates, Soundtracks, Underrated
    db: Session = Depends(get_db)
):
    query = db.query(Discussion)
    if category and category != "All":
        query = query.filter(Discussion.topic_category == category)
    discussions = query.order_by(Discussion.created_at.desc()).all()

    return [
        {
            "id": d.id,
            "user_id": d.user_id,
            "user_name": d.user.full_name if d.user else "Cinephile",
            "user_avatar": d.user.avatar_url if d.user else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
            "title": d.title,
            "topic_category": d.topic_category,
            "content": d.content,
            "replies_count": d.replies_count,
            "likes_count": d.likes_count,
            "badge": d.badge,
            "icon_type": d.icon_type,
            "created_at": d.created_at.isoformat()
        }
        for d in discussions
    ]

@router.get("/{discussion_id}")
def get_discussion_thread(
    discussion_id: int,
    db: Session = Depends(get_db)
):
    d = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Discussion topic not found in The Lobby")

    replies = db.query(DiscussionReply).filter(DiscussionReply.discussion_id == discussion_id).order_by(DiscussionReply.created_at.asc()).all()

    return {
        "id": d.id,
        "user_id": d.user_id,
        "user_name": d.user.full_name if d.user else "Cinephile",
        "user_avatar": d.user.avatar_url if d.user else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        "title": d.title,
        "topic_category": d.topic_category,
        "content": d.content,
        "replies_count": d.replies_count,
        "likes_count": d.likes_count,
        "badge": d.badge,
        "icon_type": d.icon_type,
        "created_at": d.created_at.isoformat(),
        "replies": [
            {
                "id": r.id,
                "user_id": r.user_id,
                "user_name": r.user.full_name if r.user else "Cinema Patron",
                "user_avatar": r.user.avatar_url if r.user else "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
                "content": r.content,
                "created_at": r.created_at.isoformat()
            }
            for r in replies
        ]
    }

@router.post("")
def create_discussion(
    payload: DiscussionCreate,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_d = Discussion(
        user_id=user.id,
        title=payload.title,
        topic_category=payload.topic_category,
        content=payload.content,
        badge=payload.badge or "TICKETS",
        icon_type=payload.icon_type or "film",
        replies_count=0,
        likes_count=1
    )
    db.add(new_d)
    db.commit()
    db.refresh(new_d)
    return {"message": "Discussion topic opened in The Lobby", "id": new_d.id}

@router.post("/{discussion_id}/replies")
def reply_to_discussion(
    discussion_id: int,
    payload: DiscussionReplyCreate,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    d = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Discussion not found")

    user = db.query(User).filter(User.id == user_id).first()
    reply = DiscussionReply(
        discussion_id=discussion_id,
        user_id=user_id,
        content=payload.content
    )
    d.replies_count += 1
    db.add(reply)
    db.commit()
    db.refresh(reply)

    return {
        "id": reply.id,
        "discussion_id": discussion_id,
        "user_id": user.id if user else 1,
        "user_name": user.full_name if user else "Patron",
        "user_avatar": user.avatar_url if user else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        "content": reply.content,
        "created_at": reply.created_at.isoformat()
    }

@router.post("/{discussion_id}/like")
def like_discussion(
    discussion_id: int,
    db: Session = Depends(get_db)
):
    d = db.query(Discussion).filter(Discussion.id == discussion_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Discussion not found")
    d.likes_count += 1
    db.commit()
    return {"likes_count": d.likes_count}
