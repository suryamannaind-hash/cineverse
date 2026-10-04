# CineVerse — Modern Cinema Discovery & Review Platform 🎬

A luxury, interactive 3D modern cinema-themed movie discovery and community review web platform built with a Python backend (FastAPI, SQLAlchemy, Uvicorn, httpx) and custom responsive front-end aesthetics.

---
## 🚀 Live Demo

🌐 **Live Website:** https://cineverse-wi7b.onrender.com/

📂 **GitHub Repository:** https://github.com/suryamannaind-hash/cineverse

## ✨ Features

- **Grand Cinema Auditorium Hero**: Curved projector screen, ambient volumetric light beam, floating dust motes canvas engine, and neon acoustic wall fixtures.
- **Dynamic 3D "Now Showing" Carousel**: Real-time cursor hover parallax tracking and physical pull/drag inertia physics.
- **Full TMDB Integration**: Live movie discovery, search, cast & crew credits, official trailers, and multi-page reviews.
- **Movie Detail Experience**: 3D interactive tilting poster card, vintage Admit-One cinema ticket pass, multi-source rating comparisons, and spoiler-shielded reviews.
- **The Lobby**: Community discussions lounge with threaded replies and category filtering.
- **Personal Patron Profile**: Cinema ticket pass displaying watchlist, statistics, and review history.
- **Auditorium Velvet Curtain Transitions**: Red velvet curtains with optional cinematic audio effects.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10+ installed

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/cineverse.git
cd cineverse
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
*(On Windows Command Prompt: `copy .env.example .env`)*

Open `.env` and configure your settings.
> **Note**: An API key is optional! CineVerse includes an offline curated catalog of iconic movies out-of-the-box. To enable live TMDB searches and reviews, paste your free API key from [The Movie Database](https://www.themoviedb.org/settings/api).

### 5. Launch Application
```bash
python main.py
```
Open your browser and navigate to:
```
http://127.0.0.1:8000
```

---

## 🔒 Security & Privacy Notice

- **API Keys & Secrets**: Never commit `.env` to Git. The project includes a pre-configured `.gitignore` file that excludes `.env` and `*.db` automatically.
- **Local Data**: Local SQLite databases (`cineverse.db`) are excluded to protect personal testing accounts and watchlists.

---

## 📜 Intellectual Property & License

Copyright © 2026. All rights reserved.  
This project is proprietary. Unauthorized copying, modification, or distribution of this code or visual assets, via any medium, is strictly prohibited without explicit permission.
