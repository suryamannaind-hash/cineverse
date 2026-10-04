// CineVerse Velvet Curtain Page Transition

const CurtainTransition = {
  element: null,
  isTransitioning: false,
  pendingCallback: null,
  safetyTimer: null,

  init() {
    this.element = document.getElementById("cinema-curtain-transition");
  },

  async navigate(callback) {
    if (State.reducedMotion) {
      if (callback) await callback();
      window.scrollTo(0, 0);
      return;
    }

    if (this.isTransitioning) {
      // Register newest requested navigation so clicks during transition are never dropped
      this.pendingCallback = callback;
      return;
    }

    this.isTransitioning = true;
    if (!this.element) this.init();

    // Auto-rescue watchdog: guarantees curtains never remain stuck closed under any circumstance
    clearTimeout(this.safetyTimer);
    this.safetyTimer = setTimeout(() => {
      if (this.element) this.element.classList.remove("closing");
      this.isTransitioning = false;
      if (this.pendingCallback) {
        const next = this.pendingCallback;
        this.pendingCallback = null;
        next();
      }
    }, 1800);

    try {
      // Close velvet curtains
      CinemaAudio.playCurtainWhoosh();
      if (this.element) this.element.classList.add("closing");

      // Snappy cinema curtain timing
      await new Promise(r => setTimeout(r, 450));

      // Execute route render while curtains are fully closed
      if (callback) {
        try {
          await callback();
        } catch (err) {
          console.error("Navigation callback error:", err);
        }
      }
      window.scrollTo(0, 0);
    } catch (e) {
      console.error("Curtain navigation error:", e);
    } finally {
      // Reopen velvet curtains to reveal the newly loaded page
      await new Promise(r => setTimeout(r, 60));
      if (this.element) this.element.classList.remove("closing");

      setTimeout(() => {
        this.isTransitioning = false;
        clearTimeout(this.safetyTimer);

        if (this.pendingCallback) {
          const next = this.pendingCallback;
          this.pendingCallback = null;
          this.navigate(next);
        }
      }, 350);
    }
  }
};

window.CurtainTransition = CurtainTransition;
