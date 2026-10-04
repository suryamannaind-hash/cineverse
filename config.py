import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "127.0.0.1")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cineverse.db")
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE: str = "https://image.tmdb.org/t/p"

settings = Settings()
