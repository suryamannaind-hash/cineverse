from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    favorite_genres: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Review Schemas
class ReviewCreate(BaseModel):
    movie_id: int
    movie_title: str
    poster_path: Optional[str] = None
    rating: float = Field(..., ge=0.5, le=5.0)
    review_text: str = Field(..., min_length=10)
    has_spoilers: bool = False

class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(None, ge=0.5, le=5.0)
    review_text: Optional[str] = Field(None, min_length=10)
    has_spoilers: Optional[bool] = None

class ReviewVoteCreate(BaseModel):
    vote_type: str # 'like' or 'helpful'

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_username: str
    user_avatar: str
    movie_id: int
    movie_title: str
    poster_path: Optional[str] = None
    rating: float
    review_text: str
    has_spoilers: bool
    likes_count: int
    helpful_count: int
    created_at: datetime
    updated_at: datetime
    user_has_liked: Optional[bool] = False
    user_has_marked_helpful: Optional[bool] = False

    class Config:
        from_attributes = True

# Watchlist Schemas
class WatchlistCreate(BaseModel):
    movie_id: int
    movie_title: str
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    vote_average: Optional[float] = 0.0
    release_date: Optional[str] = None
    genres: Optional[str] = ""
    status: Optional[str] = "want_to_watch" # want_to_watch, watched, favorite
    rating: Optional[float] = None

class WatchlistUpdate(BaseModel):
    status: Optional[str] = None
    rating: Optional[float] = None

class WatchlistResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int
    movie_title: str
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    vote_average: float
    release_date: Optional[str] = None
    genres: Optional[str] = ""
    status: str
    rating: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Discussion Schemas
class DiscussionReplyCreate(BaseModel):
    content: str = Field(..., min_length=2)

class DiscussionReplyResponse(BaseModel):
    id: int
    discussion_id: int
    user_id: int
    user_name: str
    user_avatar: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class DiscussionCreate(BaseModel):
    title: str = Field(..., min_length=5)
    topic_category: str = "General"
    content: str = Field(..., min_length=10)
    badge: Optional[str] = "TICKETS"
    icon_type: Optional[str] = "film"

class DiscussionResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_avatar: str
    title: str
    topic_category: str
    content: str
    replies_count: int
    likes_count: int
    badge: str
    icon_type: str
    created_at: datetime
    replies: Optional[List[DiscussionReplyResponse]] = []

    class Config:
        from_attributes = True

# Rating Breakdown Schema
class RatingBreakdown(BaseModel):
    cineverse_average: float
    cineverse_total_reviews: int
    tmdb_average: float
    tmdb_total_votes: int
    licensed_sources_average: float
    distribution: Dict[str, int] # "5": count, "4": count, etc.
