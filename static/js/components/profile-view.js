// CineVerse Personal Profile (Theatre-Ticket-Inspired Design)

const ProfileView = {
  profileData: null,
  activeTab: "watchlist", // watchlist, reviews, diary

  async render() {
    this.profileData = await API.getCurrentUser();
    const user = this.profileData;
    const stats = user.stats || { movies_watched: 127, reviews_written: 42, watchlist: 56, favorite_genres: ["Sci-Fi", "Thriller", "Drama"] };
    const watchlist = await API.getWatchlist();

    return `
      <div class="pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        
        <!-- Theatre-Ticket-Inspired VIP Profile Pass (Matching Reference Section 13) -->
        <div class="relative cinema-ticket p-6 md:p-10 mb-12 shadow-2xl overflow-hidden border-2 border-dashed border-white/30">
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <!-- User Avatar & Identity (Col 4) -->
            <div class="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center sm:items-start md:items-center text-center sm:text-left md:text-center gap-4">
              <div class="relative">
                <img 
                  src="${user.avatar_url}" 
                  alt="${user.full_name}" 
                  class="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-amber-400 shadow-2xl"
                />
                <div class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow">
                  VIP PASS
                </div>
              </div>

              <div>
                <h1 class="font-cinematic text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                  ${user.full_name}
                </h1>
                <div class="text-xs text-amber-300 font-semibold tracking-wide uppercase mt-0.5">
                  Film Enthusiast
                </div>
                <div class="text-[11px] text-gray-300 mt-2 max-w-xs">
                  ${user.bio}
                </div>
              </div>
            </div>

            <!-- Vertical Perforated Stub Divider -->
            <div class="hidden md:block md:col-span-1 h-full border-r-2 border-dashed border-white/20"></div>

            <!-- Stats & Favorite Genres (Col 7) -->
            <div class="md:col-span-7 flex flex-col justify-between">
              
              <!-- Metrics Counter -->
              <div class="grid grid-cols-3 gap-3 text-center mb-6">
                <div class="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Watched</div>
                  <div class="text-2xl font-black text-white mt-1">${stats.movies_watched}</div>
                </div>
                <div class="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Reviews</div>
                  <div class="text-2xl font-black text-amber-400 mt-1">${stats.reviews_written}</div>
                </div>
                <div class="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Watchlist</div>
                  <div class="text-2xl font-black text-red-400 mt-1">${stats.watchlist}</div>
                </div>
              </div>

              <!-- Favorite Genres Pills -->
              <div>
                <div class="text-xs uppercase tracking-widest text-amber-300/80 font-bold mb-2">Favorite Genres</div>
                <div class="flex flex-wrap gap-2">
                  ${stats.favorite_genres.map(g => `
                    <span class="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                      ${g}
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Barcode Bottom Bar -->
              <div class="ticket-barcode mt-6 pt-3 border-t border-dashed border-white/30 text-white/70 flex items-center justify-between text-xs">
                <span>PASS #CV-89214-VIP</span>
                <span>||||| |||| || ||||||| |||</span>
                <span>ADMIT PATRON</span>
              </div>

            </div>

          </div>

        </div>

        <!-- Profile Tabs (Watchlist, Reviews, Diary) -->
        <div class="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
          <button 
            class="profile-tab-btn px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all ${this.activeTab === 'watchlist' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'cinema-glass text-gray-300 hover:text-white'}"
            data-tab="watchlist"
          >
            My Watchlist (${watchlist.length})
          </button>
          <button 
            class="profile-tab-btn px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all ${this.activeTab === 'reviews' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'cinema-glass text-gray-300 hover:text-white'}"
            data-tab="reviews"
          >
            Published Reviews (${user.recent_reviews ? user.recent_reviews.length : 0})
          </button>
        </div>

        <!-- Content Area -->
        <div id="profile-tab-content">
          ${this.activeTab === 'watchlist' ? this.renderWatchlist(watchlist) : this.renderUserReviews(user.recent_reviews)}
        </div>

      </div>
    `;
  },

  renderWatchlist(watchlist) {
    if (!watchlist.length) {
      return `
        <div class="cinema-glass p-12 rounded-2xl text-center">
          <div class="text-3xl mb-2">🎟️</div>
          <h3 class="font-cinematic text-lg font-bold text-white mb-1">Your Watchlist is Empty</h3>
          <p class="text-xs text-gray-400 mb-4">Explore movies and click "Add to Watchlist" to save them to your cinema docket.</p>
          <a href="#/explore" class="px-5 py-2 rounded-full bg-red-600 text-white text-xs font-semibold">Explore Movies</a>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        ${watchlist.map(item => `
          <div class="poster-card-3d-wrap">
            <div class="poster-card-3d rounded-2xl overflow-hidden cinema-glass border border-white/10 group relative">
              <a href="#/movie/${item.movie_id}">
                <div class="aspect-[2/3] w-full overflow-hidden bg-black">
                  <img src="${item.poster_path}" alt="${item.movie_title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                </div>
              </a>

              <!-- Status Badge -->
              <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-bold uppercase tracking-wider text-white">
                ${item.status === 'favorite' ? 'Favorite' : (item.status === 'watched' ? 'Watched' : 'Queue')}
              </div>

              <!-- Remove Button -->
              <button 
                class="remove-watchlist-btn absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center text-xs transition-colors"
                data-id="${item.movie_id}"
                title="Remove from Watchlist"
              >
                ✕
              </button>

              <div class="p-3">
                <div class="font-bold text-xs sm:text-sm text-white truncate">${item.movie_title}</div>
                <div class="text-[11px] text-gray-400 mt-0.5 flex justify-between">
                  <span>${item.release_date ? item.release_date.substring(0, 4) : '2024'}</span>
                  <span class="text-amber-400 font-semibold">★ ${item.vote_average}</span>
                </div>
              </div>

            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderUserReviews(reviews) {
    if (!reviews || !reviews.length) {
      return `<div class="cinema-glass p-8 rounded-2xl text-center text-sm text-gray-400">No reviews published yet. Go to any film to publish your thoughts!</div>`;
    }

    return `
      <div class="flex flex-col gap-4">
        ${reviews.map(r => `
          <div class="cinema-glass p-5 rounded-2xl border border-white/10 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <a href="#/movie/${r.movie_id}" class="font-cinematic font-bold text-base text-white hover:text-red-400 transition-colors">
                ${r.movie_title}
              </a>
              <div class="text-amber-400 text-sm font-bold">
                ★ ${r.rating} / 5.0
              </div>
            </div>
            <p class="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
              "${r.review_text}"
            </p>
            <div class="text-[11px] text-gray-500 pt-2 border-t border-white/5">
              Published on ${new Date(r.created_at).toLocaleDateString()}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  attachEvents() {
    Card3D.init();

    // Tab buttons
    document.querySelectorAll(".profile-tab-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        this.activeTab = btn.getAttribute("data-tab");
        const container = document.getElementById("profile-view-wrapper");
        if (container) {
          container.innerHTML = await this.render();
          this.attachEvents();
        }
      });
    });

    // Remove from watchlist
    document.querySelectorAll(".remove-watchlist-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = parseInt(btn.getAttribute("data-id"), 10);
        await API.removeFromWatchlist(id);
        State.watchlistIds.delete(id);
        State.toast("Removed from Watchlist");
        const container = document.getElementById("profile-view-wrapper");
        if (container) {
          container.innerHTML = await this.render();
          this.attachEvents();
        }
      });
    });
  }
};

window.ProfileView = ProfileView;
