// CineVerse Movie Detail Page Component

const MovieDetailView = {
  movie: null,
  activeReviewTab: "all",
  reviews: [],

  async render(movieId) {
    try {
      this.movie = await API.getMovieDetails(movieId);
    } catch (e) {
      console.error("Failed to load movie details:", e);
      this.movie = null;
    }

    try {
      this.reviews = await API.getReviews(movieId, this.activeReviewTab);
    } catch (e) {
      console.warn("Failed to load reviews:", e);
      this.reviews = [];
    }
    if (!Array.isArray(this.reviews)) this.reviews = [];

    if (!this.movie) {
      return `
        <div class="pt-32 text-center py-20 px-4">
          <h2 class="font-cinematic text-3xl font-bold text-white mb-2">Movie Not Found</h2>
          <p class="text-gray-400 text-sm mb-6">Looks like the cinema projector is having trouble locating this film reel.</p>
          <a href="#/explore" class="px-6 py-2.5 rounded-full bg-red-600 text-white font-semibold text-sm">Browse Explore</a>
        </div>
      `;
    }

    const m = this.movie;
    const runtime = m.runtime || 120;
    const hours = Math.floor(runtime / 60);
    const mins = runtime % 60;
    const runtimeStr = `${hours}h ${mins}m`;
    const year = m.release_date ? m.release_date.substring(0, 4) : '2024';
    const genresStr = (m.genres && m.genres.length) ? m.genres.map(g => g.name).join(' · ') : 'Cinema';
    const isInWatchlist = (State.watchlistIds && State.watchlistIds.has) ? State.watchlistIds.has(m.id) : false;

    return `
      <div class="relative min-h-screen pt-20 pb-24 overflow-hidden">
        
        <!-- Ambient Cinema Screen Backdrop with Projector Glow -->
        <div class="absolute top-0 left-0 right-0 h-[65vh] md:h-[75vh] overflow-hidden -z-10">
          <img 
            src="${m.backdrop_path}" 
            alt="${m.title}" 
            class="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
          <!-- Projector Cone overlay -->
          <div class="projector-beam opacity-40"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 md:px-8">
          
          <!-- Breadcrumb / Back Link -->
          <div class="mb-6 pt-4">
            <a href="#/explore" class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              <span>Back to Explore</span>
            </a>
          </div>

          <!-- Hero Information Block -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
            
            <!-- Left: 3D Poster (Col 4) -->
            <div class="lg:col-span-4 flex flex-col items-center">
              <div class="poster-card-3d-wrap w-full max-w-[320px]">
                <div class="poster-card-3d rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative aspect-[2/3] bg-black">
                  <img src="${m.poster_path}" alt="${m.title}" class="w-full h-full object-cover" />
                  <div class="poster-glare"></div>
                </div>
              </div>

              <!-- Vintage Admit-One Cinema Ticket (Matching Reference Mockup) -->
              <div class="cinema-ticket mt-6 w-full max-w-[320px] select-none">
                <div class="flex items-center justify-between border-b border-white/20 pb-2 mb-2">
                  <div class="font-cinematic font-black text-sm tracking-widest text-amber-300">CINEVERSE THEATRE</div>
                  <span class="text-[10px] bg-red-700/80 px-2 py-0.5 rounded font-mono">SEAT: ROW D-12</span>
                </div>
                <div class="text-base font-extrabold uppercase tracking-wide text-white truncate">${m.title}</div>
                <div class="text-xs text-amber-200/90 font-mono flex items-center justify-between mt-1">
                  <span>ADMIT ONE PATRON</span>
                  <span>SCREEN #1</span>
                </div>
                <div class="ticket-barcode mt-3 pt-2 border-t border-dashed border-white/30 text-center text-white/70">
                  ||||| | |||| ||| ||||||| ||| |||
                </div>
              </div>

            </div>

            <!-- Right: Details, Ratings & Actions (Col 8) -->
            <div class="lg:col-span-8 flex flex-col text-left">
              
              <!-- Badges -->
              <div class="flex items-center gap-2 mb-3">
                <span class="px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                  ${m.status || 'Released'}
                </span>
                <span class="text-xs text-gray-400">${year} · ${runtimeStr}</span>
              </div>

              <!-- Title -->
              <h1 class="font-cinematic text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wide uppercase drop-shadow-xl mb-3">
                ${m.title}
              </h1>

              <!-- Genre String -->
              <div class="text-xs sm:text-sm text-amber-400/90 font-medium mb-4">
                ${genresStr}
              </div>

              <!-- Rating & Quick Metrics -->
              <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300 mb-6 bg-white/5 p-3 rounded-2xl border border-white/10 max-w-fit">
                <div class="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span class="text-base">★</span>
                  <span class="text-white text-base">${m.vote_average}</span>
                  <span class="text-gray-400 font-normal">/ 10</span>
                </div>
                <div class="h-4 w-px bg-white/20"></div>
                <div class="text-gray-300">
                  <span class="font-bold text-white">${(m.vote_count || 0).toLocaleString()}</span> reviews
                </div>
                <div class="h-4 w-px bg-white/20"></div>
                <div>Director: <span class="font-semibold text-white">${m.director || 'Christopher Nolan'}</span></div>
              </div>

              <!-- Synopsis -->
              <div class="mb-8">
                <h3 class="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Overview</h3>
                <p class="text-sm md:text-base text-gray-200/90 leading-relaxed max-w-3xl">
                  ${m.overview}
                </p>
              </div>

              <!-- Action Buttons (Write Review, Watchlist, Trailer) -->
              <div class="flex flex-wrap items-center gap-3 mb-10">
                
                <button 
                  id="open-review-modal-btn"
                  class="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Write a Review</span>
                </button>

                <button 
                  id="detail-watchlist-btn"
                  class="px-6 py-3 rounded-full cinema-glass hover:bg-white/15 text-white font-medium text-xs sm:text-sm tracking-wide border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${isInWatchlist ? 'bg-red-600/40 border-red-500/50' : ''}"
                >
                  <svg class="w-4 h-4 ${isInWatchlist ? 'text-red-500 fill-red-500' : 'text-gray-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  <span>${isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                <button 
                  id="detail-trailer-btn"
                  class="px-6 py-3 rounded-full cinema-glass hover:bg-white/15 text-white font-medium text-xs sm:text-sm tracking-wide border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>
                  <span>Watch Trailer</span>
                </button>

              </div>

              <!-- Multi-Source Ratings Breakdown & Popcorn Bucket Motif (Matching Mockup) -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 cinema-glass p-6 rounded-2xl border border-white/10 items-center">
                
                <!-- Ratings Distribution Bars (Col 7) -->
                <div class="md:col-span-7">
                  <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Multi-Source Verification</h4>
                  
                  <div class="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div class="bg-black/40 p-2.5 rounded-xl border border-red-500/20">
                      <div class="text-[10px] text-gray-400 font-bold uppercase">CineVerse</div>
                      <div class="text-base font-extrabold text-amber-400 mt-0.5">4.6 <span class="text-xs font-normal text-gray-400">/ 5</span></div>
                    </div>
                    <div class="bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div class="text-[10px] text-gray-400 font-bold uppercase">TMDB Verified</div>
                      <div class="text-base font-extrabold text-white mt-0.5">${m.vote_average} <span class="text-xs font-normal text-gray-400">/ 10</span></div>
                    </div>
                    <div class="bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div class="text-[10px] text-gray-400 font-bold uppercase">Licensed Media</div>
                      <div class="text-base font-extrabold text-white mt-0.5">4.3 <span class="text-xs font-normal text-gray-400">/ 5</span></div>
                    </div>
                  </div>

                  <!-- Star Bars -->
                  <div class="flex flex-col gap-1 text-[11px] text-gray-400">
                    <div class="flex items-center gap-2">
                      <span class="w-6">5 ★</span>
                      <div class="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400 rounded-full" style="width: 78%"></div>
                      </div>
                      <span class="w-8 text-right">78%</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-6">4 ★</span>
                      <div class="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400/80 rounded-full" style="width: 14%"></div>
                      </div>
                      <span class="w-8 text-right">14%</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-6">3 ★</span>
                      <div class="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400/50 rounded-full" style="width: 5%"></div>
                      </div>
                      <span class="w-8 text-right">5%</span>
                    </div>
                  </div>

                </div>

                <!-- Cinema Popcorn Bucket Graphic (Col 5) -->
                <div class="md:col-span-5 flex flex-col items-center justify-center p-2 border-t md:border-t-0 md:border-l border-white/10">
                  <div class="relative w-24 h-28 flex flex-col items-center">
                    <!-- Popcorn Top -->
                    <div class="flex items-center justify-center gap-1 mb-1">
                      <span class="text-xl">🍿</span>
                    </div>
                    <!-- Bucket Body -->
                    <div class="w-20 h-20 bg-gradient-to-b from-red-600 to-red-800 rounded-b-xl border-2 border-red-500 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                      <div class="absolute inset-0 flex">
                        <div class="flex-1 bg-white/20"></div>
                        <div class="flex-1"></div>
                        <div class="flex-1 bg-white/20"></div>
                        <div class="flex-1"></div>
                      </div>
                      <span class="font-cinematic font-black text-[10px] text-white tracking-widest relative z-10">POPCORN</span>
                    </div>
                  </div>
                  <span class="text-[11px] text-gray-400 font-semibold mt-2">Certified Fresh Popcorn</span>
                </div>

              </div>

            </div>

          </div>

          <!-- Featured Cast Carousel -->
          ${m.cast && m.cast.length ? `
            <div class="mb-16">
              <h3 class="font-cinematic text-xl md:text-2xl font-bold text-white mb-6">
                Featured Cast & Crew
              </h3>
              <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                ${m.cast.map(c => `
                  <div class="flex-shrink-0 w-28 md:w-32 text-center group">
                    <div class="aspect-square w-full rounded-2xl overflow-hidden mb-2 border border-white/10 group-hover:border-red-500 transition-colors shadow-lg">
                      <img src="${c.profile_path}" alt="${c.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div class="font-bold text-xs text-white truncate">${c.name}</div>
                    <div class="text-[11px] text-gray-400 truncate">${c.character}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- User Reviews Section (Matching Design Mockup) -->
          <div class="mb-16">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 class="font-cinematic text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                  <span>User Reviews</span>
                  <span id="reviews-count-badge" class="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 font-sans text-xs font-bold tracking-wide">
                    ${((this.reviews ? this.reviews.length : 0) + (this.movie && this.movie.external_reviews ? this.movie.external_reviews.length : 0))} Reviews
                  </span>
                </h3>
                <p class="text-xs text-gray-400 mt-1">Verified impressions from CineVerse patrons and TMDB members</p>
              </div>

              <!-- Review Filter Tabs (All, Positive, Critical, Recent) -->
              <div class="flex items-center gap-1 cinema-glass p-1 rounded-xl border border-white/10 text-xs">
                ${["all", "positive", "critical", "recent"].map(tab => `
                  <button 
                    class="review-tab-btn px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${this.activeReviewTab === tab ? 'bg-red-600 text-white font-bold shadow' : 'text-gray-400 hover:text-white'}"
                    data-tab="${tab}"
                  >
                    ${tab}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Review Cards List -->
            <div class="flex flex-col gap-4" id="reviews-list-container">
              ${this.renderReviewsList()}
            </div>

          </div>

        </div>

        <!-- Write Review Modal -->
        <div id="write-review-modal" class="fixed inset-0 z-50 hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div class="cinema-glass w-full max-w-lg rounded-2xl border border-white/20 p-6 shadow-2xl relative">
            <button class="absolute top-4 right-4 text-gray-400 hover:text-white" id="close-review-modal-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h3 class="font-cinematic text-xl font-bold text-white mb-1">Write Your Review</h3>
            <p class="text-xs text-gray-400 mb-4">for <span class="text-white font-bold">${m.title}</span></p>

            <form id="write-review-form" class="flex flex-col gap-4">
              <!-- Star Rating Input -->
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-2">Rating</label>
                <div class="flex items-center gap-2" id="star-rating-selector">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <button type="button" class="star-select-btn text-2xl text-gray-600 hover:text-amber-400 transition-colors" data-rating="${star}">★</button>
                  `).join('')}
                  <span id="selected-rating-val" class="ml-2 font-bold text-amber-400 text-sm">5.0 / 5.0</span>
                </div>
              </div>

              <!-- Review Textarea -->
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Review</label>
                <textarea 
                  id="review-text-input" 
                  rows="4" 
                  placeholder="Share your cinema impression, direction notes, cinematography, and emotional impact..." 
                  required 
                  class="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                ></textarea>
              </div>

              <!-- Spoiler Warning Checkbox -->
              <div class="flex items-center gap-2">
                <input type="checkbox" id="review-spoiler-input" class="rounded bg-black/60 border-white/20 text-red-600 focus:ring-red-500" />
                <label for="review-spoiler-input" class="text-xs text-gray-300">Contains Plot Spoilers (Will be shielded behind spoiler warning)</label>
              </div>

              <button type="submit" class="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/30">
                Publish Review
              </button>
            </form>
          </div>
        </div>

      </div>
    `;
  },

  renderReviewsList() {
    let combined = [];

    // Native CineVerse reviews
    if (this.reviews && this.reviews.length) {
      this.reviews.forEach(r => {
        combined.push({
          id: r.id,
          author: r.user_name,
          username: r.user_username,
          avatar: r.user_avatar,
          rating: r.rating,
          content: r.review_text,
          has_spoilers: r.has_spoilers,
          likes: r.likes_count,
          source: "CineVerse Verified User",
          source_url: null,
          created_at: r.created_at,
          is_native: true
        });
      });
    }

    // Live External TMDB reviews
    if (this.movie && this.movie.external_reviews && this.movie.external_reviews.length) {
      this.movie.external_reviews.forEach(er => {
        let av = er.avatar || (er.author_details ? er.author_details.avatar_path : null) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
        let rat = er.rating || (er.author_details && er.author_details.rating ? er.author_details.rating / 2.0 : 4.5);
        combined.push({
          id: er.id,
          author: er.author,
          username: er.username || (er.author_details ? er.author_details.username : er.author),
          avatar: av,
          rating: rat,
          content: er.content,
          has_spoilers: false,
          likes: er.likes || 140,
          source: er.source || "TMDB Verified Member",
          source_url: er.source_url,
          created_at: er.created_at,
          is_native: false
        });
      });
    }

    // Apply Filter Tab
    if (this.activeReviewTab === "positive") {
      combined = combined.filter(r => r.rating >= 4.0);
    } else if (this.activeReviewTab === "critical") {
      combined = combined.filter(r => r.rating <= 3.5);
    } else if (this.activeReviewTab === "recent") {
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const badge = document.getElementById("reviews-count-badge");
    if (badge) badge.textContent = `${combined.length} Reviews`;

    this.currentReviews = combined;

    if (!combined.length) {
      return `<div class="cinema-glass p-8 rounded-2xl text-center text-sm text-gray-400">No reviews found for this filter tab. Be the first to publish a review!</div>`;
    }

    return combined.map((rev, revIdx) => {
      const isLong = rev.content && rev.content.length > 360;
      const previewText = isLong ? rev.content.substring(0, 340) + '...' : rev.content;

      return `
      <div class="cinema-glass p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col gap-3">
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${rev.avatar}" alt="${this.escapeHtml(rev.author)}" class="w-10 h-10 rounded-full object-cover border border-amber-400/40" />
            <div>
              <div class="text-sm font-bold text-white flex items-center gap-2">
                <span>${this.escapeHtml(rev.author)}</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">${this.escapeHtml(rev.source)}</span>
              </div>
              <div class="text-[11px] text-gray-400">
                ${new Date(rev.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div class="text-amber-400 text-sm font-bold flex items-center gap-1">
            <span>★</span>
            <span>${rev.rating}</span>
          </div>
        </div>

        <!-- Review Body with Spoiler Shielding & Read More -->
        ${rev.has_spoilers ? `
          <div id="spoiler-box-${revIdx}" class="spoiler-wrapper bg-black/60 p-4 rounded-xl border border-red-500/30 text-center">
            <div class="text-xs text-red-400 font-bold uppercase mb-2">⚠️ Review Contains Major Spoilers</div>
            <button 
              type="button"
              class="reveal-spoiler-btn px-4 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-white text-xs font-semibold transition-all cursor-pointer"
              onclick="MovieDetailView.revealSpoiler(${revIdx});"
            >
              SPOILER — Reveal Review
            </button>
          </div>
        ` : (isLong ? `
          <div class="review-content-wrap">
            <p class="text-xs md:text-sm text-gray-200 leading-relaxed whitespace-pre-line" id="rev-text-${revIdx}">${this.escapeHtml(previewText)}</p>
            <button 
              type="button"
              class="text-xs text-red-400 hover:text-red-300 font-semibold mt-2 inline-flex items-center gap-1 cursor-pointer"
              id="rev-btn-${revIdx}"
              onclick="MovieDetailView.toggleReview(${revIdx});"
              data-expanded="false"
            >
              Read Full Review ↓
            </button>
          </div>
        ` : `
          <p class="text-xs md:text-sm text-gray-200 leading-relaxed whitespace-pre-line">${this.escapeHtml(rev.content)}</p>
        `)}

        <!-- Footer / Interaction (Likes & Source Link) -->
        <div class="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-gray-400">
          <div class="flex items-center gap-4">
            <button 
              type="button"
              class="review-like-btn flex items-center gap-1.5 hover:text-red-400 transition-colors"
              data-review-id="${rev.id}"
              data-is-native="${rev.is_native}"
            >
              <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>
              <span class="like-count font-semibold">${(rev.likes || 0).toLocaleString()}</span>
            </button>
            <span>Helpful</span>
          </div>

          ${rev.source_url ? `
            <a href="${rev.source_url}" target="_blank" rel="noopener noreferrer" class="hover:text-white flex items-center gap-1">
              <span>Original on TMDB</span>
              <span>↗</span>
            </a>
          ` : ''}
        </div>

      </div>
      `;
    }).join('');
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  revealSpoiler(idx) {
    const rev = this.currentReviews && this.currentReviews[idx];
    if (!rev) return;
    const box = document.getElementById(`spoiler-box-${idx}`);
    if (box) {
      box.outerHTML = `
        <p class="text-xs md:text-sm text-gray-200 leading-relaxed border-l-2 border-red-500 pl-3 py-1 whitespace-pre-line">
          ${this.escapeHtml(rev.content)}
        </p>
      `;
    }
  },

  toggleReview(idx) {
    const rev = this.currentReviews && this.currentReviews[idx];
    if (!rev) return;
    const textEl = document.getElementById(`rev-text-${idx}`);
    const btnEl = document.getElementById(`rev-btn-${idx}`);
    if (!textEl || !btnEl) return;

    const isExpanded = btnEl.getAttribute("data-expanded") === "true";
    if (isExpanded) {
      const isLong = rev.content && rev.content.length > 360;
      const previewText = isLong ? rev.content.substring(0, 340) + '...' : rev.content;
      textEl.textContent = previewText;
      btnEl.innerHTML = `Read Full Review ↓`;
      btnEl.setAttribute("data-expanded", "false");
    } else {
      textEl.textContent = rev.content;
      btnEl.innerHTML = `Show Less ↑`;
      btnEl.setAttribute("data-expanded", "true");
    }
  },

  attachReviewEvents() {
    document.querySelectorAll(".review-like-btn").forEach(btn => {
      btn.onclick = async () => {
        const id = parseInt(btn.getAttribute("data-review-id"), 10);
        const isNative = btn.getAttribute("data-is-native") === 'true';

        CinemaAudio.playStarDing();

        if (isNative && !isNaN(id)) {
          try {
            const res = await API.voteReview(id, 'like');
            const countSpan = btn.querySelector(".like-count");
            if (countSpan && res.likes_count !== undefined) {
              countSpan.textContent = res.likes_count.toLocaleString();
            }
          } catch (e) {
            console.warn("Could not vote review:", e);
          }
        } else {
          // Increment visually for TMDB reviews
          const countSpan = btn.querySelector(".like-count");
          if (countSpan) {
            let num = parseInt(countSpan.textContent.replace(/,/g, ''), 10) || 0;
            countSpan.textContent = (num + 1).toLocaleString();
          }
        }
      };
    });
  },

  attachEvents() {
    Card3D.init();

    // Trailer Button
    const trailerBtn = document.getElementById("detail-trailer-btn");
    if (trailerBtn && this.movie) {
      trailerBtn.addEventListener("click", () => {
        TrailerModal.open(this.movie.trailer_key, this.movie.title);
      });
    }

    // Watchlist Toggle
    const watchlistBtn = document.getElementById("detail-watchlist-btn");
    if (watchlistBtn && this.movie) {
      watchlistBtn.addEventListener("click", async () => {
        CinemaAudio.playTicketTear();
        const isIn = State.watchlistIds && State.watchlistIds.has(this.movie.id);
        if (isIn) {
          await API.removeFromWatchlist(this.movie.id);
          State.watchlistIds.delete(this.movie.id);
          watchlistBtn.innerHTML = `
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            <span>Add to Watchlist</span>
          `;
          watchlistBtn.classList.remove("bg-red-600/40", "border-red-500/50");
          State.toast(`Removed "${this.movie.title}" from Watchlist`);
        } else {
          await API.addToWatchlist({
            movie_id: this.movie.id,
            movie_title: this.movie.title,
            poster_path: this.movie.poster_path,
            backdrop_path: this.movie.backdrop_path,
            vote_average: this.movie.vote_average,
            release_date: this.movie.release_date,
            genres: this.movie.genres ? this.movie.genres.map(g => g.name).join(', ') : '',
            status: "want_to_watch"
          });
          if (State.watchlistIds && State.watchlistIds.add) State.watchlistIds.add(this.movie.id);
          watchlistBtn.innerHTML = `
            <svg class="w-4 h-4 text-red-500 fill-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            <span>In Watchlist</span>
          `;
          watchlistBtn.classList.add("bg-red-600/40", "border-red-500/50");
          State.toast(`Added "${this.movie.title}" to your Watchlist!`, "success");
        }
      });
    }

    // Review Tab Switching
    document.querySelectorAll(".review-tab-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        this.activeReviewTab = btn.getAttribute("data-tab");
        document.querySelectorAll(".review-tab-btn").forEach(b => {
          b.className = "review-tab-btn px-3 py-1.5 rounded-lg capitalize font-medium transition-all text-gray-400 hover:text-white";
        });
        btn.className = "review-tab-btn px-3 py-1.5 rounded-lg capitalize font-medium transition-all bg-red-600 text-white font-bold shadow";
        
        try {
          this.reviews = await API.getReviews(this.movie.id, this.activeReviewTab);
        } catch (e) {
          console.warn("Could not reload reviews:", e);
        }
        const list = document.getElementById("reviews-list-container");
        if (list) {
          list.innerHTML = this.renderReviewsList();
          this.attachReviewEvents();
        }
      });
    });

    // Write Review Modal Logic
    const openRevBtn = document.getElementById("open-review-modal-btn");
    const revModal = document.getElementById("write-review-modal");
    const closeRevBtn = document.getElementById("close-review-modal-btn");
    const revForm = document.getElementById("write-review-form");
    let currentSelectedRating = 5.0;

    if (openRevBtn && revModal) {
      openRevBtn.addEventListener("click", () => revModal.classList.remove("hidden"));
    }
    if (closeRevBtn && revModal) {
      closeRevBtn.addEventListener("click", () => revModal.classList.add("hidden"));
    }

    // Star selector buttons
    document.querySelectorAll(".star-select-btn").forEach(starBtn => {
      starBtn.addEventListener("click", () => {
        const rating = parseInt(starBtn.getAttribute("data-rating"), 10);
        currentSelectedRating = rating;
        CinemaAudio.playStarDing();
        document.getElementById("selected-rating-val").textContent = `${rating}.0 / 5.0`;

        document.querySelectorAll(".star-select-btn").forEach((s, idx) => {
          if (idx < rating) {
            s.className = "star-select-btn text-2xl text-amber-400 transition-colors";
          } else {
            s.className = "star-select-btn text-2xl text-gray-600 hover:text-amber-400 transition-colors";
          }
        });
      });
    });

    if (revForm) {
      revForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = document.getElementById("review-text-input").value.trim();
        const hasSpoilers = document.getElementById("review-spoiler-input").checked;

        try {
          await API.submitReview({
            movie_id: this.movie.id,
            movie_title: this.movie.title,
            poster_path: this.movie.poster_path,
            rating: currentSelectedRating,
            review_text: text,
            has_spoilers: hasSpoilers
          });

          revModal.classList.add("hidden");
          State.toast("Review published to CineVerse!", "success");

          // Reload reviews
          this.reviews = await API.getReviews(this.movie.id, this.activeReviewTab);
          const list = document.getElementById("reviews-list-container");
          if (list) {
            list.innerHTML = this.renderReviewsList();
            this.attachReviewEvents();
          }
        } catch (err) {
          console.error("Submit review error:", err);
          State.toast("Could not submit review. Please try again.", "error");
        }
      });
    }

    // Initial review like event attachment
    this.attachReviewEvents();
  }
};

window.MovieDetailView = MovieDetailView;
