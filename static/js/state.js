// CineVerse Central State & Event Bus

const State = {
  currentUser: {
    id: 1,
    username: "surya",
    full_name: "Surya",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
  },
  watchlistIds: new Set(),
  soundEnabled: false,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  listeners: {},

  init() {
    const savedSound = localStorage.getItem('cineverse_sound');
    if (savedSound !== null) {
      this.soundEnabled = savedSound === 'true';
    }
    const savedUser = localStorage.getItem('cineverse_user_id');
    if (savedUser) {
      API.currentUserId = parseInt(savedUser, 10);
      this.currentUser.id = API.currentUserId;
    }
    this.refreshWatchlistCache();
  },

  async refreshWatchlistCache() {
    try {
      const items = await API.getWatchlist();
      this.watchlistIds = new Set(items.map(i => i.movie_id));
      this.emit('watchlist:updated', this.watchlistIds);
    } catch (e) {
      console.warn("Could not sync watchlist cache", e);
    }
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('cineverse_sound', this.soundEnabled);
    this.emit('sound:toggled', this.soundEnabled);
    return this.soundEnabled;
  },

  switchUser(user) {
    this.currentUser = user;
    API.currentUserId = user.id;
    localStorage.setItem('cineverse_user_id', user.id);
    this.refreshWatchlistCache();
    this.emit('user:changed', user);
  },

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  },

  toast(message, type = "cinema") {
    let container = document.getElementById("cineverse-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "cineverse-toast-container";
      container.className = "fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "pointer-events-auto transform translate-y-4 opacity-0 transition-all duration-300 cinema-glass-red px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-red-500/40 text-white font-medium text-sm";
    
    let iconSvg = `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`;
    if (type === "success") {
      iconSvg = `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};

window.State = State;
