/**
 * Rendering Hạt Gió (Wind Particles Animation) trên HTML5 Canvas
 */
class WindLayer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 1800; // Số lượng hạt tối ưu cho mobile
    this.animationFrame = null;
    this.isWindActive = true;

    this.resize();
    this.initParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.resetParticle({}));
    }
  }

  resetParticle(p) {
    p.x = Math.random() * this.canvas.width;
    p.y = Math.random() * this.canvas.height;
    p.age = 0;
    p.maxAge = 40 + Math.random() * 60;
    return p;
  }

  // Chuyển màu theo Tốc độ gió (Đúng bảng màu yêu cầu)
  getSpeedColor(speed) {
    if (speed < 10) return 'rgba(59, 130, 246, 0.8)';   // Xanh lam
    if (speed < 20) return 'rgba(45, 212, 191, 0.8)';  // Xanh ngọc
    if (speed < 35) return 'rgba(74, 222, 128, 0.8)';  // Xanh lá
    if (speed < 55) return 'rgba(250, 204, 21, 0.8)';  // Vàng
    if (speed < 70) return 'rgba(249, 115, 22, 0.8)';  // Cam
    return 'rgba(168, 85, 247, 0.9)';                  // Tím (>70km/h)
  }

  animate() {
    if (!this.isWindActive) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    // Tạo hiệu ứng vệt mờ (Trail effect)
    this.ctx.fillStyle = 'rgba(9, 17, 30, 0.15)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const hourOffset = window.currentHourOffset || 0;

    this.particles.forEach(p => {
      if (p.age > p.maxAge) {
        this.resetParticle(p);
      }

      // Đổi Screen pixel sang Latitude/Longitude
      const latlng = map.containerPointToLatLng([p.x, p.y]);
      const wind = window.weatherSim.getWindVector(latlng.lat, latlng.lng, hourOffset);

      // Tốc độ di chuyển hạt trên màn hình
      const nextX = p.x + wind.u * 0.12;
      const nextY = p.y - wind.v * 0.12;

      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(nextX, nextY);
      this.ctx.strokeStyle = this.getSpeedColor(wind.speed);
      this.ctx.lineWidth = Math.min(2.5, Math.max(1, wind.speed / 25));
      this.ctx.stroke();

      p.x = nextX;
      p.y = nextY;
      p.age++;

      // Reset nếu hạt lọt ra ngoài màn hình
      if (p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
        this.resetParticle(p);
      }
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  toggle(enable) {
    this.isWindActive = enable;
    if (enable) {
      this.animate();
    } else {
      cancelAnimationFrame(this.animationFrame);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
