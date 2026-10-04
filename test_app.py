import asyncio
import httpx
from main import app

async def test_suite():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test Static index.html
        resp = await client.get("/")
        assert resp.status_code == 200, f"Index failed: {resp.status_code}"
        assert "CineVerse" in resp.text, "CineVerse not in HTML"
        print("[PASS] GET / (index.html)")

        # 2. Test Movies Trending
        resp = await client.get("/api/movies/trending")
        assert resp.status_code == 200, f"Trending failed: {resp.status_code}"
        data = resp.json()
        assert len(data) > 0, "No trending movies returned"
        assert "title" in data[0], "Movie missing title"
        print(f"[PASS] GET /api/movies/trending ({len(data)} movies, #1 Live Trending: {data[0]['title']})")

        # 3. Test Movies Now Showing
        resp = await client.get("/api/movies/now-showing")
        assert resp.status_code == 200
        print(f"[PASS] GET /api/movies/now-showing ({len(resp.json())} movies)")

        # 4. Test Movies Popular
        resp = await client.get("/api/movies/popular")
        assert resp.status_code == 200
        assert resp.json()[0]["rank"] == 1
        print(f"[PASS] GET /api/movies/popular (Top 1 rank: {resp.json()[0]['title']})")

        # 5. Test Search
        resp = await client.get("/api/movies/search?q=Batman")
        assert resp.status_code == 200
        batman_results = resp.json()
        assert any("Batman" in m["title"] for m in batman_results)
        print(f"[PASS] GET /api/movies/search?q=Batman ({len(batman_results)} results)")

        # 6. Test Movie Details (The Batman - 414906)
        resp = await client.get("/api/movies/414906")
        assert resp.status_code == 200
        batman = resp.json()
        assert batman["title"] == "The Batman"
        assert "ratings_breakdown" in batman
        print(f"[PASS] GET /api/movies/414906 (The Batman details & ratings breakdown)")

        # 7. Test Reviews
        resp = await client.get("/api/reviews/movie/414906")
        assert resp.status_code == 200
        reviews = resp.json()
        assert len(reviews) > 0
        print(f"[PASS] GET /api/reviews/movie/414906 ({len(reviews)} native reviews)")

        # 8. Test Submit New Review
        new_rev = {
            "movie_id": 414906,
            "movie_title": "The Batman",
            "poster_path": "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
            "rating": 5.0,
            "review_text": "Pattinson and Kravitz have electric chemistry. The highway Batmobile sequence is pure sensory bliss.",
            "has_spoilers": False
        }
        resp = await client.post("/api/reviews?user_id=1", json=new_rev)
        assert resp.status_code == 200
        rev_id = resp.json()["id"]
        print(f"[PASS] POST /api/reviews (Created review ID {rev_id})")

        # 9. Test Watchlist
        resp = await client.get("/api/watchlist?user_id=1")
        assert resp.status_code == 200
        watchlist = resp.json()
        print(f"[PASS] GET /api/watchlist ({len(watchlist)} items)")

        # 10. Test Add to Watchlist
        add_item = {
            "movie_id": 157336,
            "movie_title": "Interstellar",
            "poster_path": "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            "vote_average": 8.4,
            "status": "favorite"
        }
        resp = await client.post("/api/watchlist?user_id=1", json=add_item)
        assert resp.status_code == 200
        print(f"[PASS] POST /api/watchlist (Item updated/added)")

        # 11. Test Discussions (The Lobby)
        resp = await client.get("/api/discussions")
        assert resp.status_code == 200
        discussions = resp.json()
        assert len(discussions) > 0
        print(f"[PASS] GET /api/discussions ({len(discussions)} discussions in The Lobby)")

        # 12. Test Discussion Thread
        first_d_id = discussions[0]["id"]
        resp = await client.get(f"/api/discussions/{first_d_id}")
        assert resp.status_code == 200
        thread = resp.json()
        assert "replies" in thread
        print(f"[PASS] GET /api/discussions/{first_d_id} ({len(thread['replies'])} thread replies)")

        # 13. Test Auth Me
        resp = await client.get("/api/auth/me?user_id=1")
        assert resp.status_code == 200
        user = resp.json()
        assert user["username"] == "surya"
        assert "stats" in user
        print(f"[PASS] GET /api/auth/me (User Surya with stats: {user['stats']})")

        # 14. Test Settings Status
        resp = await client.get("/api/settings/status")
        assert resp.status_code == 200
        settings_info = resp.json()
        print(f"[PASS] GET /api/settings/status (Mode: {settings_info['mode']})")

    print("\n==========================================")
    print("ALL 14 SUITE TESTS PASSED PERFECTLY!")
    print("==========================================")

asyncio.run(test_suite())
