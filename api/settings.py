from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.tmdb_service import tmdb_service
from config import settings

router = APIRouter(prefix="/api/settings", tags=["Settings"])

class TMDBKeyUpdate(BaseModel):
    api_key: str

@router.get("/status")
def get_status():
    has_key = bool(tmdb_service.api_key and len(tmdb_service.api_key.strip()) > 5)
    masked_key = ""
    if has_key:
        masked_key = tmdb_service.api_key[:4] + "..." + tmdb_service.api_key[-4:]

    return {
        "status": "online",
        "has_tmdb_key": has_key,
        "masked_key": masked_key,
        "mode": "Live TMDB v3 API" if has_key else "Curated High-Fidelity Dataset + Local Search",
        "cinema_name": "CineVerse Modern Cinema Experience",
        "sound_system": "Dolby Atmos Cinema Synthesis"
    }

@router.post("/tmdb-key")
def update_tmdb_key(payload: TMDBKeyUpdate):
    clean_key = payload.api_key.strip()
    tmdb_service.set_api_key(clean_key)
    return {
        "success": True,
        "message": "TMDB API key updated successfully" if clean_key else "Reverted to Curated High-Fidelity Dataset",
        "has_tmdb_key": bool(clean_key)
    }
