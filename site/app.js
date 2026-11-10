(() => {
  'use strict';

  const statusEl = document.getElementById('mapStatus');
  const toastEl = document.getElementById('toast');
  const selectionCard = document.getElementById('selectionCard');
  const coordinatesValue = document.getElementById('coordinatesValue');
  const aboutDialog = document.getElementById('aboutDialog');

  const showToast = (message, duration = 5200) => {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toastEl.classList.remove('show'), duration);
  };

  document.getElementById('runPrediction').addEventListener('click', () => {
    showToast(
      'زر التشغيل جاهز في الواجهة، لكن خدمة الاستدلال لم تُربط بعد. نحتاج إلى نموذج متعدد الفئات وبيانات مكانية متحققة قبل إنتاج أي خريطة محاصيل. لن نعرض نتائج وهمية.',
      8000
    );
  });

  document.getElementById('aboutButton').addEventListener('click', () => {
    if (typeof aboutDialog.showModal === 'function') aboutDialog.showModal();
    else showToast('Yemen-CropWatch — واجهة الخرائط الزراعية التجريبية.');
  });

  document.getElementById('closeSelection').addEventListener('click', () => {
    selectionCard.hidden = true;
  });

  if (typeof window.L === 'undefined') {
    statusEl.innerHTML = '<span class="status-dot status-pending"></span><span>تعذر تحميل مكتبة الخرائط. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة.</span>';
    document.getElementById('map').innerHTML = '<div style="padding:32px;text-align:center;color:#52635a">تعذر تحميل مكتبة Leaflet من شبكة توزيع المحتوى (CDN).</div>';
    return;
  }

  // Yemen extent used only to set the initial national view.
  // Administrative and crop boundaries are not fabricated in this prototype.
  const yemenBounds = L.latLngBounds(
    L.latLng(11.7, 42.3),
    L.latLng(19.2, 54.7)
  );

  const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: true,
    preferCanvas: true,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: L.latLngBounds(L.latLng(5.0, 35.0), L.latLng(30.0, 62.0)),
    maxBoundsViscosity: 0.72
  });

  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
    crossOrigin: true
  });

  osm.addTo(map);
  map.fitBounds(yemenBounds, { padding: [22, 22] });

  document.getElementById('fitYemen').addEventListener('click', () => {
    map.fitBounds(yemenBounds, { padding: [22, 22], animate: true });
  });
  document.getElementById('zoomIn').addEventListener('click', () => map.zoomIn());
  document.getElementById('zoomOut').addEventListener('click', () => map.zoomOut());

  document.getElementById('locateMe').addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('المتصفح لا يدعم تحديد الموقع الجغرافي.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = [position.coords.latitude, position.coords.longitude];
        map.setView(point, 10);
        showToast('تم الانتقال إلى موقع جهازك. لم يتم إرسال الإحداثيات إلى خادم.');
      },
      () => showToast('تعذر تحديد موقعك. تحقق من إذن الموقع واتصال HTTPS.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });

  map.on('click', (event) => {
    const lat = event.latlng.lat.toFixed(5);
    const lng = event.latlng.lng.toFixed(5);
    coordinatesValue.textContent = `${lat}, ${lng}`;
    selectionCard.hidden = false;
  });

  let tileErrors = 0;
  osm.on('tileerror', () => {
    tileErrors += 1;
    if (tileErrors >= 3) {
      statusEl.innerHTML = '<span class="status-dot status-pending"></span><span>بعض بلاطات الخريطة لم تُحمّل. قد تكون خدمة الخرائط محجوبة أو بطيئة على هذه الشبكة.</span>';
    }
  });
  osm.on('load', () => {
    statusEl.innerHTML = '<span class="status-dot status-ok"></span><span>الخريطة الأساسية محمّلة — لا توجد طبقة تنبؤ زراعي بعد</span>';
  });

  window.setTimeout(() => {
    if (tileErrors === 0 && statusEl.textContent.includes('جارٍ')) {
      statusEl.innerHTML = '<span class="status-dot status-pending"></span><span>بانتظار بلاطات الخريطة من مزود الخرائط</span>';
    }
  }, 12000);

  window.addEventListener('resize', () => map.invalidateSize());
  window.yemenCropWatchMap = map;
})();
