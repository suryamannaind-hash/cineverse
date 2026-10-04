// CineVerse Cinematic Navbar Component

const Navbar = {
  searchDebounceTimer: null,

  render() {
    return `
      <nav class="fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 px-4 md:px-8">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 cinema-glass px-5 py-2.5 rounded-full border border-white/10 shadow-2xl">
          
          <!-- Brand Logo -->
          <a href="#/" class="flex items-center gap-2.5 group cursor-pointer">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
              </svg>
            </div>
            <span class="font-cinematic text-xl font-bold tracking-wider text-white">
              Cine<span class="text-red-500">Verse</span>
            </span>
          </a>

          <!-- Navigation Links (Desktop) -->
          <div class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <a href="#/" class="nav-link hover:text-white transition-colors" data-route="home">Home</a>
            <a href="#/explore" class="nav-link hover:text-white transition-colors" data-route="explore">Explore</a>
            <a href="#/popular" class="nav-link hover:text-white transition-colors" data-route="popular">Movies</a>
            <a href="#/lobby" class="nav-link hover:text-white transition-colors" data-route="lobby">The Lobby</a>
            <a href="#/watchlist" class="nav-link hover:text-white transition-colors" data-route="watchlist">Watchlist</a>
          </div>

          <!-- Search Bar with Live Dropdown -->
          <div class="relative flex-1 max-w-xs md:max-w-sm hidden sm:block">
            <div class="relative">
              <input 
                type="text" 
                id="global-search-input"
                placeholder="Search movies, actors, directors..."
                class="w-full bg-black/60 text-white placeholder-gray-400 text-xs md:text-sm pl-9 pr-4 py-1.5 rounded-full border border-white/15 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                autocomplete="off"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <!-- Search Dropdown Results -->
            <div id="search-dropdown" class="absolute top-11 left-0 right-0 hidden cinema-glass rounded-2xl p-2 border border-white/10 shadow-2xl max-h-96 overflow-y-auto z-50">
              <div id="search-results-list" class="flex flex-col gap-1.5"></div>
            </div>
          </div>

          <!-- Action Controls & Profile -->
          <div class="flex items-center gap-3">
            
            <!-- Sound Toggle Button -->
            <button 
              id="sound-toggle-btn"
              title="Toggle Theatre Audio Effects"
              class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors border border-white/10"
            >
              <svg class="w-4 h-4" id="sound-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
            </button>

            <!-- API Key / Settings Button -->
            <button 
              id="open-settings-btn"
              title="TMDB Key & Cinema Settings"
              class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors border border-white/10"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>

            <!-- User Ticket / Profile Avatar -->
            <button 
              id="user-profile-btn"
              class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <img 
                id="navbar-user-avatar"
                src="${State.currentUser.avatar_url}" 
                alt="Profile" 
                class="w-7 h-7 rounded-full object-cover border border-amber-400/50"
              />
              <span id="navbar-user-name" class="text-xs font-semibold text-gray-200 hidden lg:inline-block">${State.currentUser.full_name}</span>
            </button>

          </div>
        </div>
      </nav>

      <!-- Mobile Bottom Navigation Bar -->
      <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 cinema-glass border-t border-white/10 px-4 py-2 flex items-center justify-around text-xs text-gray-400">
        <a href="#/" class="flex flex-col items-center gap-1 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span>Home</span>
        </a>
        <a href="#/explore" class="flex flex-col items-center gap-1 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span>Explore</span>
        </a>
        <a href="#/lobby" class="flex flex-col items-center gap-1 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
          <span>Lobby</span>
        </a>
        <a href="#/watchlist" class="flex flex-col items-center gap-1 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          <span>Watchlist</span>
        </a>
        <a href="#/profile" class="flex flex-col items-center gap-1 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span>Profile</span>
        </a>
      </div>
    `;
  },

  attachEvents() {
    const searchInput = document.getElementById("global-search-input");
    const searchDropdown = document.getElementById("search-dropdown");
    const resultsList = document.getElementById("search-results-list");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        clearTimeout(this.searchDebounceTimer);
        const q = e.target.value.trim();
        if (q.length < 2) {
          searchDropdown.classList.add("hidden");
          return;
        }

        this.searchDebounceTimer = setTimeout(async () => {
          resultsList.innerHTML = `<div class="p-3 text-xs text-gray-400 text-center">Searching CineVerse archives...</div>`;
          searchDropdown.classList.remove("hidden");

          try {
            const results = await API.search(q);
            if (!results.length) {
              resultsList.innerHTML = `<div class="p-3 text-xs text-gray-400 text-center">No film records matching "${q}"</div>`;
              return;
            }

            resultsList.innerHTML = results.slice(0, 6).map(m => `
              <a href="#/movie/${m.id}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors search-item">
                <img src="${m.poster_path}" alt="${m.title}" class="w-10 h-14 object-cover rounded-lg shadow" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-white truncate">${m.title}</div>
                  <div class="text-xs text-gray-400 flex items-center gap-2">
                    <span>${m.release_date ? m.release_date.substring(0, 4) : '2024'}</span>
                    <span>·</span>
                    <span class="text-amber-400">★ ${m.vote_average}</span>
                  </div>
                </div>
              </a>
            `).join('');

            // Hide on click outside
            document.addEventListener("click", function closeDropdown(event) {
              if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
                searchDropdown.classList.add("hidden");
                document.removeEventListener("click", closeDropdown);
              }
            });
          } catch (err) {
            resultsList.innerHTML = `<div class="p-3 text-xs text-red-400 text-center">Search error. Please try again.</div>`;
          }
        }, 280);
      });
    }

    // Sound toggle button
    const soundBtn = document.getElementById("sound-toggle-btn");
    const soundSvg = document.getElementById("sound-icon-svg");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const enabled = State.toggleSound();
        if (enabled) {
          CinemaAudio.playStarDing();
          State.toast("Theatre Dolby Sound Effects Enabled", "success");
          soundSvg.classList.add("text-amber-400");
        } else {
          State.toast("Sound Muted");
          soundSvg.classList.remove("text-amber-400");
        }
      });
    }

    // Settings / TMDB Key Button
    const settingsBtn = document.getElementById("open-settings-btn");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        SettingsModal.open();
      });
    }

    // User Profile / Ticket Booth button
    const profileBtn = document.getElementById("user-profile-btn");
    if (profileBtn) {
      profileBtn.addEventListener("click", () => {
        TicketBoothModal.open();
      });
    }

    // Listen to user changes
    State.on('user:changed', (user) => {
      const avatar = document.getElementById("navbar-user-avatar");
      const name = document.getElementById("navbar-user-name");
      if (avatar) avatar.src = user.avatar_url;
      if (name) name.textContent = user.full_name;
    });
  }
};

window.Navbar = Navbar;
