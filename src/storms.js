/**
 * Hệ thống Quản lý Bão Giả Lập (Storm Systems)
 */
class StormManager {
  constructor() {
    this.storms = [];
    this.markers = [];
    this.isStormsActive = true;
    this.generateRandomStorms();
  }

  // Khởi tạo 4-6 Cơn Bão Giả Lập trên các Đại Dương
  generateRandomStorms() {
    this.storms = [
      {
        id: "STORM-01",
        name: "Bão Giả Lập KAISOUL-Alpha",
        baseLat: -15,
        baseLng: 75,
        speed: 120,
        pressure: 940,
        dir: 285,
        category: "Cấp 12 (Siêu Bão Giả Lập)"
      },
      {
        id: "STORM-02",
        name: "Áp Thấp Giả Lập 02W",
        baseLat: 14,
        baseLng: 130,
        speed: 65,
        pressure: 992,
        dir: 310,
        category: "Cấp 8"
      },
      {
        id: "STORM-03",
        name: "Bão Giả Lập Maelstrom",
        baseLat: 22,
        baseLng: -65,
        speed: 95,
        pressure: 965,
        dir: 290,
        category: "Cấp 10"
      }
    ];
  }

  renderStorms(hourOffset = 0) {
    // Xóa marker cũ
    this.clearMarkers();

    if (!this.isStormsActive) return;

    this.storms.forEach(s => {
      // Bão di chuyển theo thời gian Timeline
      const currentLat = s.baseLat + Math.sin(hourOffset * 0.1) * 2;
      const currentLng = s.baseLng - (hourOffset * 0.5);

      const stormIcon = L.divIcon({
        className: 'custom-storm-icon',
        html: `
          <div class="storm-icon-wrapper">
            <div class="storm-spinner"></div>
            <div class="storm-center-text">🌪️</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([currentLat, currentLng], { icon: stormIcon }).addTo(map);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        window.ui.showStormInfo(s, currentLat, currentLng);
      });

      this.markers.push(marker);
    });
  }

  clearMarkers() {
    this.markers.forEach(m => map.removeLayer(m));
    this.markers = [];
  }

  toggle(enable) {
    this.isStormsActive = enable;
    this.renderStorms(window.currentHourOffset || 0);
  }
}
