/**
 * Thuật toán Giả Lập Toán Học Trường Gió & Mưa (Vector Field Simulation)
 * Không sử dụng bất kỳ API bên ngoài nào.
 */
class WeatherSimulation {
  constructor() {
    this.seed = Math.random() * 1000;
    this.timeOffset = 0; // Số giờ dịch chuyển từ Timeline (+0h -> +24h)
  }

  // Hàm sinh tiếng ồn Perlin-like cơ bản bằng Sin/Cos đa tầng
  noise(x, y, t) {
    const s = Math.sin;
    const c = Math.cos;
    return (
      s(x * 0.05 + t) * c(y * 0.05 + t) +
      0.5 * s(x * 0.1 - t * 0.5) * c(y * 0.1 + t * 0.5) +
      0.25 * s(x * 0.2 + t) * s(y * 0.2 - t)
    );
  }

  // Tính toán Vector Gió (u: Tây-Đông, v: Nam-Bắc) tại điểm (lat, lng)
  getWindVector(lat, lng, hourOffset = 0) {
    const t = (this.seed + hourOffset * 0.05);
    const radLat = (lat * Math.PI) / 180;
    const radLng = (lng * Math.PI) / 180;

    // Gió Tín Phong / Gió Tây ôn đới cơ bản theo vĩ độ
    let baseU = Math.sin(radLat * 3) * 15; 
    let baseV = Math.cos(radLng * 2) * 5;

    // Phân vùng xoáy nhiễu động giả lập
    const n1 = this.noise(lng * 0.1, lat * 0.1, t);
    const n2 = this.noise(lat * 0.1, lng * 0.1, t + 10);

    let u = baseU + n1 * 25;
    let v = baseV + n2 * 25;

    // Thêm vùng xoáy Siêu bão giả lập ở Ấn Độ Dương / Thái Bình Dương (tương tự ảnh mẫu)
    const stormCenterLat = -15 + Math.sin(t) * 3;
    const stormCenterLng = 75 + Math.cos(t) * 5;
    const dLat = lat - stormCenterLat;
    const dLng = lng - stormCenterLng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);

    if (dist < 25) {
      const stormForce = Math.max(0, (25 - dist) / 25) * 80;
      // Lực xoáy tâm bão (Counter-clockwise ở Nam bán cầu / Clockwise ở Bắc bán cầu)
      u += (-dLat / (dist + 0.1)) * stormForce;
      v += (dLng / (dist + 0.1)) * stormForce;
    }

    const speed = Math.sqrt(u * u + v * v);
    let angle = (Math.atan2(v, u) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return { u, v, speed, angle };
  }

  // Lượng mưa giả lập (mm/h) dựa trên hội tụ gió & độ ẩm giả định
  getRainIntensity(lat, lng, hourOffset = 0) {
    const wind = this.getWindVector(lat, lng, hourOffset);
    const n = this.noise(lat * 0.08, lng * 0.08, hourOffset * 0.1);
    
    // Mưa cao ở vùng gió mạnh hoặc vùng xoáy
    if (wind.speed > 35 || n > 0.4) {
      return Math.min(100, Math.pow(wind.speed / 10, 2) + n * 20);
    }
    return 0;
  }

  // Nhiệt độ giả lập (°C)
  getTemperature(lat, lng, hourOffset = 0) {
    const baseTemp = 30 - Math.abs(lat) * 0.5; // Càng gần xích đạo càng nóng
    const variation = Math.sin((lng + hourOffset) * 0.1) * 5;
    return Math.round(baseTemp + variation);
  }

  // Áp suất giả lập (hPa)
  getPressure(lat, lng, hourOffset = 0) {
    const wind = this.getWindVector(lat, lng, hourOffset);
    return Math.round(1013 - wind.speed * 0.6); // Gió càng mạnh áp suất càng thấp
  }
}

window.weatherSim = new WeatherSimulation();
