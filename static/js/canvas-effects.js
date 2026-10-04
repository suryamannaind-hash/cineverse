// CineVerse Ambient Projector Light Beam & Floating Dust Particle Engine

const ProjectorCanvas = {
  canvas: null,
  ctx: null,
  particles: [],
  maxParticles: 45,
  animId: null,
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },

  init(canvasId = "projector-dust-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }

    this.animate();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
    this.canvas.height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
  },

  createParticle() {
    const w = this.canvas ? this.canvas.width : window.innerWidth;
    const h = this.canvas ? this.canvas.height : 600;
    // Particles concentrate in the central projector beam cone
    const centerX = w / 2;
    const spread = (Math.random() - 0.5) * (w * 0.75);

    return {
      x: centerX + spread,
      y: Math.random() * h,
      size: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: Math.random() * 0.4 + 0.2,
      opacity: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI,
      pulseSpeed: Math.random() * 0.03 + 0.01
    };
  },

  animate() {
    if (!this.ctx || !this.canvas) return;

    if (State.reducedMotion) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const w = this.canvas.width;
    const h = this.canvas.height;
    const apexX = w / 2;
    const apexY = -20;

    // Draw subtle volumetric projector cone
    const gradient = this.ctx.createRadialGradient(apexX, apexY, 10, apexX, h * 0.7, w * 0.6);
    gradient.addColorStop(0, "rgba(255, 240, 215, 0.08)");
    gradient.addColorStop(0.35, "rgba(255, 220, 180, 0.03)");
    gradient.addColorStop(0.8, "rgba(229, 9, 20, 0.01)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(apexX - 40, apexY);
    this.ctx.lineTo(apexX + 40, apexY);
    this.ctx.lineTo(w * 0.95, h);
    this.ctx.lineTo(w * 0.05, h);
    this.ctx.closePath();
    this.ctx.fill();

    // Render & update floating dust motes
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      // Reset when particle drifts off screen
      if (p.y > h || p.x < 0 || p.x > w) {
        Object.assign(p, this.createParticle());
        p.y = 0;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 235, 190, ${currentOpacity})`;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = "rgba(255, 220, 150, 0.6)";
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    this.animId = requestAnimationFrame(() => this.animate());
  },

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
};

window.ProjectorCanvas = ProjectorCanvas;
