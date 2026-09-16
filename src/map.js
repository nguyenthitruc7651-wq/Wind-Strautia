/**
 * Khởi tạo Bản đồ thế giới tương tác (Leaflet)
 */
let map;

function initMap() {
  // Tạo Map với view toàn cầu
  map = L.map('map', {
    center: [0, 20],
    zoom: 3,
    minZoom: 2,
    maxZoom: 10,
    zoomControl: false,
    attributionControl: false
  });

  // TileLayer phong cách Dark Mode độc đáo (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Sự kiện khi Kéo / Zoom bản đồ -> Cập nhật vị trí Canvas
  map.on('moveend zoomend resize', () => {
    if (window.windLayer) window.windLayer.resize();
    if (window.rainLayer) window.rainLayer.render();
  });

  // Event Click lên Bản đồ lấy thông tin thời tiết giả lập
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    window.ui.showLocationInfo(lat, lng);
  });
}
