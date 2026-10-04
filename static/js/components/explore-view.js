// CineVerse Explore Page Component

const ExploreView = {
  currentGenre: 0,
  currentYear: "",
  currentLanguage: "all",
  currentSort: "popularity.desc",
  movies: [],
  isLoading: false,

  async render() {
    return `
      <div class="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-semibold tracking-widest uppercase mb-3 border border-red-500/30">
            Cinema Archive
          </div>
          <h1 class="font-cinematic text-4xl md:text-6xl font-black text-white tracking-wider mb-2">
            EXPLORE
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            Step inside a world of stories. Discover acclaimed masterpieces across every genre and era.
          </p>
        </div>

        <!-- Filter Controls Container -->
        <div class="cinema-glass rounded-2xl p-5 border border-white/10 mb-10 shadow-2xl">
          
          <!-- Primary Genre Filter Pills (Matching Mockup) -->
          <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar" id="explore-genre-pills">
            ${[
              { id: 0, name: "All" },
              { id: 28, name: "Action" },
              { id: 878, name: "Sci-Fi" },
              { id: 18, name: "Drama" },
              { id: 53, name: "Thriller" },
              { id: 35, name: "Comedy" },
              { id: 27, name: "Horror" },
              { id: 16, name: "Animation" },
              { id: 10749, name: "Romance" },
              { id: 80, name: "Crime" },
              { id: 99, name: "Documentary" },
              { id: 12, name: "Adventure" }
            ].map(g => `
              <button 
                class="genre-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${this.currentGenre === g.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105' : 'bg-black/50 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'}"
                data-genre-id="${g.id}"
              >
                ${g.name}
              </button>
            `).join('')}
          </div>

          <!-- Secondary Filters Row (Year, Language, Sort) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
            
            <!-- Sort By -->
            <div>
              <label class="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Sort By</label>
              <select id="filter-sort" class="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500">
                <option value="popularity.desc" ${this.currentSort === 'popularity.desc' ? 'selected' : ''}>Most Popular</option>
                <option value="vote_average.desc" ${this.currentSort === 'vote_average.desc' ? 'selected' : ''}>Highest Rated</option>
                <option value="release_date.desc" ${this.currentSort === 'release_date.desc' ? 'selected' : ''}>Release Date (Newest)</option>
              </select>
            </div>

            <!-- Year -->
            <div>
              <label class="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Release Year</label>
              <select id="filter-year" class="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500">
                <option value="">All Years</option>
                <option value="2024" ${this.currentYear === '2024' ? 'selected' : ''}>2024</option>
                <option value="2023" ${this.currentYear === '2023' ? 'selected' : ''}>2023</option>
                <option value="2022" ${this.currentYear === '2022' ? 'selected' : ''}>2022</option>
                <option value="2021" ${this.currentYear === '2021' ? 'selected' : ''}>2021</option>
                <option value="2019" ${this.currentYear === '2019' ? 'selected' : ''}>2019</option>
                <option value="2014" ${this.currentYear === '2014' ? 'selected' : ''}>2014</option>
                <option value="1957" ${this.currentYear === '1957' ? 'selected' : ''}>Classic Era (1950s)</option>
              </select>
            </div>

            <!-- Language -->
            <div>
              <label class="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Language</label>
              <select id="filter-language" class="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500">
                <option value="all">All Languages</option>
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="ja" ${this.currentLanguage === 'ja' ? 'selected' : ''}>Japanese (日本語)</option>
                <option value="te" ${this.currentLanguage === 'te' ? 'selected' : ''}>Telugu (తెలుగు)</option>
                <option value="ko" ${this.currentLanguage === 'ko' ? 'selected' : ''}>Korean (한국어)</option>
                <option value="fr" ${this.currentLanguage === 'fr' ? 'selected' : ''}>French (Français)</option>
              </select>
            </div>

          </div>

        </div>

        <!-- Movie Cards Grid Container -->
        <div id="explore-movies-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 min-h-[400px]">
          <!-- Loaded dynamically -->
        </div>

      </div>
    `;
  },

  async loadMovies() {
    const grid = document.getElementById("explore-movies-grid");
    if (!grid) return;

    // Show Skeleton Loader
    grid.innerHTML = Array(10).fill(0).map(() => `
      <div class="rounded-2xl overflow-hidden cinema-glass border border-white/5 animate-pulse">
        <div class="aspect-[2/3] w-full bg-zinc-800/60"></div>
        <div class="p-3">
          <div class="h-4 bg-zinc-700/60 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-zinc-800/60 rounded w-1/2"></div>
        </div>
      </div>
    `).join('');

    try {
      const data = await API.discoverMovies({
        genre: this.currentGenre > 0 ? this.currentGenre : undefined,
        year: this.currentYear || undefined,
        language: this.currentLanguage !== 'all' ? this.currentLanguage : undefined,
        sort_by: this.currentSort
      });

      this.movies = data.results || [];

      if (!this.movies.length) {
        grid.innerHTML = `
          <div class="col-span-full py-16 text-center">
            <div class="w-16 h-16 rounded-full bg-red-600/20 text-red-500 mx-auto flex items-center justify-center mb-3 border border-red-500/30">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </div>
            <h3 class="font-cinematic text-xl font-bold text-white">No Film Found In This Category</h3>
            <p class="text-xs text-gray-400 mt-1">Try resetting the filters or searching for another title.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = this.movies.map(movie => `
        <div class="poster-card-3d-wrap">
          <a href="#/movie/${movie.id}" class="poster-card-3d block rounded-2xl overflow-hidden cinema-glass border border-white/10 group transition-all">
            
            <div class="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
              <img 
                src="${movie.poster_path}" 
                alt="${movie.title}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                loading="lazy" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              <!-- Top Rating Chip -->
              <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1 border border-white/10">
                ★ ${movie.vote_average}
              </div>

              <!-- Watchlist Toggle Button -->
              <button 
                class="watchlist-toggle-btn absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/15"
                data-movie-id="${movie.id}"
                data-movie-title="${movie.title}"
                data-poster="${movie.poster_path}"
                data-rating="${movie.vote_average}"
                title="Add to Watchlist"
                onclick="event.preventDefault(); PopularRanked.toggleWatchlist(this);"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              </button>
            </div>

            <div class="p-3">
              <h4 class="font-bold text-xs sm:text-sm text-white truncate group-hover:text-red-400 transition-colors">
                ${movie.title}
              </h4>
              <div class="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                <span>${movie.release_date ? movie.release_date.substring(0, 4) : '2024'}</span>
                <span class="truncate ml-2 text-right">${movie.genres && movie.genres[0] ? movie.genres[0].name : 'Feature'}</span>
              </div>
            </div>

          </a>
        </div>
      `).join('');

      Card3D.init();
    } catch (err) {
      grid.innerHTML = `<div class="col-span-full py-12 text-center text-red-400 text-sm">Failed to connect to the projector archive. Please try again.</div>`;
    }
  },

  attachEvents() {
    // Genre pills
    document.querySelectorAll(".genre-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".genre-pill").forEach(p => {
          p.className = "genre-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap bg-black/50 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10";
        });
        pill.className = "genre-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105";
        
        this.currentGenre = parseInt(pill.getAttribute("data-genre-id"), 10);
        this.loadMovies();
      });
    });

    // Secondary filters
    const sortSelect = document.getElementById("filter-sort");
    const yearSelect = document.getElementById("filter-year");
    const langSelect = document.getElementById("filter-language");

    if (sortSelect) sortSelect.addEventListener("change", (e) => { this.currentSort = e.target.value; this.loadMovies(); });
    if (yearSelect) yearSelect.addEventListener("change", (e) => { this.currentYear = e.target.value; this.loadMovies(); });
    if (langSelect) langSelect.addEventListener("change", (e) => { this.currentLanguage = e.target.value; this.loadMovies(); });

    this.loadMovies();
  }
};

window.ExploreView = ExploreView;
