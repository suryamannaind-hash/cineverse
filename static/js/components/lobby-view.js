// CineVerse "The Lobby" Community Discussions Component

const LobbyView = {
  activeCategory: "All",
  discussions: [],

  async render() {
    this.discussions = await API.getDiscussions(this.activeCategory);

    return `
      <section class="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-semibold tracking-widest uppercase mb-2 border border-red-500/30">
              Cinema Lounge
            </div>
            <h2 class="font-cinematic text-2xl md:text-4xl font-extrabold text-white tracking-wide">
              Highlights from the Community
            </h2>
            <p class="text-xs md:text-sm text-gray-400 mt-1">
              Step into The Lobby. Gather around our velvet chairs for timeless film debates.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button 
              id="new-discussion-btn"
              class="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              <span>Start a Topic</span>
            </button>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          ${["All", "Philosophy", "Soundtracks", "Underrated", "Debate"].map(cat => `
            <button 
              class="lobby-cat-pill px-4 py-1.5 rounded-full text-xs font-medium transition-all ${this.activeCategory === cat ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'cinema-glass text-gray-300 hover:text-white hover:bg-white/10'}"
              data-cat="${cat}"
            >
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- 3-Column Highlights Grid (Matching Reference Design) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="discussions-container">
          ${this.discussions.map(d => `
            <div class="cinema-glass rounded-2xl p-6 border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between group hover:-translate-y-1 shadow-2xl relative overflow-hidden">
              
              <!-- Subtle Card Background Tone -->
              <div class="absolute -top-16 -right-16 w-36 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-[10px] tracking-wider uppercase border border-amber-500/30">
                    ${d.badge || 'TICKETS'}
                  </span>
                  <span class="text-[11px] text-gray-400">${d.topic_category}</span>
                </div>

                <h3 class="font-cinematic text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-3">
                  ${d.title}
                </h3>

                <p class="text-xs text-gray-300 line-clamp-3 leading-relaxed mb-6">
                  ${d.content}
                </p>
              </div>

              <!-- Footer with Replies & CTA -->
              <div class="flex items-center justify-between pt-4 border-t border-white/10">
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  <span>${d.replies_count.toLocaleString()} replies</span>
                </div>

                <button 
                  class="open-thread-btn text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                  data-id="${d.id}"
                >
                  <span>Join Discussion</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          `).join('')}
        </div>

        <!-- Thread Modal Container -->
        <div id="thread-modal" class="fixed inset-0 z-50 hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div class="cinema-glass w-full max-w-2xl rounded-2xl border border-white/15 p-6 shadow-2xl max-h-[85vh] flex flex-col relative" id="thread-modal-content">
            <!-- Dynamic thread content -->
          </div>
        </div>

        <!-- New Discussion Modal Container -->
        <div id="new-discussion-modal" class="fixed inset-0 z-50 hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div class="cinema-glass w-full max-w-lg rounded-2xl border border-white/15 p-6 shadow-2xl relative">
            <button class="absolute top-4 right-4 text-gray-400 hover:text-white" id="close-new-discussion-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h3 class="font-cinematic text-xl font-bold text-white mb-4">Start a Topic in The Lobby</h3>
            
            <form id="new-topic-form" class="flex flex-col gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Topic Title</label>
                <input type="text" id="topic-title" placeholder="e.g. Which film has the greatest opening shot?" required class="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <select id="topic-category" class="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500">
                  <option value="Philosophy">Philosophy</option>
                  <option value="Soundtracks">Soundtracks</option>
                  <option value="Underrated">Underrated Gems</option>
                  <option value="Debate">Film Debate</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Opening Thoughts</label>
                <textarea id="topic-content" rows="4" placeholder="Share your perspective and invite community thoughts..." required class="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"></textarea>
              </div>
              <button type="submit" class="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/30">
                Post to The Lobby
              </button>
            </form>
          </div>
        </div>

      </section>
    `;
  },

  attachEvents() {
    // Category pills
    document.querySelectorAll(".lobby-cat-pill").forEach(pill => {
      pill.addEventListener("click", async () => {
        this.activeCategory = pill.getAttribute("data-cat");
        const container = document.getElementById("lobby-view-wrapper");
        if (container) {
          container.innerHTML = await this.render();
          this.attachEvents();
        }
      });
    });

    // Open discussion thread modal
    document.querySelectorAll(".open-thread-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = parseInt(btn.getAttribute("data-id"), 10);
        await this.openThread(id);
      });
    });

    // New discussion topic modal
    const newBtn = document.getElementById("new-discussion-btn");
    const newModal = document.getElementById("new-discussion-modal");
    const closeNewBtn = document.getElementById("close-new-discussion-btn");
    const newForm = document.getElementById("new-topic-form");

    if (newBtn && newModal) {
      newBtn.addEventListener("click", () => newModal.classList.remove("hidden"));
    }
    if (closeNewBtn && newModal) {
      closeNewBtn.addEventListener("click", () => newModal.classList.add("hidden"));
    }
    if (newForm) {
      newForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("topic-title").value.trim();
        const category = document.getElementById("topic-category").value;
        const content = document.getElementById("topic-content").value.trim();

        await API.createDiscussion({
          title,
          topic_category: category,
          content,
          badge: category === 'Soundtracks' ? 'AUDIO' : (category === 'Underrated' ? 'GEMS' : 'TICKETS')
        });

        newModal.classList.add("hidden");
        State.toast("Topic opened in The Lobby!", "success");
        const container = document.getElementById("lobby-view-wrapper");
        if (container) {
          container.innerHTML = await this.render();
          this.attachEvents();
        }
      });
    }
  },

  async openThread(id) {
    const threadModal = document.getElementById("thread-modal");
    const contentBox = document.getElementById("thread-modal-content");
    if (!threadModal || !contentBox) return;

    try {
      const thread = await API.getDiscussionThread(id);

      contentBox.innerHTML = `
        <button class="absolute top-4 right-4 text-gray-400 hover:text-white" id="close-thread-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="mb-4 pr-8">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 rounded bg-red-600/30 text-red-400 text-xs font-bold uppercase">${thread.topic_category}</span>
            <span class="text-xs text-gray-400">Started by ${thread.user_name}</span>
          </div>
          <h2 class="font-cinematic text-xl font-bold text-white mb-2">${thread.title}</h2>
          <p class="text-xs md:text-sm text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">${thread.content}</p>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 my-3 flex flex-col gap-3 max-h-72">
          ${thread.replies.length ? thread.replies.map(r => `
            <div class="cinema-glass p-3 rounded-xl border border-white/5 flex items-start gap-3">
              <img src="${r.user_avatar}" alt="${r.user_name}" class="w-8 h-8 rounded-full object-cover border border-amber-400/40" />
              <div class="flex-1">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-bold text-white">${r.user_name}</span>
                  <span class="text-[10px] text-gray-500">${new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p class="text-xs text-gray-300">${r.content}</p>
              </div>
            </div>
          `).join('') : '<div class="text-center text-xs text-gray-400 py-6">Be the first to share your thoughts in this thread.</div>'}
        </div>

        <!-- Reply Input Form -->
        <form id="reply-form" class="mt-auto pt-3 border-t border-white/10 flex gap-2">
          <input 
            type="text" 
            id="reply-input" 
            placeholder="Share your cinema insight..." 
            required 
            class="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-red-500"
          />
          <button type="submit" class="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs md:text-sm transition-all shadow-lg shadow-red-600/30">
            Reply
          </button>
        </form>
      `;

      threadModal.classList.remove("hidden");

      document.getElementById("close-thread-btn").addEventListener("click", () => {
        threadModal.classList.add("hidden");
      });

      document.getElementById("reply-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("reply-input");
        const val = input.value.trim();
        if (!val) return;

        await API.replyToDiscussion(id, val);
        input.value = "";
        State.toast("Reply added to thread!", "success");
        this.openThread(id); // reload thread
      });
    } catch (err) {
      State.toast("Could not load discussion", "error");
    }
  }
};

window.LobbyView = LobbyView;
