// CineVerse Application Orchestrator & Client Router

const App = {
  routes: {
    home: async () => {
      const trending = await API.getTrending();
      const heroMovie = trending[0] || null;
      const nowShowing = await API.getNowShowing();
      const popular = await API.getPopular();

      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
        ${HeroScreen.render(heroMovie)}
        ${Carousel3D.render(nowShowing)}
        ${PopularRanked.render(popular)}
        ${CommunitySpotlight.render()}
        <div id="lobby-view-wrapper">${await LobbyView.render()}</div>
        ${App.renderQuoteSection()}
        ${App.renderFooter()}
      `;

      HeroScreen.attachEvents();
      Carousel3D.attachEvents();
      PopularRanked.attachEvents();
      LobbyView.attachEvents();
    },

    explore: async () => {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
        ${await ExploreView.render()}
        ${App.renderFooter()}
      `;
      ExploreView.attachEvents();
    },

    popular: async () => {
      ExploreView.currentSort = "popularity.desc";
      await App.routes.explore();
    },

    movie: async (id) => {
      const mainContent = document.getElementById("main-content");
      if (!mainContent) return;
      try {
        mainContent.innerHTML = `
          ${await MovieDetailView.render(id)}
          ${App.renderFooter()}
        `;
        MovieDetailView.attachEvents();
      } catch (err) {
        console.error("Movie route render error:", err);
        mainContent.innerHTML = `
          <div class="pt-32 text-center py-20 px-4">
            <h2 class="font-cinematic text-3xl font-bold text-white mb-2">Cinema Projector Error</h2>
            <p class="text-gray-400 text-sm mb-6">Encountered an unexpected issue projecting this title. Please try another film.</p>
            <a href="#/explore" class="px-6 py-2.5 rounded-full bg-red-600 text-white font-semibold text-sm">Return to Explore</a>
          </div>
          ${App.renderFooter()}
        `;
      }
    },

    lobby: async () => {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
        <div class="pt-20">
          <div id="lobby-view-wrapper">${await LobbyView.render()}</div>
        </div>
        ${App.renderFooter()}
      `;
      LobbyView.attachEvents();
    },

    watchlist: async () => {
      ProfileView.activeTab = "watchlist";
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
        <div id="profile-view-wrapper">${await ProfileView.render()}</div>
        ${App.renderFooter()}
      `;
      ProfileView.attachEvents();
    },

    profile: async () => {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
        <div id="profile-view-wrapper">${await ProfileView.render()}</div>
        ${App.renderFooter()}
      `;
      ProfileView.attachEvents();
    },

    attribution: async () => {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
        ${AttributionView.render()}
        ${App.renderFooter()}
      `;
    }
  },

  renderQuoteSection() {
    return `
      <section class="py-16 px-4 text-center border-y border-white/5 bg-gradient-to-b from-black via-[#0d0709] to-black my-12">
        <div class="max-w-3xl mx-auto">
          <span class="text-3xl text-red-500 mb-2 block font-cinematic">“</span>
          <p class="font-cinematic text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-widest leading-relaxed uppercase">
            EVERY STORY DESERVES TO BE FELT.
          </p>
          <div class="h-0.5 w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto my-4"></div>
          <p class="text-xs text-amber-300 font-mono tracking-widest uppercase">
            CINEVERSE AUDITORIUM ARCHIVE
          </p>
        </div>
      </section>
    `;
  },

  renderFooter() {
    return `
      <footer class="cinema-glass border-t border-white/10 pt-16 pb-24 md:pb-12 px-4 md:px-8 mt-20">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-600/40">
                C
              </div>
              <span class="font-cinematic text-2xl font-bold text-white tracking-wider">
                Cine<span class="text-red-500">Verse</span>
              </span>
            </div>
            <p class="text-xs text-gray-400 max-w-sm leading-relaxed mb-4">
              A premium, interactive cinema auditorium for discovering timeless films, verified reviews, and community conversations.
            </p>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] text-gray-300">
              <span>Powered by</span>
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-400 hover:underline">TMDB API</a>
            </div>
          </div>

          <div>
            <h4 class="font-cinematic text-sm font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <div class="flex flex-col gap-2 text-xs text-gray-400">
              <a href="#/" class="hover:text-white transition-colors">Grand Cinema Hall</a>
              <a href="#/explore" class="hover:text-white transition-colors">Explore Film Archive</a>
              <a href="#/lobby" class="hover:text-white transition-colors">The Lobby Discussions</a>
              <a href="#/watchlist" class="hover:text-white transition-colors">Patron Watchlist</a>
            </div>
          </div>

          <div>
            <h4 class="font-cinematic text-sm font-bold text-white uppercase tracking-wider mb-3">Cinema Rules & Terms</h4>
            <div class="flex flex-col gap-2 text-xs text-gray-400">
              <a href="#/attribution" class="hover:text-white transition-colors">TMDB Compliance Notice</a>
              <a href="#/attribution" class="hover:text-white transition-colors">Review Integrity Policy</a>
              <button onclick="SettingsModal.open();" class="text-left hover:text-white transition-colors">API Settings</button>
            </div>
          </div>

        </div>

        <div class="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <div>© 2026 CineVerse Cinema Experience. All rights reserved.</div>
          <div>This product uses the TMDB API but is not endorsed or certified by TMDB.</div>
        </div>
      </footer>
    `;
  },

  async handleRouting() {
    const hash = window.location.hash || "#/";
    const path = hash.replace("#/", "");
    const parts = path.split("/");

    const executeRoute = async () => {
      if (!path || path === "") {
        await App.routes.home();
      } else if (parts[0] === "explore") {
        await App.routes.explore();
      } else if (parts[0] === "popular") {
        await App.routes.popular();
      } else if (parts[0] === "movie" && parts[1]) {
        await App.routes.movie(parseInt(parts[1], 10));
      } else if (parts[0] === "lobby" || parts[0] === "community") {
        await App.routes.lobby();
      } else if (parts[0] === "watchlist") {
        await App.routes.watchlist();
      } else if (parts[0] === "profile") {
        await App.routes.profile();
      } else if (parts[0] === "attribution") {
        await App.routes.attribution();
      } else {
        await App.routes.home();
      }
    };

    await CurtainTransition.navigate(executeRoute);
  },

  async init() {
    State.init();

    // Render Navigation
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) {
      navPlaceholder.innerHTML = Navbar.render();
      Navbar.attachEvents();
    }

    CurtainTransition.init();

    window.addEventListener("hashchange", () => {
      this.handleRouting();
    });

    await this.handleRouting();
  }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
