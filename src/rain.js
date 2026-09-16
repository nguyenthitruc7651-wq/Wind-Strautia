/**
 * Lớp hiển thị Lượng mưa Giả Lập (Rain Heatmap overlay)
 */
class RainLayer {
  constructor() {
    this.isRainActive = true;
  }

  render() {
    // Vẽ kết hợp mượt mà với Canvas chính khi active
  }

  toggle(enable) {
    this.isRainActive = enable;
  }
}
window.rainLayer = new RainLayer();
