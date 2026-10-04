// CineVerse Settings & TMDB API Key Modal

const SettingsModal = {
  element: null,

  init() {
    let el = document.getElementById("settings-modal-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "settings-modal-container";
      el.className = "fixed inset-0 z-50 hidden bg-black/90 backdrop-blur-xl flex items-center justify-center p-4";
      document.body.appendChild(el);
    }
    this.element = el;
  },

  async open() {
    this.init();
    const status = await API.getStatus();

    this.element.innerHTML = `
      <div class="relative w-full max-w-lg cinema-glass rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl bg-[#0d0d12]">
        
        <button id="close-settings-btn" class="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>
          </div>
          <div>
            <h2 class="font-cinematic text-xl font-bold text-white">Cinema Preferences & API</h2>
            <p class="text-xs text-gray-400">Configure TMDB integration and theater ambiance.</p>
          </div>
        </div>

        <!-- Current Operating Mode -->
        <div class="bg-black/50 p-4 rounded-2xl border border-white/10 mb-5">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-gray-400 font-semibold uppercase tracking-wider">Engine Status:</span>
            <span class="px-2.5 py-0.5 rounded-full ${status.has_tmdb_key ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'} font-bold">
              ${status.mode}
            </span>
          </div>
          ${status.has_tmdb_key ? `
            <div class="text-[11px] text-gray-400 mt-2">
              Active Key: <span class="font-mono text-white">${status.masked_key}</span>
            </div>
          ` : `
            <div class="text-[11px] text-gray-400 mt-2 leading-relaxed">
              Operating on built-in authentic TMDB metadata & local search. Add your free TMDB API key below to query live millions of global cinema records!
            </div>
          `}
        </div>

        <!-- TMDB Key Form -->
        <form id="tmdb-key-form" class="mb-6">
          <label class="block text-xs font-semibold text-gray-300 mb-1">TMDB API Key (v3 Key or Read Access Token)</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              id="tmdb-key-input" 
              placeholder="Paste your TMDB API Key..." 
              class="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
            />
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-lg shadow-red-600/30 whitespace-nowrap">
              Save Key
            </button>
          </div>
          <div class="text-[10px] text-gray-500 mt-1">
            Keys are secured on the Python server. Never exposed to frontend code.
          </div>
        </form>

        <!-- Theater Toggles -->
        <div class="flex flex-col gap-3 pt-4 border-t border-white/10 text-xs">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-white">Dolby Synthesizer Audio</div>
              <div class="text-[11px] text-gray-400">Subtle film projector clicks, velvet whooshes, ticket tears</div>
            </div>
            <input type="checkbox" id="settings-audio-chk" ${State.soundEnabled ? 'checked' : ''} class="w-4 h-4 text-red-600 rounded bg-black/60 border-white/20" />
          </div>

          <div class="flex items-center justify-between mt-2">
            <div>
              <div class="font-semibold text-white">Reduced Motion Mode</div>
              <div class="text-[11px] text-gray-400">Disable 3D poster tilt and velvet curtain transitions</div>
            </div>
            <input type="checkbox" id="settings-motion-chk" ${State.reducedMotion ? 'checked' : ''} class="w-4 h-4 text-red-600 rounded bg-black/60 border-white/20" />
          </div>
        </div>

        <!-- Attribution Link -->
        <div class="mt-6 pt-4 border-t border-white/10 text-center">
          <a href="#/attribution" class="text-xs text-gray-400 hover:text-white underline">
            View TMDB Legal Attribution & Compliance Notice
          </a>
        </div>

      </div>
    `;

    this.element.classList.remove("hidden");

    document.getElementById("close-settings-btn").addEventListener("click", () => this.close());
    this.element.addEventListener("click", (e) => {
      if (e.target === this.element) this.close();
    });

    const keyForm = document.getElementById("tmdb-key-form");
    if (keyForm) {
      keyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const key = document.getElementById("tmdb-key-input").value.trim();
        const res = await API.updateTMDBKey(key);
        State.toast(res.message, "success");
        this.open();
      });
    }

    const audioChk = document.getElementById("settings-audio-chk");
    if (audioChk) {
      audioChk.addEventListener("change", (e) => {
        State.soundEnabled = e.target.checked;
        localStorage.setItem("cineverse_sound", State.soundEnabled);
        State.emit("sound:toggled", State.soundEnabled);
        if (State.soundEnabled) CinemaAudio.playStarDing();
      });
    }

    const motionChk = document.getElementById("settings-motion-chk");
    if (motionChk) {
      motionChk.addEventListener("change", (e) => {
        State.reducedMotion = e.target.checked;
        State.toast(`Reduced Motion ${State.reducedMotion ? 'Enabled' : 'Disabled'}`);
      });
    }
  },

  close() {
    if (this.element) {
      this.element.innerHTML = "";
      this.element.classList.add("hidden");
    }
  }
};

window.SettingsModal = SettingsModal;
