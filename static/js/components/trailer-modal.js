// CineVerse Projector Trailer Video Modal

const TrailerModal = {
  element: null,

  init() {
    let el = document.getElementById("trailer-modal-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "trailer-modal-container";
      el.className = "fixed inset-0 z-50 hidden bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8";
      document.body.appendChild(el);
    }
    this.element = el;
  },

  open(youtubeKey, title = "Official Trailer") {
    this.init();
    CinemaAudio.playCurtainWhoosh();

    const embedUrl = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0&modestbranding=1`;

    this.element.innerHTML = `
      <div class="relative w-full max-w-5xl rounded-3xl overflow-hidden cinema-screen-curve border-4 border-[#24242e] shadow-[0_0_120px_rgba(229,9,20,0.35)] bg-black">
        
        <!-- Overhead Projector Cone Light -->
        <div class="projector-beam opacity-60"></div>

        <!-- Header Bar -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent absolute top-0 left-0 right-0 z-20">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span class="font-cinematic font-bold text-white text-sm tracking-wider uppercase">${title} · Official Preview</span>
          </div>
          <button id="close-trailer-btn" class="w-9 h-9 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Video Player Iframe (16:9 Cinema Aspect) -->
        <div class="aspect-video w-full relative z-10 bg-black">
          <iframe 
            src="${embedUrl}" 
            title="${title}" 
            class="w-full h-full border-0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>

        <!-- Cinema Screen Floor Ambient Reflection -->
        <div class="h-4 bg-gradient-to-t from-red-600/10 to-transparent"></div>
      </div>
    `;

    this.element.classList.remove("hidden");

    document.getElementById("close-trailer-btn").addEventListener("click", () => this.close());
    this.element.addEventListener("click", (e) => {
      if (e.target === this.element) this.close();
    });
  },

  close() {
    if (this.element) {
      this.element.innerHTML = "";
      this.element.classList.add("hidden");
    }
  }
};

window.TrailerModal = TrailerModal;
