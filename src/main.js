/**
 * Main Controller - Kết nối toàn bộ Module và Điều khiển Timeline
 */
window.currentHourOffset = 0;
let isPlaying = false;
let playInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Bản đồ
  initMap();

  // 2. Khởi tạo Lớp Gió & Bão
  window.windLayer = new WindLayer('weatherCanvas');
  window.windLayer.animate();

  window.stormMgr = new StormManager();
  window.stormMgr.renderStorms(0);

  // 3. Khởi tạo Tìm kiếm
  setupSearch();

  // 4. Khởi tạo Timeline Slider
  const slider = document.getElementById('timelineRange');
  const timeDisplay = document.getElementById('timeDisplay');
  const playBtn = document.getElementById('btnPlayPause');

  function updateTime(value) {
    window.currentHourOffset = parseInt(value);
    timeDisplay.innerText = value == 0 ? "Hiện tại" : `+${value} Giờ`;
    
    // Cập nhật các vị trí bão & dòng gió theo Timeline
    window.stormMgr.renderStorms(window.currentHourOffset);
  }

  slider.addEventListener('input', (e) => {
    updateTime(e.target.value);
  });

  // Nút Play / Pause Timeline
  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';

    if (isPlaying) {
      playInterval = setInterval(() => {
        let val = (parseInt(slider.value) + 1) % 25;
        slider.value = val;
        updateTime(val);
      }, 1000);
    } else {
      clearInterval(playInterval);
    }
  });

  // Tối ưu hiệu năng: Tạm dừng khi chuyển tab tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.windLayer.toggle(false);
    } else {
      window.windLayer.toggle(document.getElementById('layerWind').checked);
    }
  });
});
