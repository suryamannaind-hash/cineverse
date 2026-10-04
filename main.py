import uvicorn
from pathlib import Path
from fastapi import FastAPI, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from config import settings
from models.models import User, UserReview, Watchlist, Discussion, DiscussionReply
from api.movies import router as movies_router
from api.reviews import router as reviews_router
from api.watchlist import router as watchlist_router
from api.discussions import router as discussions_router
from api.auth import router as auth_router
from api.settings import router as settings_router

# Create tables
Base.metadata.create_all(bind=engine)

def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if users exist
        if db.query(User).count() == 0:
            user1 = User(
                username="surya",
                email="surya@cineverse.io",
                full_name="Surya",
                avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120",
                bio="Film enthusiast & CineVerse patron. Always in the front row for Nolan & Villeneuve.",
                favorite_genres="Sci-Fi, Thriller, Drama"
            )
            user2 = User(
                username="cineaddict",
                email="cineaddict@cineverse.io",
                full_name="CineAddict",
                avatar_url="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120",
                bio="Watched over 1,500 movies across 40 countries. Certified cinema addict.",
                favorite_genres="Action, Crime, Mystery"
            )
            user3 = User(
                username="alex_rivers",
                email="alex@cineverse.io",
                full_name="Alex Rivers",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
                bio="Screenplay analyst & 35mm film reel collector.",
                favorite_genres="Drama, Sci-Fi, Indie"
            )
            db.add_all([user1, user2, user3])
            db.commit()

            # Seed user reviews matching the reference design
            rev1 = UserReview(
                user_id=user2.id,
                movie_id=414906, # The Batman
                movie_title="The Batman",
                poster_path="https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
                rating=4.5,
                review_text="A dark, gripping and visually stunning take on Batman. The atmosphere is unreal!",
                has_spoilers=False,
                likes_count=1200,
                helpful_count=850
            )
            rev2 = UserReview(
                user_id=user1.id,
                movie_id=872585, # Oppenheimer
                movie_title="Oppenheimer",
                poster_path="https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                rating=4.7,
                review_text="Visually stunning and emotionally powerful. Nolan never misses. The Trinity test sequence leaves you breathless.",
                has_spoilers=False,
                likes_count=1840,
                helpful_count=1420
            )
            rev3 = UserReview(
                user_id=user3.id,
                movie_id=157336, # Interstellar
                movie_title="Interstellar",
                poster_path="https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                rating=4.8,
                review_text="Best sci-fi movie I've watched in years. Absolute masterpiece. Zimmer's organ score reverberates through your soul.",
                has_spoilers=False,
                likes_count=2100,
                helpful_count=1950
            )
            rev4 = UserReview(
                user_id=user1.id,
                movie_id=693134, # Dune: Part Two
                movie_title="Dune: Part Two",
                poster_path="https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                rating=4.6,
                review_text="A slow burn, but the ending was totally worth it. The scale of the sandworms on the cinema screen is monumental.",
                has_spoilers=False,
                likes_count=940,
                helpful_count=710
            )
            rev5 = UserReview(
                user_id=user2.id,
                movie_id=27205, # Inception
                movie_title="Inception",
                poster_path="https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
                rating=4.8,
                review_text="The rotating corridor fight scene alone deserves film history immortality. S-tier mind heist.",
                has_spoilers=False,
                likes_count=1520,
                helpful_count=1200
            )
            db.add_all([rev1, rev2, rev3, rev4, rev5])
            db.commit()

            # Seed Discussions for The Lobby
            d1 = Discussion(
                user_id=user1.id,
                title="What's a movie that changed your perspective on life?",
                topic_category="Philosophy",
                content="Cinema has the rare power to reshape how we view time, mortality, and our fellow humans. For me, Interstellar's portrayal of parental love across lightyears fundamentally altered how I prioritize my family time.",
                replies_count=1200,
                likes_count=430,
                badge="TICKETS",
                icon_type="ticket"
            )
            d2 = Discussion(
                user_id=user3.id,
                title="Best movie soundtracks of all time?",
                topic_category="Soundtracks",
                content="Whether it's Hans Zimmer's pipe organ in Interstellar, Ennio Morricone's whistling westerns, or Ludwig Göransson's ticking violins in Oppenheimer—what score elevates the entire film to transcendence?",
                replies_count=846,
                likes_count=312,
                badge="AUDIO",
                icon_type="headphones"
            )
            d3 = Discussion(
                user_id=user2.id,
                title="Underrated gems everyone should watch",
                topic_category="Underrated",
                content="Drop your top movie that rarely gets the mainstream love it deserves. Let's build a CineVerse community discovery archive of overlooked cinematic excellence!",
                replies_count=1100,
                likes_count=528,
                badge="GEMS",
                icon_type="film"
            )
            db.add_all([d1, d2, d3])
            db.commit()

            # Seed sample replies
            r1 = DiscussionReply(
                discussion_id=d1.id,
                user_id=user2.id,
                content="12 Angry Men showed me the terrifying fragility of human justice and how one courageous dissenting voice can save a soul."
            )
            r2 = DiscussionReply(
                discussion_id=d2.id,
                user_id=user1.id,
                content="'Cornfield Chase' from Interstellar and 'Can You Hear the Music' from Oppenheimer are in regular rotation in my headphones daily."
            )
            db.add_all([r1, r2])

            # Seed Watchlist items for user1
            w1 = Watchlist(
                user_id=user1.id,
                movie_id=414906,
                movie_title="The Batman",
                poster_path="https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
                backdrop_path="https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
                vote_average=7.7,
                release_date="2022-03-04",
                genres="Crime, Mystery, Action",
                status="watched",
                rating=4.5
            )
            w2 = Watchlist(
                user_id=user1.id,
                movie_id=872585,
                movie_title="Oppenheimer",
                poster_path="https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                backdrop_path="https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
                vote_average=8.1,
                release_date="2023-07-21",
                genres="Drama, History",
                status="favorite",
                rating=5.0
            )
            w3 = Watchlist(
                user_id=user1.id,
                movie_id=693134,
                movie_title="Dune: Part Two",
                poster_path="https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                backdrop_path="https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg",
                vote_average=8.2,
                release_date="2024-03-01",
                genres="Sci-Fi, Adventure",
                status="want_to_watch"
            )
            db.add_all([w1, w2, w3])
            db.commit()
    finally:
        db.close()

seed_initial_data()

app = FastAPI(
    title="CineVerse API",
    description="Production-quality Cinema Experience & Movie Review Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movies_router)
app.include_router(reviews_router)
app.include_router(watchlist_router)
app.include_router(discussions_router)
app.include_router(auth_router)
app.include_router(settings_router)

# Mount static files
static_dir = Path(__file__).resolve().parent / "static"
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

@app.get("/favicon.ico")
async def favicon():
    return FileResponse(str(static_dir / "img" / "favicon.ico"))

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If API or static route was not found, return index.html for client-side routing
    index_file = static_dir / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return HTMLResponse("<h1>CineVerse projector starting...</h1>")

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
