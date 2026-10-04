// CineVerse Box Office "TICKETS" Auth Modal (Matching Reference Mockup)

const TicketBoothModal = {
  element: null,
  isRegister: false,

  init() {
    let el = document.getElementById("ticket-booth-modal-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "ticket-booth-modal-container";
      el.className = "fixed inset-0 z-50 hidden bg-black/90 backdrop-blur-xl flex items-center justify-center p-4";
      document.body.appendChild(el);
    }
    this.element = el;
  },

  open() {
    this.init();
    CinemaAudio.playTicketTear();

    this.element.innerHTML = `
      <div class="relative w-full max-w-md cinema-glass rounded-3xl border border-white/20 p-6 md:p-8 shadow-[0_0_80px_rgba(229,9,20,0.3)] bg-[#0b0b0f] overflow-hidden">
        
        <!-- Glowing Red Neon TICKETS Marquee Header -->
        <div class="text-center mb-6">
          <div class="inline-block px-4 py-1 rounded-lg border border-red-500/50 bg-black/80 shadow-[0_0_20px_rgba(229,9,20,0.4)] mb-3">
            <span class="neon-red font-cinematic font-black text-xs md:text-sm tracking-widest uppercase">
              ★ TICKETS ★
            </span>
          </div>

          <h2 class="font-cinematic text-2xl md:text-3xl font-black text-white tracking-wider">
            Cine<span class="text-red-500">Verse</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1">Be part of the story.</p>
        </div>

        <!-- Close Button -->
        <button id="close-booth-btn" class="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- 1-Click Fast Profile Switcher -->
        <div class="mb-5 bg-black/40 p-3 rounded-2xl border border-white/10">
          <div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Instant Patron Sign-In:</span>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button class="quick-user-btn bg-white/10 hover:bg-red-600 text-white p-2 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center gap-1 cursor-pointer" data-email="surya@cineverse.io">
              <span class="font-bold truncate">Surya</span>
              <span class="text-[10px] text-gray-300 font-normal">Critic</span>
            </button>
            <button class="quick-user-btn bg-white/10 hover:bg-red-600 text-white p-2 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center gap-1 cursor-pointer" data-email="cineaddict@cineverse.io">
              <span class="font-bold truncate">CineAddict</span>
              <span class="text-[10px] text-gray-300 font-normal">Patron</span>
            </button>
            <button class="quick-user-btn bg-white/10 hover:bg-red-600 text-white p-2 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center gap-1 cursor-pointer" data-email="alex@cineverse.io">
              <span class="font-bold truncate">Alex R.</span>
              <span class="text-[10px] text-gray-300 font-normal">Analyst</span>
            </button>
          </div>
        </div>

        <!-- Auth Form -->
        <form id="booth-auth-form" class="flex flex-col gap-3.5">
          ${this.isRegister ? `
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">Your Full Name</label>
              <input type="text" id="auth-name" placeholder="e.g. Christopher" required class="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
            </div>
          ` : ''}

          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Email address</label>
            <input type="email" id="auth-email" placeholder="name@cinema.com" required value="surya@cineverse.io" class="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <input type="password" id="auth-password" placeholder="••••••••" required value="password123" class="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>

          <button type="submit" class="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/40 hover:scale-[1.02] active:scale-95 cursor-pointer mt-1">
            ${this.isRegister ? 'Create Cinema Pass' : 'Sign In'}
          </button>
        </form>

        <!-- Social Auth Dividers -->
        <div class="relative my-5 text-center">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/10"></div></div>
          <span class="relative bg-[#0b0b0f] px-3 text-[11px] text-gray-400">or continue with</span>
        </div>

        <!-- Social Icons (Google, Apple, Discord) -->
        <div class="flex items-center justify-center gap-3">
          <button class="social-login-btn w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer" data-provider="Google">
            <span class="font-bold text-sm">G</span>
          </button>
          <button class="social-login-btn w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer" data-provider="Apple">
            <span class="font-bold text-sm"></span>
          </button>
          <button class="social-login-btn w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer" data-provider="Discord">
            <span class="font-bold text-sm">⚔</span>
          </button>
        </div>

        <!-- Toggle Sign In / Sign Up -->
        <div class="text-center mt-5 text-xs text-gray-400">
          ${this.isRegister ? 'Already hold a ticket? ' : "Don't have an account? "}
          <button id="toggle-auth-mode-btn" class="text-red-400 font-bold hover:underline cursor-pointer">
            ${this.isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </div>
    `;

    this.element.classList.remove("hidden");
    this.attachEvents();
  },

  attachEvents() {
    const closeBtn = document.getElementById("close-booth-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
    this.element.addEventListener("click", (e) => {
      if (e.target === this.element) this.close();
    });

    const toggleModeBtn = document.getElementById("toggle-auth-mode-btn");
    if (toggleModeBtn) {
      toggleModeBtn.addEventListener("click", () => {
        this.isRegister = !this.isRegister;
        this.open();
      });
    }

    // Quick user selection
    document.querySelectorAll(".quick-user-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const email = btn.getAttribute("data-email");
        const res = await API.login(email);
        State.switchUser(res.user);
        CinemaAudio.playStarDing();
        State.toast(`Welcome back to CineVerse, ${res.user.full_name}!`, "success");
        this.close();
      });
    });

    // Form submit
    const form = document.getElementById("booth-auth-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("auth-email").value.trim();
        const res = await API.login(email);
        State.switchUser(res.user);
        CinemaAudio.playStarDing();
        State.toast(`Welcome back, ${res.user.full_name}!`, "success");
        this.close();
      });
    }

    // Social buttons
    document.querySelectorAll(".social-login-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const provider = btn.getAttribute("data-provider");
        State.toast(`Connected with ${provider} ticket authentication!`, "success");
        this.close();
      });
    });
  },

  close() {
    if (this.element) {
      this.element.innerHTML = "";
      this.element.classList.add("hidden");
    }
  }
};

window.TicketBoothModal = TicketBoothModal;
