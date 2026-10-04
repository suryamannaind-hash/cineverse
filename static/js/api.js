// CineVerse Client API Service

const API = {
  currentUserId: 1,

  async get(url, params = {}) {
    const u = new URL(url, window.location.origin);
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        u.searchParams.append(k, params[k]);
      }
    });
    const res = await fetch(u.toString());
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${await res.text()}`);
    }
    return res.json();
  },

  async post(url, data = {}, params = {}) {
    const u = new URL(url, window.location.origin);
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null) {
        u.searchParams.append(k, params[k]);
      }
    });
    const res = await fetch(u.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${await res.text()}`);
    }
    return res.json();
  },

  async delete(url, params = {}) {
    const u = new URL(url, window.location.origin);
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null) {
        u.searchParams.append(k, params[k]);
      }
    });
    const res = await fetch(u.toString(), { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${await res.text()}`);
    }
    return res.json();
  },

  // Movies
  getTrending() { return this.get('/api/movies/trending'); },
  getNowShowing() { return this.get('/api/movies/now-showing'); },
  getPopular() { return this.get('/api/movies/popular'); },
  getGenres() { return this.get('/api/movies/genres'); },
  search(query) { return this.get('/api/movies/search', { q: query }); },
  getMovieDetails(id) { return this.get(`/api/movies/${id}`); },
  getPersonDetails(id) { return this.get(`/api/movies/person/${id}`); },
  discoverMovies(params) { return this.get('/api/movies/discover', params); },

  // Reviews
  getReviews(movieId, filterType = 'all') {
    return this.get(`/api/reviews/movie/${movieId}`, {
      filter_type: filterType,
      current_user_id: this.currentUserId
    });
  },
  submitReview(payload) {
    return this.post('/api/reviews', payload, { user_id: this.currentUserId });
  },
  voteReview(reviewId, voteType) {
    return this.post(`/api/reviews/${reviewId}/vote`, { vote_type: voteType }, { user_id: this.currentUserId });
  },

  // Watchlist
  getWatchlist(status = null) {
    return this.get('/api/watchlist', { status, user_id: this.currentUserId });
  },
  addToWatchlist(item) {
    return this.post('/api/watchlist', item, { user_id: this.currentUserId });
  },
  removeFromWatchlist(movieId) {
    return this.delete(`/api/watchlist/${movieId}`, { user_id: this.currentUserId });
  },
  checkWatchlist(movieId) {
    return this.get(`/api/watchlist/check/${movieId}`, { user_id: this.currentUserId });
  },

  // Discussions (The Lobby)
  getDiscussions(category = null) {
    return this.get('/api/discussions', { category });
  },
  getDiscussionThread(id) {
    return this.get(`/api/discussions/${id}`);
  },
  createDiscussion(payload) {
    return this.post('/api/discussions', payload, { user_id: this.currentUserId });
  },
  replyToDiscussion(id, content) {
    return this.post(`/api/discussions/${id}/replies`, { content }, { user_id: this.currentUserId });
  },
  likeDiscussion(id) {
    return this.post(`/api/discussions/${id}/like`);
  },

  // Auth & Profile
  getCurrentUser() {
    return this.get('/api/auth/me', { user_id: this.currentUserId });
  },
  getAvailableUsers() {
    return this.get('/api/auth/users');
  },
  login(email) {
    return this.post('/api/auth/login', { email });
  },

  // Settings
  getStatus() {
    return this.get('/api/settings/status');
  },
  updateTMDBKey(apiKey) {
    return this.post('/api/settings/tmdb-key', { api_key: apiKey });
  }
};
