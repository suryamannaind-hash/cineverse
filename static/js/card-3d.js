// CineVerse 3D Interactive Card & Poster Tilt Engine

const Card3D = {
  init(container = document) {
    const cards = container.querySelectorAll(".poster-card-3d");
    cards.forEach(card => this.attach(card));
  },

  attach(card) {
    if (card._has3DTilt) return;
    card._has3DTilt = true;

    const glare = card.querySelector(".poster-glare") || document.createElement("div");
    if (!card.querySelector(".poster-glare")) {
      glare.className = "poster-glare";
      card.appendChild(glare);
    }

    const onMouseMove = (e) => {
      if (State.reducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (max 14 degrees)
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04) translateZ(12px)`;
      card.style.boxShadow = `
        ${-rotateY * 1.5}px ${rotateX * 1.5 + 15}px 35px rgba(0, 0, 0, 0.75),
        0 0 25px rgba(229, 9, 20, 0.35)
      `;

      // Position specular glare
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0) 65%)`;
      glare.style.opacity = "1";
    };

    const onMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)";
      card.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.6)";
      glare.style.opacity = "0";
    };

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);

    // Touch support
    let touchStartX = 0;
    card.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    card.addEventListener("touchend", () => {
      onMouseLeave();
    });
  }
};

window.Card3D = Card3D;
