// CineVerse TMDB Attribution & Legal Compliance View

const AttributionView = {
  render() {
    return `
      <div class="pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div class="cinema-glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-xl">
              T
            </div>
            <div>
              <h1 class="font-cinematic text-2xl md:text-3xl font-bold text-white">
                Legal Attribution & API Compliance
              </h1>
              <p class="text-xs text-gray-400">The Movie Database (TMDB) Integration Notice</p>
            </div>
          </div>

          <div class="space-y-6 text-xs md:text-sm text-gray-300 leading-relaxed">
            
            <div class="bg-black/40 p-4 rounded-2xl border border-emerald-500/30">
              <h3 class="font-bold text-white mb-2 flex items-center gap-2">
                <span class="text-emerald-400">✓</span>
                Official TMDB Attribution Notice
              </h3>
              <p class="text-gray-200">
                This product uses the TMDB API but is not endorsed or certified by TMDB. All movie posters, backdrops, cast filmographies, and metadata are provided courtesy of The Movie Database (TMDB) and respective studios.
              </p>
            </div>

            <div>
              <h3 class="font-bold text-white text-base mb-2">1. Review Data Integrity</h3>
              <p>
                CineVerse upholds strict review transparency standards. We do not claim ownership of, nor do we fabricate, any third-party reviews. External reviews are retrieved legally via the official TMDB API, clearly designated with attribution badges, and linked back to the original source.
              </p>
            </div>

            <div>
              <h3 class="font-bold text-white text-base mb-2">2. Native CineVerse Patron Submissions</h3>
              <p>
                User reviews submitted through CineVerse are provided directly by our registered patrons and community members. Reviews with spoilers are explicitly safeguarded behind interactive spoiler shields to preserve the cinematic experience for fellow viewers.
              </p>
            </div>

            <div>
              <h3 class="font-bold text-white text-base mb-2">3. Trademark & Copyright Notice</h3>
              <p>
                All movie titles, logos, and related marks are trademarks of and copyright to their respective studio owners. CineVerse is a non-commercial cinematic discovery demonstration platform.
              </p>
            </div>

          </div>

          <div class="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <a href="#/" class="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold">
              ← Return to Cinema Lobby
            </a>
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" class="text-xs text-gray-400 hover:text-white underline">
              Visit The Movie Database (TMDB)
            </a>
          </div>

        </div>
      </div>
    `;
  }
};

window.AttributionView = AttributionView;
