// CineVerse Hero Cinema Screen Component

const HeroScreen = {
  render(movie) {
    if (!movie) return '';

    return `
      <section class="relative min-h-[92vh] flex flex-col justify-between pt-20 pb-0 overflow-hidden bg-black select-none">
        
        <!-- Overhead Projector Dust Canvas -->
        <canvas id="projector-dust-canvas" class="absolute inset-0 z-10 pointer-events-none w-full h-full"></canvas>

        <!-- Projector Volumetric Light Beam -->
        <div class="projector-beam"></div>

        <!-- Left Red Velvet Curtain Frame -->
        <div class="curtain-panel curtain-left hidden lg:block"></div>

        <!-- Right Red Velvet Curtain Frame -->
        <div class="curtain-panel curtain-right hidden lg:block"></div>

        <!-- Left Neon Sign on Acoustic Wall -->
        <div class="absolute left-6 xl:left-12 top-48 hidden xl:flex flex-col items-center gap-1 z-20 pointer-events-none opacity-85">
          <div class="border border-amber-500/40 p-4 rounded-xl bg-black/60 shadow-2xl backdrop-blur-sm transform -rotate-3">
            <span class="neon-amber font-cinematic font-bold text-sm tracking-widest leading-relaxed text-center block">
              GOOD<br/>FILMS<br/>BETTER<br/>PEOPLE
            </span>
          </div>
        </div>

        <!-- Right Neon Sign on Acoustic Wall -->
        <div class="absolute right-6 xl:right-12 top-48 hidden xl:flex flex-col items-center gap-1 z-20 pointer-events-none opacity-85">
          <div class="border border-amber-500/40 p-4 rounded-xl bg-black/60 shadow-2xl backdrop-blur-sm transform rotate-3">
            <span class="neon-amber font-cinematic font-bold text-sm tracking-widest leading-relaxed text-center block">
              MOVIES<br/>FEEL<br/>DIFFERENT<br/>HERE →
            </span>
          </div>
        </div>

        <!-- Center Stage: Cinema Curved Screen -->
        <div class="relative z-20 max-w-6xl w-full mx-auto px-4 mt-6 md:mt-10">
          
          <!-- Cinema Screen Bezel Container -->
          <div class="cinema-screen-curve aspect-[16/9] md:aspect-[21/9] w-full relative shadow-[0_0_90px_rgba(229,9,20,0.25)] border-4 border-[#1c1c24]">
            
            <!-- Ken Burns Background Backdrop -->
            <img 
              src="${movie.backdrop_path}" 
              alt="${movie.title}" 
              class="w-full h-full object-cover animate-kenburns opacity-75"
            />

            <!-- Screen Gradient & Ambient Vignette -->
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
            <div class="cinema-screen-glow"></div>

            <!-- Featured Movie Typography Overlay -->
            <div class="absolute bottom-6 md:bottom-12 left-6 md:left-14 max-w-xl z-20">
              
              <!-- #1 Trending Badge -->
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-bold tracking-wide uppercase mb-3 backdrop-blur-md">
                <svg class="w-3.5 h-3.5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.316.492-.533 1.05-.662 1.638-.13.588-.168 1.2-.11 1.802.057.603.208 1.196.444 1.764.236.568.56 1.096.953 1.564.393.468.865.867 1.393 1.18.528.312 1.11.536 1.716.662.607.126 1.23.15 1.84.07.61-.08 1.2-.26 1.745-.535a1 1 0 00.548-1.192 6.96 6.96 0 01-.444-1.764c-.058-.602-.02-1.214.11-1.802.13-.588.346-1.146.662-1.638.208-.322.477-.65.822-.88a1 1 0 00-.385-1.835c-.61-.08-1.23-.056-1.84.07-.606.126-1.188.35-1.716.662-.528.313-1 .712-1.393 1.18-.393.468-.717.996-.953 1.564a6.96 6.96 0 01-.444 1.764z" clip-rule="evenodd"/>
                </svg>
                <span>#1 Trending This Week</span>
              </div>

              <!-- Movie Title -->
              <h1 class="font-cinematic text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-wider uppercase drop-shadow-2xl">
                ${movie.title}
              </h1>

              <!-- Rating & Reviews Count -->
              <div class="flex items-center gap-3 my-2 text-sm text-gray-300">
                <span class="text-amber-400 font-bold flex items-center gap-1">
                  ★ ${movie.vote_average}
                </span>
                <span class="text-gray-400">(${movie.vote_count.toLocaleString()} verified ratings)</span>
                <span>·</span>
                <span class="text-gray-300">${movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Drama'}</span>
              </div>

              <!-- Synopsis -->
              <p class="text-xs sm:text-sm text-gray-300/90 line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed">
                ${movie.overview}
              </p>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-3">
                <a 
                  href="#/movie/${movie.id}" 
                  class="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  <span>Read Reviews</span>
                </a>

                <button 
                  id="hero-watch-trailer-btn"
                  data-trailer="${movie.trailer_key}"
                  data-title="${movie.title}"
                  class="px-6 py-2.5 rounded-full cinema-glass hover:bg-white/15 text-white font-medium text-xs sm:text-sm tracking-wide border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>
                  <span>Watch Trailer</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        <!-- Cinema Auditorium Plush Red Seats in Foreground (Matching Image) -->
        <div class="relative z-30 w-full mt-4 md:mt-8 overflow-hidden pointer-events-none">
          
          <!-- Floor Aisle Lights -->
          <div class="max-w-4xl mx-auto flex justify-between px-12 mb-2">
            <div class="aisle-led"></div>
            <div class="aisle-led"></div>
            <div class="aisle-led"></div>
            <div class="aisle-led"></div>
          </div>

          <!-- Auditorium Seat Rows -->
          <div class="theatre-seat-row scale-75 md:scale-90 lg:scale-100 opacity-90">
            ${Array(22).fill(0).map(() => `<div class="theatre-seat"></div>`).join('')}
          </div>
          
          <!-- Secondary Closer Seat Row -->
          <div class="theatre-seat-row -mt-3 scale-90 md:scale-100 lg:scale-110 opacity-70">
            ${Array(26).fill(0).map(() => `<div class="theatre-seat"></div>`).join('')}
          </div>

          <!-- Bottom Fade into Page Content -->
          <div class="h-10 bg-gradient-to-b from-transparent to-[#050505]"></div>
        </div>

      </section>
    `;
  },

  attachEvents() {
    ProjectorCanvas.init("projector-dust-canvas");

    const trailerBtn = document.getElementById("hero-watch-trailer-btn");
    if (trailerBtn) {
      trailerBtn.addEventListener("click", () => {
        const key = trailerBtn.getAttribute("data-trailer");
        const title = trailerBtn.getAttribute("data-title");
        TrailerModal.open(key, title);
      });
    }
  }
};

window.HeroScreen = HeroScreen;
