from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500), default="/static/img/avatar-default.png")
    bio = Column(Text, default="Film enthusiast & CineVerse patron")
    favorite_genres = Column(String(200), default="Sci-Fi, Thriller, Drama")
    created_at = Column(DateTime, default=datetime.utcnow)

    reviews = relationship("UserReview", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    discussions = relationship("Discussion", back_populates="user", cascade="all, delete-orphan")
    replies = relationship("DiscussionReply", back_populates="user", cascade="all, delete-orphan")

class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    movie_id = Column(Integer, nullable=False, index=True)
    movie_title = Column(String(255), nullable=False)
    poster_path = Column(String(500))
    backdrop_path = Column(String(500))
    vote_average = Column(Float, default=0.0)
    release_date = Column(String(50))
    genres = Column(String(255), default="")
    status = Column(String(30), default="want_to_watch") # want_to_watch, watched, favorite
    rating = Column(Float, nullable=True) # personal rating 0.5-5.0
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlist")

class UserReview(Base):
    __tablename__ = "user_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    movie_id = Column(Integer, nullable=False, index=True)
    movie_title = Column(String(255), nullable=False)
    poster_path = Column(String(500))
    rating = Column(Float, nullable=False) # 0.5 to 5.0
    review_text = Column(Text, nullable=False)
    has_spoilers = Column(Boolean, default=False)
    likes_count = Column(Integer, default=0)
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    votes = relationship("ReviewVote", back_populates="review", cascade="all, delete-orphan")

class ReviewVote(Base):
    __tablename__ = "review_votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    review_id = Column(Integer, ForeignKey("user_reviews.id"), nullable=False)
    vote_type = Column(String(20), nullable=False) # 'like' or 'helpful'
    created_at = Column(DateTime, default=datetime.utcnow)

    review = relationship("UserReview", back_populates="votes")

class Discussion(Base):
    __tablename__ = "discussions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    topic_category = Column(String(50), default="General") # General, Debates, Soundtracks, Underrated
    content = Column(Text, nullable=False)
    replies_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    badge = Column(String(50), default="TICKETS")
    icon_type = Column(String(50), default="film")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="discussions")
    replies = relationship("DiscussionReply", back_populates="discussion", cascade="all, delete-orphan")

class DiscussionReply(Base):
    __tablename__ = "discussion_replies"

    id = Column(Integer, primary_key=True, index=True)
    discussion_id = Column(Integer, ForeignKey("discussions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    discussion = relationship("Discussion", back_populates="replies")
    user = relationship("User", back_populates="replies")
