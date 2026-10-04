// CineVerse "NOW SHOWING" Dynamic 3D Interactive Carousel with Cursor Parallax & Pull-Drag

const Carousel3D = {
  movies: [],
  currentIndex: 2,
  
  // Interactive Physics State
  hoverX: 0,
  hoverY: 0,
  targetHoverX: 0,
  targetHoverY: 0,
  
  isDragging: false,
  dragStartX: 0,
  dragCurrentX: 0,
  dragOffset: 0,
  dragVelocity: 0,
  lastDragX: 0,
  lastDragTime: 0,
  
  rafId: null,
  stageEl: null,

  render(movies) {
    this.movies = movies || [];
    if (!this.movies.length) return '';

    return `
      <section class="relative py-14 px-4 max-w-7xl mx-auto overflow-hidden select-none" id="carousel-section">
        
        <!-- Section Header -->
        <div class="text-center mb-8 pointer-events-none">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-semibold tracking-widest uppercase mb-2 border border-red-500/30">
            Cinema Theatre Showcase
          </div>
          <h2 class="font-cinematic text-3xl md:text-5xl font-extrabold text-white tracking-wider">
            NOW SHOWING
          </h2>
          <p class="text-gray-400 text-xs md:text-sm mt-1 flex items-center justify-center gap-2">
            <span>Pull or move your cursor across the plates to rotate the films</span>
            <span class="text-red-500 animate-pulse hidden sm:inline">↔</span>
          </p>
        </div>

        <!-- 3D Carousel Stage -->
        <div class="relative min-h-[460px] md:min-h-[540px] flex items-center justify-center perspective-[1400px]">
          
          <div 
            id="carousel-stage" 
            class="relative w-full max-w-5xl h-[420px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing transition-cursor"
            style="transform-style: preserve-3d;"
          >
            ${this.renderInitialCards()}
          </div>

          <!-- Left Navigation Arrow -->
          <button 
            id="carousel-prev-btn"
            class="absolute left-2 md:left-6 z-40 w-11 h-11 rounded-full cinema-glass hover:bg-red-600 text-white flex items-center justify-center border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Previous Movie"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>

          <!-- Right Navigation Arrow -->
          <button 
            id="carousel-next-btn"
            class="absolute right-2 md:right-6 z-40 w-11 h-11 rounded-full cinema-glass hover:bg-red-600 text-white flex items-center justify-center border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Next Movie"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>

        </div>

        <!-- Dot Indicators -->
        <div class="flex items-center justify-center gap-2 mt-4" id="carousel-dots">
          ${this.movies.slice(0, 7).map((_, idx) => `
            <button 
              class="carousel-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === this.currentIndex ? 'bg-red-500 w-8' : 'bg-white/30 hover:bg-white/60'}" 
              data-index="${idx}"
            ></button>
          `).join('')}
        </div>

      </section>
    `;
  },

  renderInitialCards() {
    const total = Math.min(this.movies.length, 7);
    return this.movies.slice(0, total).map((movie, idx) => {
      const isCenter = idx === this.currentIndex;
      return `
        <div 
          class="carousel-card absolute w-[240px] md:w-[280px] h-[360px] md:h-[420px] rounded-2xl overflow-hidden select-none ${isCenter ? 'ring-2 ring-red-500/80 shadow-[0_0_40px_rgba(229,9,20,0.4)]' : 'shadow-2xl'}"
          data-index="${idx}"
          data-id="${movie.id}"
          style="transform-style: preserve-3d; will-change: transform, opacity;"
        >
          <!-- Poster Image -->
          <img src="${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover select-none pointer-events-none" draggable="false" />

          <!-- Specular Glare -->
          <div class="card-glare absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200"></div>

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none"></div>

          <!-- Bottom Card Content -->
          <div class="absolute bottom-4 left-4 right-4 text-left pointer-events-auto">
            <div class="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
              <span>★ ${movie.vote_average}</span>
              <span class="text-gray-300 font-normal">${movie.release_date ? movie.release_date.substring(0, 4) : '2024'}</span>
            </div>
            <h3 class="font-cinematic text-lg md:text-xl font-bold text-white truncate drop-shadow-md">
              ${movie.title}
            </h3>
            <p class="text-xs text-gray-300 line-clamp-1 mt-0.5">
              ${movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Film'}
            </p>

            <div class="card-actions mt-3 flex items-center gap-2 transition-all duration-300 ${isCenter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}">
              <a href="#/movie/${movie.id}" class="flex-1 py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold text-center shadow-lg transition-transform active:scale-95">
                View Film
              </a>
              <button class="carousel-trailer-btn py-1.5 px-3 rounded-xl cinema-glass text-white text-xs font-medium hover:bg-white/10" data-trailer="${movie.trailer_key}" data-title="${movie.title}">
                Trailer
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  updateCardsTransforms() {
    if (!this.stageEl) return;
    const cards = this.stageEl.querySelectorAll(".carousel-card");
    const total = cards.length;
    if (!total) return;

    // Continuous virtual index based on pull/drag
    // card spacing is roughly 240px
    const cardSpacing = window.innerWidth < 768 ? 190 : 250;
    const virtualIndex = this.currentIndex - (this.dragOffset / cardSpacing);

    cards.forEach((card, idx) => {
      const u = idx - virtualIndex;
      const absU = Math.abs(u);

      // Interpolated values
      let translateX = 0;
      if (Math.abs(u) < 0.001) {
        translateX = 0;
      } else {
        // Non-linear spacing to prevent overcrowding
        const sign = u < 0 ? -1 : 1;
        translateX = sign * (Math.pow(absU, 0.88) * (window.innerWidth < 768 ? 48 : 55));
      }

      // 3D Depth
      const translateZ = Math.max(-120, 60 - absU * 55);
      const scale = Math.max(0.68, 1 - absU * 0.14);

      // 3D Angles: base plate orientation + responsive cursor tilt
      const baseRotateY = Math.max(-55, Math.min(55, -u * 28));
      const cursorTiltY = this.hoverX * 16;
      const cursorTiltX = this.hoverY * -12;
      const finalRotateY = (baseRotateY + cursorTiltY).toFixed(2);
      const finalRotateX = (cursorTiltX).toFixed(2);

      // Opacity & Layering
      let opacity = 1;
      if (absU > 2.8) {
        opacity = Math.max(0, 1 - (absU - 2.8) * 1.5);
      } else if (absU > 0.5) {
        opacity = Math.max(0.4, 1 - absU * 0.22);
      }

      const zIndex = Math.round(100 - absU * 20);

      // Apply 3D matrix
      card.style.transform = `translateX(${translateX.toFixed(1)}%) translateZ(${translateZ.toFixed(1)}px) rotateY(${finalRotateY}deg) rotateX(${finalRotateX}deg) scale(${scale.toFixed(3)})`;
      card.style.zIndex = zIndex;
      card.style.opacity = opacity.toFixed(2);
      card.style.pointerEvents = absU < 0.4 ? "pointer-events-auto" : "pointer-events-auto";

      // Border and action buttons visibility based on proximity to center
      const actionsEl = card.querySelector(".card-actions");
      if (actionsEl) {
        if (absU < 0.35) {
          actionsEl.classList.remove("opacity-0", "pointer-events-none");
          actionsEl.classList.add("opacity-100", "pointer-events-auto");
          card.classList.add("ring-2", "ring-red-500/80", "shadow-[0_0_40px_rgba(229,9,20,0.4)]");
        } else {
          actionsEl.classList.add("opacity-0", "pointer-events-none");
          actionsEl.classList.remove("opacity-100", "pointer-events-auto");
          card.classList.remove("ring-2", "ring-red-500/80", "shadow-[0_0_40px_rgba(229,9,20,0.4)]");
        }
      }

      // Specular Glare update
      const glare = card.querySelector(".card-glare");
      if (glare) {
        const glareX = ((this.hoverX + 1) / 2) * 100;
        const glareY = ((this.hoverY + 1) / 2) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 65%)`;
        glare.style.opacity = Math.max(0, 0.7 - absU * 0.4);
      }
    });
  },

  animateLoop() {
    // Smooth easing interpolation for hover
    this.hoverX += (this.targetHoverX - this.hoverX) * 0.08;
    this.hoverY += (this.targetHoverY - this.hoverY) * 0.08;

    // Smooth spring back for dragOffset when not actively dragging
    if (!this.isDragging) {
      this.dragOffset += (0 - this.dragOffset) * 0.12;
    }

    this.updateCardsTransforms();
    this.rafId = requestAnimationFrame(() => this.animateLoop());
  },

  attachEvents() {
    this.stageEl = document.getElementById("carousel-stage");
    const container = document.getElementById("carousel-section");
    if (!this.stageEl || !container) return;

    // Start Animation Loop
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.animateLoop();

    // 1. CURSOR HOVER TRACKING (The user's request: plates move according to cursor)
    const onMouseMove = (e) => {
      const rect = this.stageEl.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Normalize coordinates -1 to +1
      this.targetHoverX = Math.max(-1, Math.min(1, x / (rect.width / 2)));
      this.targetHoverY = Math.max(-1, Math.min(1, y / (rect.height / 2)));
    };

    const onMouseLeave = () => {
      this.targetHoverX = 0;
      this.targetHoverY = 0;
      if (this.isDragging) {
        this.endDrag();
      }
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // 2. PULL / DRAG GESTURE (MOUSEDOWN / TOUCHSTART)
    const startDrag = (clientX) => {
      this.isDragging = true;
      this.dragStartX = clientX;
      this.dragCurrentX = clientX;
      this.lastDragX = clientX;
      this.lastDragTime = Date.now();
      this.dragVelocity = 0;
      this.stageEl.classList.add("cursor-grabbing");
    };

    const onDragMove = (clientX) => {
      if (!this.isDragging) return;
      const now = Date.now();
      const dt = now - this.lastDragTime;
      const dx = clientX - this.lastDragX;

      if (dt > 0) {
        this.dragVelocity = dx / dt;
      }

      this.lastDragX = clientX;
      this.lastDragTime = now;
      this.dragCurrentX = clientX;
      this.dragOffset = this.dragCurrentX - this.dragStartX;
    };

    const endDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.stageEl.classList.remove("cursor-grabbing");

      const cardSpacing = window.innerWidth < 768 ? 190 : 250;
      const total = Math.min(this.movies.length, 7);

      // Determine if drag or flick crossed threshold
      if (this.dragOffset < -60 || this.dragVelocity < -0.4) {
        // Pulled Left -> Next Movie
        if (this.currentIndex < total - 1) {
          this.currentIndex++;
          CinemaAudio.playTicketTear();
        }
      } else if (this.dragOffset > 60 || this.dragVelocity > 0.4) {
        // Pulled Right -> Prev Movie
        if (this.currentIndex > 0) {
          this.currentIndex--;
          CinemaAudio.playTicketTear();
        }
      }

      this.updateDots();
    };

    this.endDrag = endDrag;

    // Mouse Listeners for Drag
    this.stageEl.addEventListener("mousedown", (e) => {
      // Don't drag if clicking trailer button or view link
      if (e.target.closest("a") || e.target.closest("button")) return;
      startDrag(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isDragging) onDragMove(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      if (this.isDragging) endDrag();
    });

    // Touch Listeners for Mobile Swipe / Pull
    this.stageEl.addEventListener("touchstart", (e) => {
      if (e.target.closest("a") || e.target.closest("button")) return;
      startDrag(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (this.isDragging && e.touches.length > 0) {
        onDragMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      if (this.isDragging) endDrag();
    });

    // 3. Arrow Buttons
    const prevBtn = document.getElementById("carousel-prev-btn");
    const nextBtn = document.getElementById("carousel-next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
        } else {
          this.currentIndex = Math.min(this.movies.length, 7) - 1;
        }
        CinemaAudio.playTicketTear();
        this.updateDots();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const total = Math.min(this.movies.length, 7);
        if (this.currentIndex < total - 1) {
          this.currentIndex++;
        } else {
          this.currentIndex = 0;
        }
        CinemaAudio.playTicketTear();
        this.updateDots();
      });
    }

    // 4. Dot Click
    document.querySelectorAll(".carousel-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        this.currentIndex = parseInt(dot.getAttribute("data-index"), 10);
        CinemaAudio.playTicketTear();
        this.updateDots();
      });
    });

    // 5. Card Click Selection (Clicking on any side card centers it)
    this.stageEl.addEventListener("click", (e) => {
      if (Math.abs(this.dragOffset) > 8) return; // ignore click if dragged

      if (e.target.closest(".carousel-trailer-btn")) {
        const btn = e.target.closest(".carousel-trailer-btn");
        TrailerModal.open(btn.getAttribute("data-trailer"), btn.getAttribute("data-title"));
        return;
      }

      const card = e.target.closest(".carousel-card");
      if (card) {
        const idx = parseInt(card.getAttribute("data-index"), 10);
        if (idx !== this.currentIndex) {
          this.currentIndex = idx;
          CinemaAudio.playTicketTear();
          this.updateDots();
        } else {
          // Clicking the centered movie card navigates directly to its film view
          if (!e.target.closest("a") && !e.target.closest("button")) {
            const movieId = card.getAttribute("data-id");
            if (movieId) {
              window.location.hash = `#/movie/${movieId}`;
            }
          }
        }
      }
    });

    // 6. Keyboard arrows
    window.addEventListener("keydown", (e) => {
      const total = Math.min(this.movies.length, 7);
      if (e.key === "ArrowLeft") {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : total - 1;
        CinemaAudio.playTicketTear();
        this.updateDots();
      } else if (e.key === "ArrowRight") {
        this.currentIndex = this.currentIndex < total - 1 ? this.currentIndex + 1 : 0;
        CinemaAudio.playTicketTear();
        this.updateDots();
      }
    });
  },

  updateDots() {
    document.querySelectorAll(".carousel-dot").forEach((dot, idx) => {
      if (idx === this.currentIndex) {
        dot.className = "carousel-dot w-8 h-2.5 rounded-full bg-red-500 transition-all duration-300";
      } else {
        dot.className = "carousel-dot w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-300";
      }
    });
  }
};

window.Carousel3D = Carousel3D;
