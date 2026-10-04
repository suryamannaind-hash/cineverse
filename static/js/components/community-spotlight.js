// CineVerse "Not just ratings. Real conversations." Section

const CommunitySpotlight = {
  render() {
    return `
      <section class="py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <!-- Left Text & Call to Action -->
          <div class="lg:col-span-5 text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-semibold tracking-widest uppercase mb-4 border border-red-500/30">
              Community Pulse
            </div>
            
            <h2 class="font-cinematic text-3xl md:text-5xl font-black text-white leading-tight">
              Not just ratings.<br/>
              <span class="text-red-500">Real conversations.</span>
            </h2>

            <p class="text-gray-400 text-sm md:text-base mt-4 mb-8 leading-relaxed max-w-md">
              Discover what passionate filmgoers and critics really think about the movies and stories you love. Honest impressions, zero algorithms.
            </p>

            <a 
              href="#/explore" 
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full cinema-glass hover:bg-white/10 text-white font-medium text-sm tracking-wide border border-white/20 transition-all hover:scale-105 active:scale-95 group shadow-xl"
            >
              <span>Explore Reviews</span>
              <svg class="w-4 h-4 text-red-500 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>

          <!-- Right Floating Frosted Glass Review Bubbles with 3D Depth -->
          <div class="lg:col-span-7 relative flex flex-col gap-4 py-8">
            
            <!-- Floating Bubble 1 -->
            <div class="floating-comment-card ml-auto max-w-md w-full cinema-glass p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
              <div class="flex items-center gap-3 mb-2.5">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="Alex Rivers" class="w-9 h-9 rounded-full object-cover border border-amber-400/40" />
                <div>
                  <div class="text-xs font-bold text-white">Alex Rivers</div>
                  <div class="text-[11px] text-gray-400">on Interstellar</div>
                </div>
                <div class="ml-auto flex text-amber-400 text-xs">
                  ★★★★★ <span class="ml-1 text-white font-semibold">4.8</span>
                </div>
              </div>
              <p class="text-xs sm:text-sm text-gray-200 italic leading-relaxed">
                "Best sci-fi movie I've watched in years. Absolute masterpiece. Zimmer's pipe organ reverberates through your soul."
              </p>
            </div>

            <!-- Floating Bubble 2 -->
            <div class="floating-comment-card mr-auto max-w-md w-full cinema-glass p-5 rounded-2xl border border-red-500/20 shadow-2xl backdrop-blur-xl -translate-y-2">
              <div class="flex items-center gap-3 mb-2.5">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80" alt="Surya" class="w-9 h-9 rounded-full object-cover border border-amber-400/40" />
                <div>
                  <div class="text-xs font-bold text-white">Surya</div>
                  <div class="text-[11px] text-gray-400">on Dune: Part Two</div>
                </div>
                <div class="ml-auto flex text-amber-400 text-xs">
                  ★★★★☆ <span class="ml-1 text-white font-semibold">4.6</span>
                </div>
              </div>
              <p class="text-xs sm:text-sm text-gray-200 italic leading-relaxed">
                "A slow burn, but the ending was totally worth it. The scale of the desert sandstorms on the cinema screen is monumental."
              </p>
            </div>

            <!-- Floating Bubble 3 -->
            <div class="floating-comment-card ml-8 max-w-md w-full cinema-glass p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
              <div class="flex items-center gap-3 mb-2.5">
                <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80" alt="CineAddict" class="w-9 h-9 rounded-full object-cover border border-amber-400/40" />
                <div>
                  <div class="text-xs font-bold text-white">CineAddict</div>
                  <div class="text-[11px] text-gray-400">on Oppenheimer</div>
                </div>
                <div class="ml-auto flex text-amber-400 text-xs">
                  ★★★★★ <span class="ml-1 text-white font-semibold">4.7</span>
                </div>
              </div>
              <p class="text-xs sm:text-sm text-gray-200 italic leading-relaxed">
                "Visually stunning and emotionally powerful. Nolan never misses. Murphy's haunted eyes stay with you long after the credits."
              </p>
            </div>

          </div>

        </div>
      </section>
    `;
  }
};

window.CommunitySpotlight = CommunitySpotlight;
