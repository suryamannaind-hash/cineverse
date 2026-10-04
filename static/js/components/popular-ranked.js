// CineVerse "Popular This Week" Metallic Ranked Section

const PopularRanked = {
  render(movies) {
    const topMovies = (movies || []).slice(0, 5);

    return `
      <section class="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        
        <!-- Header with View All -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-cinematic text-2xl md:text-4xl font-extrabold text-white tracking-wide">
              Popular This Week
            </h2>
            <p class="text-xs md:text-sm text-gray-400 mt-1">
              Top box office & critical sensations commanding our screens.
            </p>
          </div>
          <a href="#/explore" class="text-xs md:text-sm text-gray-400 hover:text-white flex items-center gap-1 group">
            <span>View All</span>
            <svg class="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>

        <!-- 5-Column Ranked Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          ${topMovies.map((movie, index) => `
            <div class="poster-card-3d-wrap">
              <a href="#/movie/${movie.id}" class="poster-card-3d block rounded-2xl overflow-hidden cinema-glass border border-white/10 group">
                
                <!-- Poster Image -->
                <div class="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                  <img 
                    src="${movie.poster_path}" 
                    alt="${movie.title}" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                  <!-- Large Metallic Rank Number Overlapping Poster Bottom-Left -->
                  <div class="absolute -bottom-2 -left-1 rank-number z-20 pointer-events-none">
                    ${index + 1}
                  </div>

                  <!-- Quick Watchlist Bookmark Button -->
                  <button 
                    class="watchlist-toggle-btn absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600/90 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/15"
                    data-movie-id="${movie.id}"
                    data-movie-title="${movie.title}"
                    data-poster="${movie.poster_path}"
                    data-rating="${movie.vote_average}"
                    title="Add to Watchlist"
                    onclick="event.preventDefault(); PopularRanked.toggleWatchlist(this);"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  </button>

                </div>

                <!-- Info Below Poster -->
                <div class="p-3 text-left">
                  <div class="font-bold text-sm text-white truncate group-hover:text-red-400 transition-colors">
                    ${movie.title}
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span class="text-amber-400 font-semibold flex items-center gap-1">
                      ★ ${movie.vote_average}
                    </span>
                    <span>${movie.release_date ? movie.release_date.substring(0, 4) : '2024'}</span>
                  </div>
                </div>

              </a>
            </div>
          `).join('')}
        </div>

      </section>
    `;
  },

  async toggleWatchlist(btn) {
    const movieId = parseInt(btn.getAttribute("data-movie-id"), 10);
    const title = btn.getAttribute("data-movie-title");
    const poster = btn.getAttribute("data-poster");
    const rating = parseFloat(btn.getAttribute("data-rating")) || 0;

    CinemaAudio.playTicketTear();

    if (State.watchlistIds.has(movieId)) {
      await API.removeFromWatchlist(movieId);
      State.watchlistIds.delete(movieId);
      btn.classList.remove("bg-red-600", "text-white");
      btn.classList.add("bg-black/60", "text-gray-300");
      State.toast(`Removed "${title}" from Watchlist`);
    } else {
      await API.addToWatchlist({
        movie_id: movieId,
        movie_title: title,
        poster_path: poster,
        vote_average: rating,
        status: "want_to_watch"
      });
      State.watchlistIds.add(movieId);
      btn.classList.remove("bg-black/60", "text-gray-300");
      btn.classList.add("bg-red-600", "text-white");
      State.toast(`Added "${title}" to your Watchlist!`, "success");
    }
  },

  attachEvents() {
    Card3D.init();
  }
};

window.PopularRanked = PopularRanked;
