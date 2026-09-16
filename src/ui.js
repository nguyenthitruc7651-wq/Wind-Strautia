/**
 * Quản lý Giao diện (UI Elements, Panels, Buttons)
 */
class UIManager {
  constructor() {
    this.initListeners();
  }

  initListeners() {
    // Buttons Toolbar
    document.getElementById('btnReset').onclick = () => map.setView([0, 20], 3);
    document.getElementById('btnToggleSearch').onclick = () => {
      document.getElementById('searchContainer').classList.toggle('hidden');
    };
    document.getElementById('btnMenu').onclick = () => {
      document.getElementById('layerMenu').classList.toggle('hidden');
    };
    document.getElementById('closeCard').onclick = () => {
      document.getElementById('infoCard').classList.add('hidden');
    };

    // Toggle Layers
    document.getElementById('layerWind').onchange = (e) => window.windLayer.toggle(e.target.checked);
    document.getElementById('layerStorms').onchange = (e) => window.stormMgr.toggle(e.target.checked);
    
    // GPS Button Simulation
    document.getElementById('btnLocation').onclick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            map.flyTo([pos.coords.latitude, pos.coords.longitude], 6);
            this.showLocationInfo(pos.coords.latitude, pos.coords.longitude, "Vị trí của bạn");
          },
          () => alert("Không lấy được vị trí. Đã chuyển về vị trí mặc định.")
        );
      }
    };
  }

  showLocationInfo(lat, lng, name = "Tọa độ Giả Lập") {
    const hour = window.currentHourOffset || 0;
    const wind = window.weatherSim.getWindVector(lat, lng, hour);
    const rain = window.weatherSim.getRainIntensity(lat, lng, hour);
    const temp = window.weatherSim.getTemperature(lat, lng, hour);
    const press = window.weatherSim.getPressure(lat, lng, hour);

    document.getElementById('cardTitle').innerText = name;
    document.getElementById('valWind').innerText = `${Math.round(wind.speed)} km/h`;
    document.getElementById('valDir').innerText = `${Math.round(wind.angle)}°`;
    document.getElementById('valRain').innerText = `${rain.toFixed(1)} mm/h`;
    document.getElementById('valTemp').innerText = `${temp} °C`;
    document.getElementById('valPress').innerText = `${press} hPa`;
    document.getElementById('valCoords').innerText = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;

    document.getElementById('infoCard').classList.remove('hidden');
  }

  showStormInfo(storm, lat, lng) {
    document.getElementById('cardTitle').innerText = `⚠️ ${storm.name}`;
    document.getElementById('valWind').innerText = `${storm.speed} km/h`;
    document.getElementById('valDir').innerText = `${storm.dir}°`;
    document.getElementById('valRain').innerText = `Rất nặng (Bão)`;
    document.getElementById('valTemp').innerText = `26 °C`;
    document.getElementById('valPress').innerText = `${storm.pressure} hPa`;
    document.getElementById('valCoords').innerText = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;

    document.getElementById('infoCard').classList.remove('hidden');
  }
}

window.ui = new UIManager();
