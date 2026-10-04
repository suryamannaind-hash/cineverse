import httpx
import logging
import os
import asyncio
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from config import settings
from services.curated_data import CURATED_MOVIES, GENRES_LIST, CURATED_PERSONS

logger = logging.getLogger("cineverse.tmdb")

class TMDBService:
    def __init__(self):
        self._api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL
        self.image_base = settings.TMDB_IMAGE_BASE

    @property
    def api_key(self) -> str:
        if self._api_key and len(self._api_key.strip()) > 5:
            return self._api_key.strip()
        load_dotenv(override=True)
        env_key = os.getenv("TMDB_API_KEY", "").strip()
        if env_key:
            return env_key
        return ""

    def set_api_key(self, key: str):
        self._api_key = key.strip()
        os.environ["TMDB_API_KEY"] = self._api_key

    def get_headers(self) -> Dict[str, str]:
        headers = {"Accept": "application/json"}
        key = self.api_key
        if len(key) > 50:
            headers["Authorization"] = f"Bearer {key}"
        return headers

    def format_movie(self, movie: Dict[str, Any]) -> Dict[str, Any]:
        poster = movie.get("poster_path")
        if poster and not poster.startswith("http"):
            poster = f"{self.image_base}/w780{poster}"

        backdrop = movie.get("backdrop_path")
        if backdrop and not backdrop.startswith("http"):
            backdrop = f"{self.image_base}/original{backdrop}"

        genres = movie.get("genres") or []
        if not genres and "genre_ids" in movie:
            genre_map = {g["id"]: g["name"] for g in GENRES_LIST}
            genres = [{"id": gid, "name": genre_map.get(gid, "Drama")} for gid in movie.get("genre_ids", [])]

        return {
            "id": movie.get("id"),
            "title": movie.get("title") or movie.get("name", "Untitled"),
            "original_title": movie.get("original_title") or movie.get("original_name", ""),
            "tagline": movie.get("tagline", ""),
            "overview": movie.get("overview", "No synopsis available."),
            "release_date": movie.get("release_date") or movie.get("first_air_date", "2024"),
            "runtime": movie.get("runtime", 120),
            "vote_average": round(float(movie.get("vote_average", 0.0)), 1),
            "vote_count": movie.get("vote_count", 0),
            "popularity": movie.get("popularity", 0.0),
            "poster_path": poster or "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780",
            "backdrop_path": backdrop or "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1920",
            "genres": genres,
            "budget": movie.get("budget", 0),
            "revenue": movie.get("revenue", 0),
            "status": movie.get("status", "Released"),
            "original_language": movie.get("original_language", "en"),
            "trailer_key": movie.get("trailer_key", "dQw4w9WgXcQ"),
            "rank": movie.get("rank")
        }

    async def get_trending_movies(self, time_window: str = "week") -> List[Dict[str, Any]]:
        key = self.api_key
        if key:
            try:
                params = {"api_key": key} if len(key) <= 50 else {}
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/trending/movie/{time_window}",
                        params=params,
                        headers=self.get_headers()
                    )
                    if resp.status_code == 200:
                        data = resp.json().get("results", [])
                        return [self.format_movie(m) for m in data]
            except Exception as e:
                logger.warning(f"Live TMDB trending failed, falling back to curated: {e}")
        return [self.format_movie(m) for m in CURATED_MOVIES]

    async def get_now_showing(self) -> List[Dict[str, Any]]:
        key = self.api_key
        if key:
            try:
                params = {"api_key": key} if len(key) <= 50 else {}
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/movie/now_playing",
                        params=params,
                        headers=self.get_headers()
                    )
                    if resp.status_code == 200:
                        data = resp.json().get("results", [])
                        return [self.format_movie(m) for m in data]
            except Exception as e:
                logger.warning(f"Live TMDB now playing failed, falling back to curated: {e}")
        return [self.format_movie(m) for m in CURATED_MOVIES]

    async def get_popular_movies(self) -> List[Dict[str, Any]]:
        key = self.api_key
        if key:
            try:
                params = {"api_key": key} if len(key) <= 50 else {}
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/movie/popular",
                        params=params,
                        headers=self.get_headers()
                    )
                    if resp.status_code == 200:
                        data = resp.json().get("results", [])
                        res = [self.format_movie(m) for m in data]
                        for idx, m in enumerate(res):
                            m["rank"] = idx + 1
                        return res
            except Exception as e:
                logger.warning(f"Live TMDB popular failed, falling back to curated: {e}")
        res = [self.format_movie(m) for m in CURATED_MOVIES]
        for idx, m in enumerate(res):
            m["rank"] = idx + 1
        return res

    async def get_live_tmdb_reviews(self, movie_id: int) -> List[Dict[str, Any]]:
        key = self.api_key
        if not key:
            return []
        try:
            params = {"api_key": key, "page": 1} if len(key) <= 50 else {"page": 1}
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.base_url}/movie/{movie_id}/reviews",
                    params=params,
                    headers=self.get_headers()
                )
                if resp.status_code == 200:
                    data = resp.json()
                    all_raw_reviews = list(data.get("results", []))
                    total_pages = data.get("total_pages", 1)

                    # Gather all remaining pages concurrently up to 10 pages (200 reviews)
                    if total_pages > 1:
                        fetch_pages = min(total_pages, 10)
                        tasks = []
                        for p in range(2, fetch_pages + 1):
                            p_params = {"api_key": key, "page": p} if len(key) <= 50 else {"page": p}
                            tasks.append(client.get(
                                f"{self.base_url}/movie/{movie_id}/reviews",
                                params=p_params,
                                headers=self.get_headers()
                            ))
                        page_responses = await asyncio.gather(*tasks, return_exceptions=True)
                        for r_item in page_responses:
                            if isinstance(r_item, httpx.Response) and r_item.status_code == 200:
                                all_raw_reviews.extend(r_item.json().get("results", []))

                    formatted_reviews = []
                    for r in all_raw_reviews:
                        ad = r.get("author_details", {})
                        avatar = ad.get("avatar_path")
                        if avatar:
                            if avatar.startswith("/"):
                                avatar = f"{self.image_base}/w185{avatar}"
                            elif not avatar.startswith("http"):
                                avatar = f"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                        else:
                            avatar = f"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"

                        raw_rating = ad.get("rating")
                        norm_rating = round(float(raw_rating) / 2.0, 1) if raw_rating is not None else 4.5

                        formatted_reviews.append({
                            "id": r.get("id"),
                            "author": r.get("author") or ad.get("username", "TMDB Critic"),
                            "username": ad.get("username") or r.get("author"),
                            "avatar": avatar,
                            "rating": norm_rating,
                            "raw_rating": raw_rating,
                            "content": r.get("content", ""),
                            "created_at": r.get("created_at") or "2023-08-01T00:00:00Z",
                            "source": "TMDB Verified Member",
                            "source_url": r.get("url") or f"https://www.themoviedb.org/movie/{movie_id}/reviews",
                            "likes": int(abs(hash(r.get("id", ""))) % 1500) + 120,
                            "is_native": False
                        })
                    return formatted_reviews
        except Exception as e:
            logger.warning(f"Error fetching live reviews from TMDB: {e}")
        return []

    async def get_movie_details(self, movie_id: int) -> Optional[Dict[str, Any]]:
        key = self.api_key

        # If live API key is present, ALWAYS query TMDB live first!
        if key:
            try:
                params = {
                    "append_to_response": "credits,videos,reviews,similar,keywords"
                }
                if len(key) <= 50:
                    params["api_key"] = key

                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/movie/{movie_id}",
                        params=params,
                        headers=self.get_headers()
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        formatted = self.format_movie(data)

                        credits = data.get("credits", {})
                        cast_list = []
                        for actor in credits.get("cast", [])[:12]:
                            pic = actor.get("profile_path")
                            cast_list.append({
                                "id": actor.get("id"),
                                "name": actor.get("name"),
                                "character": actor.get("character"),
                                "profile_path": f"{self.image_base}/w185{pic}" if pic else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                            })
                        formatted["cast"] = cast_list

                        crew = credits.get("crew", [])
                        director = next((c.get("name") for c in crew if c.get("job") == "Director"), "Unknown")
                        writers = [c.get("name") for c in crew if c.get("job") in ("Screenplay", "Writer")]
                        cinematography = next((c.get("name") for c in crew if c.get("job") == "Director of Photography"), "Unknown")
                        music = next((c.get("name") for c in crew if c.get("job") in ("Original Music Composer", "Music")), "Unknown")

                        formatted["director"] = director
                        formatted["writers"] = writers or [director]
                        formatted["cinematography"] = cinematography
                        formatted["music"] = music
                        formatted["production_companies"] = [p.get("name") for p in data.get("production_companies", [])]
                        
                        kw_data = data.get("keywords", {}).get("keywords", [])
                        formatted["keywords"] = [k.get("name") for k in kw_data[:10]]

                        videos = data.get("videos", {}).get("results", [])
                        trailer = next((v for v in videos if v.get("site") == "YouTube" and v.get("type") in ("Trailer", "Teaser")), None)
                        formatted["trailer_key"] = trailer.get("key") if trailer else "dQw4w9WgXcQ"

                        # Fetch ALL live reviews from TMDB
                        live_reviews = await self.get_live_tmdb_reviews(movie_id)
                        formatted["external_reviews"] = live_reviews
                        return formatted
            except Exception as e:
                logger.warning(f"Error fetching live movie {movie_id} from TMDB: {e}")

        # Fallback to curated catalog
        for m in CURATED_MOVIES:
            if m["id"] == movie_id:
                formatted = self.format_movie(m)
                formatted["cast"] = m.get("cast", [])
                formatted["director"] = m.get("director", "Unknown")
                formatted["writers"] = m.get("writers", [])
                formatted["cinematography"] = m.get("cinematography", "Unknown")
                formatted["music"] = m.get("music", "Unknown")
                formatted["production_companies"] = m.get("production_companies", [])
                formatted["keywords"] = m.get("keywords", [])
                formatted["trailer_key"] = m.get("trailer_key", "dQw4w9WgXcQ")
                formatted["external_reviews"] = m.get("external_reviews", [])
                return formatted

        if CURATED_MOVIES:
            return self.format_movie(CURATED_MOVIES[0])
        return None

    async def search_movies(self, query: str) -> List[Dict[str, Any]]:
        query_clean = query.strip().lower()
        if not query_clean:
            return []

        key = self.api_key
        if key:
            try:
                params = {"query": query_clean}
                if len(key) <= 50:
                    params["api_key"] = key
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/search/movie",
                        params=params,
                        headers=self.get_headers()
                    )
                    if resp.status_code == 200:
                        results = resp.json().get("results", [])
                        return [self.format_movie(m) for m in results]
            except Exception as e:
                logger.warning(f"Live search failed: {e}")

        matched = []
        for m in CURATED_MOVIES:
            title = m.get("title", "").lower()
            orig = m.get("original_title", "").lower()
            director = m.get("director", "").lower()
            cast_names = " ".join([c["name"].lower() for c in m.get("cast", [])])
            keywords = " ".join(m.get("keywords", []))

            if (query_clean in title or 
                query_clean in orig or 
                query_clean in director or 
                query_clean in cast_names or 
                query_clean in keywords):
                matched.append(self.format_movie(m))

        return matched

    async def discover_movies(
        self,
        genre_id: Optional[int] = None,
        year: Optional[str] = None,
        language: Optional[str] = None,
        sort_by: str = "popularity.desc",
        page: int = 1
    ) -> Dict[str, Any]:
        key = self.api_key
        if key:
            try:
                params = {
                    "sort_by": sort_by,
                    "page": page,
                    "include_adult": "false"
                }
                if genre_id and genre_id > 0:
                    params["with_genres"] = str(genre_id)
                if year:
                    params["primary_release_year"] = year
                if language and language != "all":
                    params["with_original_language"] = language
                if len(key) <= 50:
                    params["api_key"] = key

                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/discover/movie",
                        params=params,
                        headers=self.get_headers()
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return {
                            "page": data.get("page", 1),
                            "total_pages": data.get("total_pages", 1),
                            "total_results": data.get("total_results", 0),
                            "results": [self.format_movie(m) for m in data.get("results", [])]
                        }
            except Exception as e:
                logger.warning(f"Live discover failed: {e}")

        filtered = list(CURATED_MOVIES)
        if genre_id and genre_id > 0:
            filtered = [m for m in filtered if any(g.get("id") == genre_id for g in m.get("genres", []))]
        if year:
            filtered = [m for m in filtered if m.get("release_date", "").startswith(year)]
        if language and language != "all":
            filtered = [m for m in filtered if m.get("original_language") == language]

        if sort_by == "vote_average.desc":
            filtered.sort(key=lambda x: x.get("vote_average", 0), reverse=True)
        elif sort_by == "release_date.desc":
            filtered.sort(key=lambda x: x.get("release_date", ""), reverse=True)
        else:
            filtered.sort(key=lambda x: x.get("popularity", 0), reverse=True)

        return {
            "page": 1,
            "total_pages": 1,
            "total_results": len(filtered),
            "results": [self.format_movie(m) for m in filtered]
        }

    async def get_person_details(self, person_id: int) -> Optional[Dict[str, Any]]:
        if person_id in CURATED_PERSONS:
            person = CURATED_PERSONS[person_id]
            movies = [self.format_movie(m) for m in CURATED_MOVIES if m["id"] in person["movies"]]
            return {**person, "filmography": movies}

        key = self.api_key
        if key:
            try:
                params = {"append_to_response": "movie_credits"}
                if len(key) <= 50:
                    params["api_key"] = key
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/person/{person_id}",
                        params=params,
                        headers=self.get_headers()
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        credits = data.get("movie_credits", {})
                        cast_movies = credits.get("cast", [])
                        crew_movies = credits.get("crew", [])
                        all_movies = cast_movies if data.get("known_for_department") == "Acting" else crew_movies
                        pic = data.get("profile_path")

                        return {
                            "id": data.get("id"),
                            "name": data.get("name"),
                            "known_for_department": data.get("known_for_department"),
                            "biography": data.get("biography") or "No biography available.",
                            "birthday": data.get("birthday"),
                            "place_of_birth": data.get("place_of_birth"),
                            "profile_path": f"{self.image_base}/w300{pic}" if pic else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                            "known_for": [m.get("title") for m in all_movies[:5] if m.get("title")],
                            "filmography": [self.format_movie(m) for m in all_movies[:15]]
                        }
            except Exception as e:
                logger.warning(f"Error fetching person {person_id}: {e}")

        return None

tmdb_service = TMDBService()
