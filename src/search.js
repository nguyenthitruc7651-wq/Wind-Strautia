/**
 * Chức năng Tìm kiếm Thành phố (Local Preset Database)
 */
const CITY_DATABASE = [
  { name: "Hà Nội, Việt Nam", lat: 21.0285, lng: 105.8542 },
  { name: "TP. Hồ Chí Minh, Việt Nam", lat: 10.8231, lng: 106.6297 },
  { name: "Đà Nẵng, Việt Nam", lat: 16.0544, lng: 108.2022 },
  { name: "Tokyo, Nhật Bản", lat: 35.6762, lng: 139.6503 },
  { name: "New York, Mỹ", lat: 40.7128, lng: -74.0060 },
  { name: "London, Anh", lat: 51.5074, lng: -0.1278 },
  { name: "Sydney, Úc", lat: -33.8688, lng: 151.2093 },
  { name: "Paris, Pháp", lat: 48.8566, lng: 2.3522 }
];

function setupSearch() {
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('searchResults');
  const clearBtn = document.getElementById('clearSearch');

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';

    if (!query) return;

    const filtered = CITY_DATABASE.filter(c => c.name.toLowerCase().includes(query));

    filtered.forEach(city => {
      const div = document.createElement('div');
      div.className = 'search-item';
      div.innerText = city.name;
      div.onclick = () => {
        map.flyTo([city.lat, city.lng], 6, { duration: 1.5 });
        window.ui.showLocationInfo(city.lat, city.lng, city.name);
        resultsContainer.innerHTML = '';
        input.value = city.name;
      };
      resultsContainer.appendChild(div);
    });
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    resultsContainer.innerHTML = '';
  });
}
