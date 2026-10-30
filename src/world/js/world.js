/* FTU Legacy K63 — triển lãm 3D (Three.js r158, bản script cổ điển để mở được trực tiếp từ file).
   Bố cục không gian triển lãm:
     · Mặt đất là ~50.000 hạt sáng, gợn sóng theo thời gian và phồng lên dưới con trỏ.
     · Ở giữa là quả cầu FTU (hạt) — nhấp đúp để mở Thông tin dự án.
     · 10 tấm "bia" sản phẩm đứng thành vòng quanh quả cầu, luôn quay mặt về phía người xem.
   Tương tác: di chuột → camera nghiêng theo · kéo → xoay toàn cảnh · cuộn → gần/xa
              nhấp đúp vào sản phẩm → bay vào · nhấp đúp vào chỗ trống → sà xuống điểm đó · Esc → quay về.
   Routes: #/  ·  #/nhom/3  ·  #/du-an                                                         */
(() => {
  'use strict';

  /* ---------------- tiện ích ---------------- */
  const C = window.FTU_CONFIG || {};
  const G = (window.FTU_GROUPS || []).slice().sort((a, b) => a.id - b.id);
  const N = G.length;
  const $ = (s, r = document) => r.querySelector(s);
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const accentOf = (g) => g.accent || '#5B73FF';
  const initials = (n) => { const w = String(n || '?').trim().split(/\s+/); return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[w.length - 1][0]).toUpperCase(); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const MOBILE = () => innerWidth <= 760;
  const CAN_TEX = location.protocol !== 'file:'; // ảnh ngoài làm texture WebGL cần chạy qua web server (GitHub Pages)

  document.querySelectorAll('[data-cfg-href]').forEach((el) => { if (C[el.dataset.cfgHref]) el.href = C[el.dataset.cfgHref]; });
  document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = N; });
  if (!CAN_TEX && G.some((g) => g.images && g.images.product)) {
    const n = document.createElement('p');
    n.className = 'devnote mono';
    n.innerHTML = 'Đang mở trực tiếp từ file — ảnh sản phẩm chỉ hiện trên tấm 3D khi chạy qua web server (GitHub Pages, hoặc <b>python3 -m http.server</b>).';
    document.body.appendChild(n);
  }
  const clockFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => { $('#clock').textContent = clockFmt.format(new Date()); };
  tick(); setInterval(tick, 20000);
  if (FINE) document.body.classList.add('is-fine');

  /* ---------------- WebGL ---------------- */
  let renderer;
  try {
    if (!window.THREE) throw new Error('no three');
    renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    $('#nogl').hidden = false;
    $('#nogl-list').innerHTML = G.map((g) => `<li><span class="mono">${pad(g.id)}</span><b>${esc(g.name)}</b>${g.demoUrl ? `<a href="${esc(g.demoUrl)}" target="_blank" rel="noopener">Dùng thử ↗</a>` : ''}${g.repoUrl ? `<a href="${esc(g.repoUrl)}" target="_blank" rel="noopener">Mã nguồn ↗</a>` : ''}</li>`).join('');
    ['#intro', '.top'].forEach((s) => { const el = $(s); if (el) el.hidden = true; });
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 1);
  const MAX_ANISO = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0075);
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 700);
  const V3 = THREE.Vector3;

  const GROUND_Y = -6;
  const RING_R = 30;
  const CORE_Y = 4;

  /* ---------------- mặt đất bằng hạt ---------------- */
  const TER_SIZE = 190;
  const SEG = MOBILE() ? 150 : 230;
  const tPos = new Float32Array((SEG + 1) * (SEG + 1) * 3);
  const tRand = new Float32Array((SEG + 1) * (SEG + 1));
  {
    const r = rng(7); let k = 0;
    for (let i = 0; i <= SEG; i++) for (let j = 0; j <= SEG; j++) {
      tPos[k * 3] = (i / SEG - 0.5) * TER_SIZE + (r() - 0.5) * 0.3;
      tPos[k * 3 + 1] = 0;
      tPos[k * 3 + 2] = (j / SEG - 0.5) * TER_SIZE + (r() - 0.5) * 0.3;
      tRand[k] = r(); k++;
    }
  }
  const terGeo = new THREE.BufferGeometry();
  terGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
  terGeo.setAttribute('aRand', new THREE.BufferAttribute(tRand, 1));
  const U = {
    uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() },
    uMouse: { value: new THREE.Vector2(999, 999) }, uMouseAmp: { value: 0 },
    uFocus: { value: new THREE.Vector2(999, 999) }, uFocusAmp: { value: 0 }, uAccent: { value: new THREE.Color('#5B73FF') },
    uReveal: { value: 0 }, uSize: { value: TER_SIZE }, uGround: { value: GROUND_Y },
    uColA: { value: new THREE.Color('#1B2A8F') }, uColB: { value: new THREE.Color('#C9D2FF') },
  };
  const terMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uPx, uMouseAmp, uFocusAmp, uReveal, uSize, uGround;
      uniform vec2 uMouse, uFocus; uniform vec3 uColA, uColB, uAccent;
      attribute float aRand; varying vec3 vColor; varying float vAlpha;
      void main() {
        vec3 p = position; float t = uTime; float r = length(p.xz);
        float h = sin(p.x * 0.06 + t * 0.35) * 1.4 + sin(p.z * 0.08 - t * 0.28) * 1.1 + sin((p.x + p.z) * 0.035 + t * 0.18) * 2.0;
        h *= 0.3 + 0.7 * smoothstep(8.0, 34.0, r);
        float dm = distance(p.xz, uMouse);
        h += (exp(-dm * dm / 70.0) * 4.0 + sin(dm * 0.9 - t * 5.0) * exp(-dm * 0.13) * 0.7) * uMouseAmp;
        float df = distance(p.xz, uFocus);
        h += exp(-df * df / 50.0) * 2.5 * uFocusAmp;
        p.y = uGround + h;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.0 + aRand * 1.1) * uPx * (70.0 / -mv.z);
        float edge = 1.0 - smoothstep(uSize * 0.3, uSize * 0.5, r);
        float reveal = 1.0 - smoothstep(uReveal - 25.0, uReveal, r);
        float depth = clamp(1.0 - (-mv.z - 30.0) / 230.0, 0.0, 1.0);
        vAlpha = (0.28 + 0.6 * smoothstep(-3.0, 5.0, h)) * edge * reveal * depth;
        vColor = mix(uColA, uColB, smoothstep(-2.5, 5.5, h));
        vColor += vec3(0.55, 0.6, 0.8) * exp(-dm * dm / 140.0) * uMouseAmp;
        vColor += uAccent * exp(-df * df / 120.0) * uFocusAmp * 1.2;
      }`,
    fragmentShader: `
      varying vec3 vColor; varying float vAlpha;
      void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(vColor, smoothstep(0.5, 0.05, d) * vAlpha); }`,
  });
  scene.add(new THREE.Points(terGeo, terMat));

  /* ---------------- texture tiện dụng ---------------- */
  function glowTex() {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const GLOW = glowTex();
  const glowSprite = (color, scale, opacity) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(scale, scale, 1); return s;
  };

  /* ---------------- quả cầu FTU ở giữa ---------------- */
  const core = new THREE.Group();
  core.position.set(0, CORE_Y, 0);
  scene.add(core);
  const globe = new THREE.Group(); core.add(globe);
  {
    const n = 2600, p = new Float32Array(n * 3), R = 6, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, rr = Math.sqrt(1 - y * y), th = ga * i;
      p[i * 3] = Math.cos(th) * rr * R; p[i * 3 + 1] = y * R; p[i * 3 + 2] = Math.sin(th) * rr * R;
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    globe.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.09, color: 0xD6DCFF, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })));
    const ringMat = new THREE.LineBasicMaterial({ color: 0x8FA2FF, transparent: true, opacity: 0.35 });
    [[6.9, 0.3, 0], [7.6, -0.5, 0.6], [8.4, 1.2, -0.3]].forEach(([rad, rx, rz]) => {
      const pts = []; for (let k = 0; k <= 128; k++) { const a = (k / 128) * Math.PI * 2; pts.push(new V3(Math.cos(a) * rad, 0, Math.sin(a) * rad)); }
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat);
      l.rotation.set(rx, 0, rz); globe.add(l);
    });
    core.add(glowSprite(0x4C64FF, 34, 0.32));
  }
  const coreHit = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 12), new THREE.MeshBasicMaterial());
  coreHit.visible = false; core.add(coreHit);

  /* ---------------- ảnh tạm cho sản phẩm: vẽ giao diện mẫu lên canvas ---------------- */
  function drawMock(cv, g) {
    const x = cv.getContext('2d'), W = 1600, H = 1000, a = accentOf(g), r = rng(g.id * 7919);
    const F = (w, s) => `${w} ${s}px "Inter Tight", "Segoe UI", sans-serif`;
    const box = (X, Y, w, h, rad, fill, stroke) => { x.beginPath(); x.roundRect(X, Y, w, h, rad); x.fillStyle = fill; x.fill(); if (stroke) { x.strokeStyle = stroke; x.lineWidth = 2; x.stroke(); } };
    x.fillStyle = '#0B0B0D'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#111113'; x.fillRect(0, 0, 260, H);
    box(36, 40, 34, 34, 9, a); x.fillStyle = '#fff'; x.font = F(600, 22); x.fillText('N' + pad(g.id), 84, 66);
    ['Tổng quan', 'Danh mục', 'Giao dịch', 'Phân tích', 'Học tập', 'Cài đặt'].forEach((t, k) => {
      if (!k) box(24, 112, 212, 48, 10, 'rgba(255,255,255,.07)');
      x.strokeStyle = k ? '#5E5E66' : '#fff'; x.lineWidth = 2; x.beginPath(); x.roundRect(42, 127 + k * 58, 18, 18, 5); x.stroke();
      x.fillStyle = k ? '#8E8E96' : '#fff'; x.font = F(400, 18); x.fillText(t, 74, 143 + k * 58);
    });
    x.fillStyle = '#F4F4F5'; x.font = F(600, 34); x.fillText('Tổng quan', 300, 82);
    x.fillStyle = '#8E8E96'; x.font = F(400, 16); x.fillText(g.name || '', 300, 110);
    box(1280, 48, 280, 46, 23, '#151518', 'rgba(255,255,255,.06)');
    const kpi = [['Tổng tài sản', '₫ ' + ((100 + r() * 900) | 0) + ',' + ((r() * 9) | 0) + 'M', '+' + (r() * 9 + 1).toFixed(1) + '%'], ['Lợi nhuận', '+' + (r() * 20 + 3).toFixed(1) + '%', 'Q3'], ['Mức rủi ro', 'Thấp', '2/5']];
    kpi.forEach((k, n) => {
      const X = 300 + n * 260; box(X, 150, 240, 140, 16, '#131316', 'rgba(255,255,255,.06)');
      x.fillStyle = '#8E8E96'; x.font = F(400, 16); x.fillText(k[0], X + 24, 186);
      x.fillStyle = '#F4F4F5'; x.font = F(500, 38); x.fillText(k[1], X + 24, 244);
      x.font = F(500, 14); const tw = x.measureText(k[2]).width; box(X + 216 - tw - 16, 166, tw + 16, 26, 13, a + '38'); x.fillStyle = a; x.fillText(k[2], X + 216 - tw - 8, 184);
    });
    box(300, 320, 760, 620, 16, '#131316', 'rgba(255,255,255,.06)');
    x.fillStyle = '#F4F4F5'; x.font = F(500, 20); x.fillText('Hiệu suất danh mục', 328, 362);
    x.fillStyle = '#8E8E96'; x.font = F(400, 15); x.fillText('12 tháng gần nhất', 328, 386);
    x.strokeStyle = 'rgba(255,255,255,.06)'; x.lineWidth = 2;
    for (let k = 0; k < 5; k++) { x.beginPath(); x.moveTo(328, 440 + k * 110); x.lineTo(1032, 440 + k * 110); x.stroke(); }
    let y = 300; const pts = [];
    for (let k = 0; k <= 24; k++) { y += (r() - 0.56) * 46; y = clamp(y, 60, 400); pts.push([328 + k * (704 / 24), 440 + y]); }
    const path = () => { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) { const mx = (pts[k - 1][0] + pts[k][0]) / 2; x.bezierCurveTo(mx, pts[k - 1][1], mx, pts[k][1], pts[k][0], pts[k][1]); } };
    path(); x.lineTo(1032, 880); x.lineTo(328, 880); x.closePath();
    const gr = x.createLinearGradient(0, 440, 0, 880); gr.addColorStop(0, a + '66'); gr.addColorStop(1, a + '00'); x.fillStyle = gr; x.fill();
    path(); x.strokeStyle = a; x.lineWidth = 4; x.stroke();
    const L = pts[pts.length - 1]; x.beginPath(); x.arc(L[0], L[1], 8, 0, 7); x.fillStyle = '#0B0B0D'; x.fill(); x.lineWidth = 4; x.stroke();
    x.fillStyle = '#6B6B73'; x.font = F(400, 14);
    for (let k = 0; k < 12; k++) x.fillText('T' + (k + 1), 328 + k * 62, 912);
    box(1100, 150, 460, 790, 16, '#131316', 'rgba(255,255,255,.06)');
    x.fillStyle = '#F4F4F5'; x.font = F(500, 20); x.fillText('Phân bổ tài sản', 1128, 192);
    const pct = 0.35 + r() * 0.45;
    x.lineCap = 'round'; x.lineWidth = 22; x.strokeStyle = 'rgba(255,255,255,.07)'; x.beginPath(); x.arc(1330, 340, 92, 0, 7); x.stroke();
    x.strokeStyle = a; x.beginPath(); x.arc(1330, 340, 92, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2); x.stroke(); x.lineCap = 'butt';
    x.fillStyle = '#F4F4F5'; x.font = F(500, 32); x.textAlign = 'center'; x.fillText(Math.round(pct * 100) + '%', 1330, 352); x.textAlign = 'left';
    [['Cổ phiếu', 42], ['Trái phiếu', 28], ['Tiền gửi', 18], ['Khác', 12]].forEach(([t, v], k) => {
      const Y = 530 + k * 92; x.fillStyle = '#F4F4F5'; x.font = F(400, 17); x.fillText(t, 1128, Y);
      x.fillStyle = '#8E8E96'; x.textAlign = 'right'; x.fillText(v + '%', 1532, Y); x.textAlign = 'left';
      box(1128, Y + 18, 404, 8, 4, 'rgba(255,255,255,.06)'); x.globalAlpha = 1 - k * 0.2; box(1128, Y + 18, 404 * v / 50, 8, 4, a); x.globalAlpha = 1;
    });
    x.fillStyle = '#3F3F46'; x.font = '13px "JetBrains Mono", monospace'; x.fillText('ẢNH TẠM · NHÓM ' + pad(g.id) + ' · THAY BẰNG ẢNH THẬT 1600×1000', 300, 976);
  }
  function drawBack(cv, g) {
    const x = cv.getContext('2d'), W = 800, H = 500, a = accentOf(g);
    x.fillStyle = '#0C0C0E'; x.fillRect(0, 0, W, H);
    const gr = x.createRadialGradient(W * 0.85, H * 1.1, 0, W * 0.85, H * 1.1, W * 0.8); gr.addColorStop(0, a + 'AA'); gr.addColorStop(1, a + '00');
    x.fillStyle = gr; x.fillRect(0, 0, W, H);
    x.fillStyle = '#A1A1AA'; x.font = '15px "JetBrains Mono", monospace'; x.fillText('FTU LEGACY · K63', 48, 64);
    x.fillStyle = '#F4F4F5'; x.font = '600 200px "Inter Tight", sans-serif'; x.fillText(pad(g.id), 36, 400);
    x.fillStyle = '#A1A1AA'; x.font = '500 26px "Inter Tight", sans-serif'; x.fillText(g.name || '', 48, 448);
  }
  const canvasTex = (w, h, draw, g) => {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv, g);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAX_ANISO;
    t.userData = { redraw: () => { draw(cv, g); t.needsUpdate = true; } };
    return t;
  };

  /* ---------------- 10 tấm "bia" sản phẩm ---------------- */
  const nodes = G.map((g, i) => {
    const a = (i / N) * Math.PI * 2 + 0.25;
    const baseY = 2 + Math.sin(i * 1.7) * 1.4;
    const pos = new V3(Math.sin(a) * RING_R, baseY, Math.cos(a) * RING_R);
    const col = new THREE.Color(accentOf(g));
    const root = new THREE.Group(); root.position.copy(pos); scene.add(root);
    const yaw = new THREE.Group(); root.add(yaw);

    const front = canvasTex(1600, 1000, drawMock, g);
    const back = canvasTex(800, 500, drawBack, g);
    const side = new THREE.MeshBasicMaterial({ color: 0x1A1A1E });
    const mats = [side, side, side, side, new THREE.MeshBasicMaterial({ map: front }), new THREE.MeshBasicMaterial({ map: back })];
    const W = 8, H = 5;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.22), mats);
    slab.userData.node = i;
    yaw.add(slab);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(slab.geometry), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.45 }));
    yaw.add(edges);
    const halo = glowSprite(col, 20, 0.22); halo.position.set(0, 0, -1.5); yaw.add(halo);

    // tia sáng nối xuống mặt đất + vòng đế
    const beamGeo = new THREE.BufferGeometry().setFromPoints([new V3(0, -H / 2, 0), new V3(0, GROUND_Y - baseY + 1, 0)]);
    beamGeo.setAttribute('color', new THREE.Float32BufferAttribute([col.r, col.g, col.b, 0, 0, 0], 3));
    root.add(new THREE.Line(beamGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })));
    const ringPts = new Float32Array(160 * 3);
    for (let k = 0; k < 160; k++) { const t = (k / 160) * Math.PI * 2; ringPts[k * 3] = Math.cos(t) * 4.6; ringPts[k * 3 + 1] = GROUND_Y - baseY + 1; ringPts[k * 3 + 2] = Math.sin(t) * 4.6; }
    const ringGeo = new THREE.BufferGeometry(); ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPts, 3));
    const ringMat = new THREE.PointsMaterial({ size: 0.12, color: col, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
    root.add(new THREE.Points(ringGeo, ringMat));

    // ảnh thật (chỉ khi chạy qua web server)
    const im = g.images || {};
    if (CAN_TEX && im.product) {
      new THREE.TextureLoader().load(im.product, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = MAX_ANISO;
        mats[4].map = tex; mats[4].needsUpdate = true;
        const ar = tex.image.width / tex.image.height; slab.scale.x = (H * ar) / W; edges.scale.x = slab.scale.x;
      }, undefined, () => console.warn('[FTU] Không tải được ảnh sản phẩm của nhóm ' + g.id + ':', im.product));
    }

    // nhãn HTML
    const el = document.createElement('div');
    el.className = 'nl'; el.style.setProperty('--c', accentOf(g));
    el.innerHTML = `<span class="nl__n"><i></i>${pad(g.id)}</span><span class="nl__t">${esc(g.name)}</span>`;
    $('#labels').appendChild(el);

    return { g, i, a, baseY, pos, root, yaw, slab, edges, halo, ringMat, front, back, el, hover: 0, col };
  });

  // đường nối quả cầu → từng sản phẩm (chòm sao)
  {
    const mat = new THREE.LineBasicMaterial({ color: 0x8FA2FF, transparent: true, opacity: 0.13 });
    nodes.forEach((n) => {
      const c = new THREE.QuadraticBezierCurve3(new V3(0, CORE_Y, 0), new V3(n.pos.x * 0.5, CORE_Y + 9, n.pos.z * 0.5), n.pos.clone());
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(48)), mat));
    });
    const pts = []; for (let k = 0; k <= 240; k++) { const t = (k / 240) * Math.PI * 2; pts.push(new V3(Math.sin(t) * RING_R, GROUND_Y + 1.2, Math.cos(t) * RING_R)); }
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, dashSize: 0.6, gapSize: 0.9 }));
    ring.computeLineDistances(); scene.add(ring);
  }

  // bụi lơ lửng
  const dustN = MOBILE() ? 400 : 900;
  const dustPos = new Float32Array(dustN * 3);
  { const r = rng(3); for (let k = 0; k < dustN; k++) { dustPos[k * 3] = (r() - 0.5) * 160; dustPos[k * 3 + 1] = GROUND_Y + r() * 40; dustPos[k * 3 + 2] = (r() - 0.5) * 160; } }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.08, color: 0xA9B6FF, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })));

  // vẽ lại chữ trên canvas khi font tải xong
  document.fonts && document.fonts.ready.then(() => nodes.forEach((n) => { n.front.userData.redraw(); n.back.userData.redraw(); }));

  // nhãn quả cầu
  const coreLabel = document.createElement('div');
  coreLabel.className = 'nl is-core';
  coreLabel.innerHTML = '<span class="nl__n">FTU LEGACY · K63</span><span class="nl__t">Nhấp đúp: thông tin dự án</span>';
  $('#labels').appendChild(coreLabel);

  /* ---------------- camera ---------------- */
  // trạng thái gốc (cầu toạ độ quanh target) + thị sai theo chuột
  const cam = { tx: 0, ty: MOBILE() ? 34 : 24, tz: 0, r: MOBILE() ? 150 : 118, theta: 0.6, phi: 0.62, fov: 45 };
  const HOME = () => ({ tx: 0, ty: 0, tz: 0, r: MOBILE() ? 104 : 80, phi: 1.06, fov: 45 });
  let tween = null;
  let mode = 'intro'; // intro | world | dive | node | core
  let current = -1;
  let lastInteract = -1e9;

  function flyTo(to, dur, opts = {}) {
    const from = { ...cam };
    const tgt = { ...from, ...to };
    while (tgt.theta - from.theta > Math.PI) tgt.theta -= Math.PI * 2;
    while (tgt.theta - from.theta < -Math.PI) tgt.theta += Math.PI * 2;
    tween = { from, to: tgt, t0: performance.now(), dur: RM ? Math.min(dur, 300) : dur, arc: opts.arc || 0, lift: opts.lift || 0, done: opts.done };
    $('#veil').classList.add('is-on');
  }
  const rightOf = (theta) => new V3(Math.cos(theta), 0, -Math.sin(theta));

  function nodeView(i) {
    const n = nodes[i], th = n.a, m = MOBILE();
    const t = n.pos.clone();
    if (m) t.y -= 9.6; else t.y -= 0.3;
    return { tx: t.x, ty: t.y, tz: t.z, r: m ? 36 : 21, theta: th, phi: 1.42, fov: 42 };
  }
  function coreView() {
    const th = cam.theta, m = MOBILE();
    const t = new V3(0, CORE_Y, 0);
    if (m) t.y -= 4;
    return { tx: t.x, ty: t.y, tz: t.z, r: m ? 40 : 30, theta: th, phi: 1.28, fov: 42 };
  }

  /* ---------------- con trỏ, raycast ---------------- */
  const mouse = { x: 0, y: 0, nx: 0, ny: 0, px: 0, py: 0, in: false };
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new V3(0, 1, 0), -GROUND_Y);
  const hitList = [...nodes.map((n) => n.slab), coreHit];
  let hovered = null; // index | 'core' | null
  const cursor = $('#cursor');

  function pick(cx, cy) {
    ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(hitList, false)[0];
    let ground = null; const gp = new V3();
    if (ray.ray.intersectPlane(groundPlane, gp)) ground = gp;
    return { obj: hit ? (hit.object === coreHit ? 'core' : hit.object.userData.node) : null, ground };
  }

  const canvas = renderer.domElement;
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY, theta: cam.theta, phi: cam.phi, moved: false, id: e.pointerId };
    if (mode === 'intro') intro.hold = 1;
    canvas.setPointerCapture(e.pointerId);
  });
  addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.in = true;
    mouse.nx = (e.clientX / innerWidth) * 2 - 1; mouse.ny = (e.clientY / innerHeight) * 2 - 1;
    if (drag && e.pointerId === drag.id) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
      if (drag.moved && (mode === 'world' || mode === 'dive') && !tween) {
        cam.theta = drag.theta - dx * 0.005;
        cam.phi = clamp(drag.phi - dy * 0.003, 0.55, 1.35);
        lastInteract = performance.now();
        cursor.classList.add('is-drag');
      }
    }
  });
  canvas.addEventListener('pointerleave', () => { mouse.in = false; });
  const endDrag = (e) => {
    if (!drag) return;
    const wasTap = !drag.moved;
    drag = null; cursor.classList.remove('is-drag'); intro.hold = 0;
    if (wasTap && e.pointerType !== 'mouse') onTap(e.clientX, e.clientY);
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', () => { drag = null; intro.hold = 0; });
  canvas.addEventListener('wheel', (e) => {
    if (mode !== 'world' || tween) return;
    e.preventDefault();
    cam.r = clamp(cam.r * (1 + e.deltaY * 0.0012), 44, 130);
    lastInteract = performance.now();
  }, { passive: false });

  // nhấp đúp (chuột) / chạm hai lần (cảm ứng)
  canvas.addEventListener('dblclick', (e) => onDouble(e.clientX, e.clientY));
  let lastTap = { t: 0, x: 0, y: 0 };
  function onTap(x, y) {
    const now = performance.now();
    if (now - lastTap.t < 320 && Math.hypot(x - lastTap.x, y - lastTap.y) < 36) { lastTap.t = 0; onDouble(x, y); return; }
    lastTap = { t: now, x, y };
    const p = pick(x, y); setHover(p.obj); // chạm một lần: hiện tên
  }
  function onDouble(x, y) {
    if (tween || dsOpen) return;
    if (mode === 'intro') { enterWorld(); return; }
    const p = pick(x, y);
    if (typeof p.obj === 'number') { go(mode === 'node' && p.obj === current ? `#/nhom/${nodes[p.obj].g.id}/chi-tiet` : '#/nhom/' + nodes[p.obj].g.id); return; }
    if (p.obj === 'core') { go('#/du-an'); return; }
    if (mode === 'node' || mode === 'core') { go('#/'); return; }
    if (mode === 'dive') { mode = 'world'; flyTo({ ...HOME(), theta: cam.theta }, 1500); return; }
    if (p.ground) { // sà xuống điểm vừa nhấp
      mode = 'dive';
      const d = clamp(Math.hypot(p.ground.x, p.ground.z), 0, 70);
      const k = d ? 70 / Math.max(d, 70) : 1;
      flyTo({ tx: p.ground.x * k, ty: GROUND_Y + 3, tz: p.ground.z * k, r: 30, phi: 0.98, fov: 45 }, 1600, { lift: 0.1 });
    }
  }

  function setHover(h) {
    if (h === hovered) return;
    hovered = h;
    nodes.forEach((n) => n.el.classList.toggle('is-hover', h === n.i));
    coreLabel.classList.toggle('is-hover', h === 'core');
    const onCur = mode === 'node' && h === current && !dsOpen;
    const on = (h !== null && h !== undefined && (mode === 'world' || mode === 'dive')) || onCur;
    cursor.classList.toggle('is-node', on);
    $('#cursor-t').textContent = onCur ? 'Nhấp đúp · Xem chi tiết' : h === 'core' ? 'Nhấp đúp · Dự án' : 'Nhấp đúp · Đi vào';
  }
  // con trỏ thu nhỏ trên các nút HTML
  document.addEventListener('pointerover', (e) => { cursor.classList.toggle('is-ui', !!e.target.closest('a, button, .box, .lightbox, .dossier')); });

  /* ---------------- thông tin chi tiết: nhiều ô quanh sản phẩm ---------------- */
  const detail = $('#detail'), dL = $('#d-left'), dR = $('#d-right');
  let pendingTab = 0;
  const ICO_EXPAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>';
  const ICO_CAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  const roleOf = (m) => (m.leader ? 'Nhóm trưởng' : m.role || '');
  const avatar = (m) => `<span class="av">${m.photo ? `<img src="${esc(m.photo)}" alt="" data-ini="${esc(initials(m.name))}">` : esc(initials(m.name))}</span>`;
  const photoHTML = (g) => (g.images && g.images.group ? `<img src="${esc(g.images.group)}" alt="Ảnh nhóm ${pad(g.id)}">` : `<div class="ph">${ICO_CAM}<span>Ảnh nhóm · 16:9</span></div>`);

  // ảnh sai đường dẫn: thay icon ảnh vỡ bằng ô báo lỗi ghi rõ đường dẫn (dễ phát hiện khi gắn ảnh)
  document.addEventListener('error', (e) => {
    const im = e.target;
    if (!(im instanceof HTMLImageElement) || im.dataset.failed) return;
    im.dataset.failed = '1';
    console.warn('[FTU] Không tải được ảnh:', im.getAttribute('src'));
    if (im.dataset.ini) { const t = document.createElement('span'); t.textContent = im.dataset.ini; im.replaceWith(t); return; }
    const box = document.createElement('div');
    box.className = 'ph ph--err';
    box.innerHTML = `${ICO_CAM}<span>Không tải được ảnh</span><small>${esc(im.getAttribute('src'))}</small>`;
    im.replaceWith(box);
  }, true);

  function renderProduct(i) {
    const g = G[i], ms = g.members || [];
    detail.style.setProperty('--accent', accentOf(g));
    detail.classList.remove('is-core');
    dR.innerHTML = `
      <article class="box">
        <p class="p-eyebrow"><i></i>Nhóm ${pad(g.id)} / ${esc(g.category || '')}</p>
        <h2 class="p-name">${esc(g.name)}</h2>
        <p class="p-tag">${esc(g.tagline || '')}</p>
        <div class="p-cta">${g.demoUrl ? `<a class="btn btn--solid" href="${esc(g.demoUrl)}" target="_blank" rel="noopener">Dùng thử ↗</a>` : ''}${g.repoUrl ? `<a class="btn" href="${esc(g.repoUrl)}" target="_blank" rel="noopener">Mã nguồn ↗</a>` : ''}</div>
      </article>
      <article class="box"><header class="box__h"><p class="p-label">Điểm nổi bật</p><button type="button" class="box__x" data-dossier="2">Xem tất cả ${ICO_EXPAND}</button></header><ol class="p-hl">${(g.highlights || []).slice(0, 3).map((h) => `<li><b>${esc(h.title)}</b><span>${esc(h.text)}</span></li>`).join('')}</ol></article>`;
    dL.innerHTML = `
      <article class="box box--photo" data-expand="photo" tabindex="0" role="button" aria-label="Phóng to ảnh nhóm">
        <header class="box__h"><p class="p-label">Ảnh nhóm</p><span class="box__x">Phóng to ${ICO_EXPAND}</span></header>
        <div class="d-photo">${photoHTML(g)}</div>
        ${g.motto ? `<p class="p-motto">“${esc(g.motto)}”</p>` : ''}
      </article>
      <article class="box" data-expand="team" tabindex="0" role="button" aria-label="Xem toàn bộ đội ngũ">
        <header class="box__h"><p class="p-label">Đội ngũ · ${ms.length} thành viên</p><span class="box__x">Xem tất cả ${ICO_EXPAND}</span></header>
        <ul class="d-team">${ms.map((m) => `<li${m.leader ? ' class="lead"' : ''}>${avatar(m)}<span><b>${esc(m.name)}</b><small>${esc(roleOf(m))}</small></span></li>`).join('')}</ul>
      </article>`;
    $('#d-nav').hidden = false;
    $('#pos').textContent = `${pad(i + 1)} / ${pad(N)}`;
    $('#prev-t').textContent = 'Nhóm ' + pad(G[(i - 1 + N) % N].id);
    $('#next-t').textContent = 'Nhóm ' + pad(G[(i + 1) % N].id);
    detail.scrollTop = 0; dL.scrollTop = 0; dR.scrollTop = 0;
    document.title = `Nhóm ${pad(g.id)} · ${g.name} — FTU Legacy K63`;
    if (g.images && g.images.product && !CAN_TEX) console.info('[FTU] Ảnh sản phẩm chỉ hiện trong không gian 3D khi chạy qua web server (vd GitHub Pages).');
  }
  function renderCore() {
    detail.style.setProperty('--accent', '#5B73FF');
    detail.classList.add('is-core');
    const facts = [['Học phần', `${C.course || 'NHA408E'}${C.courseName ? ' · ' + C.courseName : ''}`], ['Học kỳ', C.term || ''], ['Chương trình', `${C.cohort || 'K63'} · ${C.program || ''}`], ['Giảng viên hướng dẫn', C.lecturer || '']];
    dL.innerHTML = `
      <article class="box">
        <p class="p-eyebrow"><i></i>Dự án lớp</p>
        <h2 class="p-name">FTU Legacy K63</h2>
        <p class="p-tag">Triển lãm sản phẩm cuối học phần ${esc(C.course || 'NHA408E')} của sinh viên Khóa 63, Trường Đại học Ngoại thương. Mỗi nhóm chọn một bài toán tài chính, xây dựng sản phẩm và công khai mã nguồn.</p>
        <div class="p-cta"><a class="btn btn--solid" href="${esc(C.githubUrl || '#')}" target="_blank" rel="noopener">GitHub của lớp ↗</a>${C.k62Url ? `<a class="btn" href="${esc(C.k62Url)}" target="_blank" rel="noopener">FTU Legacy K62 ↗</a>` : ''}</div>
      </article>
      <article class="box"><dl class="p-facts p-facts--grid">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></article>`;
    dR.innerHTML = `
      <article class="box"><p class="p-label">${N} sản phẩm · bấm để xem</p><ul class="d-list">${G.map((g) => `<li><button type="button" data-go="${g.id}" style="--c:${accentOf(g)}"><span class="mono">${pad(g.id)}</span><span>${esc(g.name)}</span></button></li>`).join('')}</ul></article>`;
    $('#d-nav').hidden = true;
    document.title = 'Thông tin dự án — FTU Legacy K63';
  }
  const showPanel = (on) => { detail.hidden = !on; $('#labels').classList.toggle('is-off', on); $('#index').classList.toggle('is-on', !on && mode !== 'intro'); $('#hint').classList.toggle('is-on', !on && mode !== 'intro'); };
  detail.addEventListener('click', (e) => {
    const go1 = e.target.closest('[data-go]'); if (go1) { go('#/nhom/' + go1.dataset.go); return; }
    const dz = e.target.closest('[data-dossier]'); if (dz) { pendingTab = +dz.dataset.dossier; go(`#/nhom/${G[current].id}/chi-tiet`); return; }
    const b = e.target.closest('[data-expand]'); if (b && !e.target.closest('a')) openLB(b.dataset.expand);
  });
  detail.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-expand]')) { e.preventDefault(); openLB(e.target.dataset.expand); } });

  // ô phóng to
  const lb = $('#lightbox'), lbCard = $('#lb-card');
  let lbFocus = null;
  function openLB(kind) {
    const g = G[current]; if (!g) return;
    const ms = g.members || [];
    const head = (title) => `<header class="lb__h"><div><p class="p-eyebrow"><i></i>Nhóm ${pad(g.id)} · ${esc(g.name)}</p><h3>${title}</h3></div><button type="button" class="lb__close" data-close aria-label="Đóng">✕</button></header>`;
    lbCard.innerHTML = kind === 'photo'
      ? `${head('Ảnh nhóm')}<div class="lb__photo">${photoHTML(g)}</div>${g.motto ? `<p class="p-motto">“${esc(g.motto)}”</p>` : ''}`
      : `${head(`Đội ngũ · ${ms.length} thành viên`)}<ul class="lb__team">${ms.map((m) => `<li${m.leader ? ' class="lead"' : ''}><div class="lb__pic">${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" data-ini="${esc(initials(m.name))}">` : `<span>${esc(initials(m.name))}</span>`}</div><b>${esc(m.name)}</b><small>${esc(roleOf(m))}</small></li>`).join('')}</ul>`;
    lb.style.setProperty('--accent', accentOf(g));
    lbFocus = document.activeElement;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-on'));
    lbCard.querySelector('[data-close]').focus();
  }
  function closeLB() {
    if (lb.hidden) return false;
    lb.classList.remove('is-on');
    setTimeout(() => { lb.hidden = true; }, 300);
    if (lbFocus && lbFocus.focus) lbFocus.focus();
    return true;
  }
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.closest('[data-close]')) closeLB(); });

  /* ---------------- hồ sơ chi tiết sản phẩm ---------------- */
  const TABS = [['tong-quan', 'Tổng quan'], ['nguoi-dung', 'Đối tượng người dùng'], ['tinh-nang', 'Tính năng'], ['hanh-trinh', 'Hành trình phát triển'], ['cong-nghe', 'Công nghệ & kết quả'], ['hinh-anh', 'Hình ảnh']];
  const ICO_USER = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';
  const ds = $('#dossier'), dsPanel = $('#ds-panel'), dsTabs = $('#ds-tabs');
  let dsOpen = false, dsTab = 0, dsFocus = null;
  const mockURL = (i) => { try { return nodes[i].front.image.toDataURL('image/jpeg', 0.85); } catch (e) { return ''; } };

  function dsContent(g, key) {
    const d = g.details || {}, i = G.indexOf(g);
    switch (key) {
      case 'tong-quan': return `
        <div><h3 class="ds-h">Bài toán & giải pháp</h3><p class="ds-lead">${esc(g.tagline || '')}</p></div>
        <div class="ds-grid2">
          <article class="ds-card"><p class="p-label">Bài toán</p><p>${esc(d.problem || '')}</p></article>
          <article class="ds-card"><p class="p-label">Giải pháp</p><p>${esc(d.solution || '')}</p></article>
        </div>
        <dl class="ds-meta">
          <div><dt>Nhóm</dt><dd>${pad(g.id)}</dd></div><div><dt>Lĩnh vực</dt><dd>${esc(g.category || '')}</dd></div>
          <div><dt>Thành viên</dt><dd>${(g.members || []).length} người</dd></div><div><dt>Học phần</dt><dd>${esc(C.course || 'NHA408E')}</dd></div>
        </dl>`;
      case 'nguoi-dung': return `
        <div><h3 class="ds-h">Sản phẩm dành cho ai</h3><p class="ds-lead">Những nhóm người dùng nhóm hướng tới, họ cần gì và đang gặp khó khăn gì.</p></div>
        <div class="ds-grid${Math.min(3, Math.max(2, (d.users || []).length))}">${(d.users || []).map((u) => `
          <article class="ds-card ds-persona">
            <div class="ds-persona__h"><span class="ds-persona__ic">${ICO_USER}</span><b>${esc(u.name)}</b></div>
            <p>${esc(u.desc || '')}</p>
            <div class="ds-lists">
              <div><p class="p-label">Nhu cầu</p><ul>${(u.needs || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
              <div class="pains"><p class="p-label">Khó khăn</p><ul>${(u.pains || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
            </div>
          </article>`).join('')}</div>`;
      case 'tinh-nang': {
        const f = d.features && d.features.length ? d.features : g.highlights || [];
        return `
        <div><h3 class="ds-h">Toàn bộ tính năng</h3><p class="ds-lead">${f.length} tính năng chính của sản phẩm.</p></div>
        <div class="ds-grid3">${f.map((x, k) => `<article class="ds-feat"><span class="mono">${pad(k + 1)}</span><b>${esc(x.title)}</b><span>${esc(x.text)}</span></article>`).join('')}</div>`;
      }
      case 'hanh-trinh': return `
        <div><h3 class="ds-h">Hành trình phát triển</h3><p class="ds-lead">Từ ý tưởng đến sản phẩm hoàn chỉnh.</p></div>
        <ol class="ds-tl">${(d.journey || []).map((s) => `<li><span class="mono">${esc(s.phase)}</span><b>${esc(s.title)}</b><span>${esc(s.text)}</span></li>`).join('')}</ol>`;
      case 'cong-nghe': {
        const links = [
          g.demoUrl && { href: g.demoUrl, t: 'Dùng thử sản phẩm', sub: g.demoUrl },
          g.repoUrl && { href: g.repoUrl, t: 'Mã nguồn', sub: g.repoUrl },
          g.dossierUrl && { href: g.dossierUrl, t: 'Hồ sơ đầy đủ & góp ý', sub: 'Xem trang chi tiết của nhóm' },
        ].filter(Boolean);
        return `
        <div><h3 class="ds-h">Công nghệ & kết quả</h3><p class="ds-lead">Công cụ nhóm sử dụng và sản phẩm hoàn chỉnh.</p></div>
        <div class="ds-stack">
          <article class="ds-card"><p class="p-label">Công nghệ sử dụng</p><div class="ds-chips">${(d.tech || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div></article>
          ${links.length ? `<article class="ds-card"><p class="p-label">Kết quả · sản phẩm</p><div class="ds-links">${links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener"><span><b>${l.t}</b><small>${esc(l.sub.replace(/^https?:\/\//, ''))}</small></span><i aria-hidden="true">↗</i></a>`).join('')}</div></article>` : ''}
        </div>`;
      }
      case 'hinh-anh': {
        const shots = (d.gallery || []).length ? d.gallery.map((src) => `<div class="ds-shot"><img src="${esc(src)}" alt="Ảnh màn hình ${esc(g.name)}" loading="lazy"></div>`)
          : [`<div class="ds-shot">${(g.images && g.images.product) ? `<img src="${esc(g.images.product)}" alt="">` : `<img src="${mockURL(i)}" alt="Giao diện mẫu">`}</div>`, ...[2, 3].map((n) => `<div class="ds-shot"><div class="ph">${ICO_CAM}<span>Ảnh màn hình ${n}</span></div></div>`)];
        return `
        <div><h3 class="ds-h">Hình ảnh sản phẩm</h3><p class="ds-lead">Các màn hình chính của sản phẩm.</p></div>
        <div class="ds-gallery">${shots.join('')}</div>`;
      }
    }
    return '';
  }
  function dsShow(k) {
    const g = G[current]; if (!g) return;
    dsTab = (k + TABS.length) % TABS.length;
    [...dsTabs.children].forEach((b, n) => { b.setAttribute('aria-selected', String(n === dsTab)); b.tabIndex = n === dsTab ? 0 : -1; });
    dsPanel.innerHTML = dsContent(g, TABS[dsTab][0]);
    dsPanel.setAttribute('aria-label', TABS[dsTab][1]);
    dsPanel.scrollTop = 0;
    $('#ds-pos').textContent = `${pad(dsTab + 1)} / ${pad(TABS.length)}`;
    $('#ds-prev').disabled = dsTab === 0; $('#ds-next').disabled = dsTab === TABS.length - 1;
    $('#ds-prev-t').textContent = dsTab > 0 ? TABS[dsTab - 1][1] : '';
    $('#ds-next-t').textContent = dsTab < TABS.length - 1 ? TABS[dsTab + 1][1] : '';
    const active = dsTabs.children[dsTab]; if (active && active.scrollIntoView && MOBILE()) active.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
  function openDossier(i, tab = 0) {
    const g = G[i]; if (!g) return;
    ds.style.setProperty('--accent', accentOf(g));
    $('#ds-eyebrow').innerHTML = `<i></i>Hồ sơ sản phẩm · Nhóm ${pad(g.id)} / ${esc(g.category || '')}`;
    $('#ds-title').textContent = g.name;
    dsTabs.innerHTML = TABS.map(([, label], n) => `<button type="button" role="tab" data-tab="${n}"><span class="mono">${pad(n + 1)}</span><span>${label}</span></button>`).join('');
    dsShow(tab);
    if (!dsOpen) {
      dsOpen = true; dsFocus = document.activeElement;
      showPanel(false);
      const v = nodeView(i);
      flyTo({ ...v, r: v.r * 0.5, fov: 38 }, RM ? 1 : 1000);
      ds.hidden = false;
      requestAnimationFrame(() => ds.classList.add('is-on'));
      if (FINE) setTimeout(() => dsTabs.children[dsTab] && dsTabs.children[dsTab].focus({ preventScroll: true }), 60);
    }
    document.title = `Hồ sơ · ${g.name} — FTU Legacy K63`;
  }
  function closeDossier(silent) {
    if (!dsOpen) return;
    dsOpen = false;
    ds.classList.remove('is-on');
    setTimeout(() => { if (!dsOpen) ds.hidden = true; }, 450);
    if (!silent && current >= 0) {
      flyTo(nodeView(current), RM ? 1 : 900, { done: () => showPanel(true) });
      document.title = `Nhóm ${pad(G[current].id)} · ${G[current].name} — FTU Legacy K63`;
      if (dsFocus && dsFocus.focus) dsFocus.focus({ preventScroll: true });
    }
  }
  dsTabs.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) dsShow(+b.dataset.tab); });
  dsTabs.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); dsShow(dsTab + (e.key === 'ArrowDown' ? 1 : -1)); dsTabs.children[dsTab].focus(); }
  });
  $('#ds-prev').addEventListener('click', () => dsShow(dsTab - 1));
  $('#ds-next').addEventListener('click', () => dsShow(dsTab + 1));
  $('#ds-close').addEventListener('click', () => go('#/nhom/' + G[current].id));
  $('#more').addEventListener('click', () => go(`#/nhom/${G[current].id}/chi-tiet`));
  ds.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });

  /* ---------------- điều hướng ---------------- */
  const go = (h) => { if (location.hash === h) route(); else location.hash = h; };
  function enterWorld(then) {
    if (mode !== 'intro') { then && then(); return; }
    mode = 'world';
    $('#intro').classList.add('is-gone'); cursor.classList.remove('is-intro');
    intro.target = 1; intro.hold = 0;
    $('#index').classList.add('is-on');
    $('#hint').classList.add('is-on');
    flyTo({ ...HOME(), theta: cam.theta - 0.9 }, then ? 1400 : 2800, { done: then });
  }
  function enterNode(i, after) {
    const fromNode = mode === 'node' && current >= 0 && current !== i;
    mode = 'node'; current = i;
    showPanel(false);
    U.uAccent.value.set(accentOf(G[i]));
    renderProduct(i);
    document.querySelectorAll('.index button').forEach((b, k) => b.classList.toggle('is-on', k === i));
    flyTo(nodeView(i), fromNode ? 1700 : 1900, { arc: fromNode ? 14 : 6, lift: fromNode ? 0.25 : 0.08, done: () => { showPanel(true); after && after(); } });
  }
  function enterCore() {
    mode = 'core'; current = -1;
    showPanel(false); renderCore();
    document.querySelectorAll('.index button').forEach((b) => b.classList.remove('is-on'));
    flyTo(coreView(), 1700, { arc: 6, done: () => showPanel(true) });
  }
  function backToWorld() {
    if (mode === 'world' || mode === 'intro') return;
    mode = 'world'; current = -1;
    showPanel(false);
    document.querySelectorAll('.index button').forEach((b) => b.classList.remove('is-on'));
    document.title = 'FTU Legacy K63 — Triển lãm sản phẩm';
    flyTo({ ...HOME(), theta: cam.theta }, 1700, { lift: 0.1 });
  }
  function route() {
    const h = location.hash || '#/';
    const m = h.match(/^#\/nhom\/(\d+)(\/chi-tiet)?/);
    if (m) {
      const i = G.findIndex((g) => g.id === +m[1]);
      if (i >= 0) {
        const wantD = !!m[2];
        const tab = pendingTab; pendingTab = 0;
        if (mode === 'node' && current === i) { if (wantD) openDossier(i, tab); else closeDossier(); return; }
        closeDossier(true);
        const after = wantD ? () => openDossier(i, tab) : null;
        enterWorld(() => enterNode(i, after)); if (mode !== 'intro' && !tween) enterNode(i, after);
        return;
      }
    }
    closeDossier(true);
    if (h.startsWith('#/du-an')) { enterWorld(() => enterCore()); if (mode !== 'intro' && !tween) enterCore(); return; }
    backToWorld();
  }
  addEventListener('hashchange', route);

  $('#enter').addEventListener('click', () => enterWorld());
  $('#back').addEventListener('click', () => go('#/'));
  $('#prev').addEventListener('click', () => go('#/nhom/' + G[(current - 1 + N) % N].id));
  $('#next').addEventListener('click', () => go('#/nhom/' + G[(current + 1) % N].id));
  $('#index').innerHTML = G.map((g) => `<button type="button" style="--c:${accentOf(g)}" aria-label="Nhóm ${pad(g.id)}: ${esc(g.name)}" data-id="${g.id}">${pad(g.id)}</button>`).join('');
  $('#index').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go('#/nhom/' + b.dataset.id); });
  document.querySelector('[data-home]').addEventListener('click', (e) => { e.preventDefault(); go('#/'); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && closeLB()) return;
    if (!lb.hidden) return;
    if (dsOpen) {
      if (e.key === 'Escape') go('#/nhom/' + G[current].id);
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.target.closest('input, textarea')) { e.preventDefault(); dsShow(dsTab + (e.key === 'ArrowRight' ? 1 : -1)); }
      return;
    }
    if (e.key === 'Escape' && mode !== 'world' && mode !== 'intro') { if (mode === 'dive') { mode = 'world'; flyTo({ ...HOME(), theta: cam.theta }, 1400); } else go('#/'); }
    if (mode === 'intro' && (e.key === 'Enter' || e.key === ' ') && document.activeElement === document.body) enterWorld();
    if (mode === 'node' && !tween) {
      if (e.key === 'ArrowRight') go('#/nhom/' + G[(current + 1) % N].id);
      if (e.key === 'ArrowLeft') go('#/nhom/' + G[(current - 1 + N) % N].id);
    }
  });

  /* ---------------- màn mở đầu: chữ "K63" dựng bằng hạt (gắn vào camera) ----------------
     Di chuột: hạt bị đẩy ra, xoáy quanh con trỏ và sáng lên · Giữ chuột: hạt bị hút về con trỏ
     Lúc mở trang: hạt bay từ sau lưng người xem vào và xếp thành chữ · Bước vào: hạt nổ tung, lao qua người xem */
  scene.add(camera);
  const IT_D = 40;
  const IU = {
    uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() }, uMouse: { value: new THREE.Vector2(999, 999) },
    uMouseOn: { value: 0 }, uHold: { value: 0 }, uExplode: { value: 1 },
  };
  const intro = { pts: null, explode: 1, target: 0, hold: 0, active: true };
  const introMat = new THREE.ShaderMaterial({
    uniforms: IU, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uPx, uMouseOn, uHold, uExplode; uniform vec2 uMouse;
      attribute vec3 aCol; attribute float aRand; varying vec3 vCol; varying float vA;
      void main() {
        vec3 p = position; float t = uTime;
        p.z += sin(t * 1.1 + aRand * 6.28) * 0.35;
        p.xy += vec2(sin(t * 0.7 + aRand * 10.0), cos(t * 0.6 + aRand * 7.0)) * 0.06;
        vec2 d = p.xy - uMouse; float dist = length(d) + 0.0001; vec2 dir = d / dist;
        float f = exp(-dist * dist / 7.0) * uMouseOn;
        p.xy += (dir * 2.4 + vec2(-dir.y, dir.x) * 1.6 * (0.5 + aRand)) * f * (1.0 - uHold);
        p.z += f * (2.0 + aRand * 3.0) * (1.0 - uHold);
        float g = exp(-dist * dist / 160.0) * uHold;
        float a = t * 2.0 + aRand * 6.28;
        vec2 orbit = uMouse + vec2(cos(a), sin(a)) * (0.6 + aRand * 2.2);
        p.xy = mix(p.xy, orbit, g * 0.92);
        float e = uExplode * uExplode;
        p.xy *= 1.0 + e * (1.5 + aRand * 3.5);
        p.z += e * (34.0 + aRand * 30.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float depth = max(-mv.z, 0.8);
        vCol = aCol + vec3(0.55, 0.62, 0.95) * (f * 1.4 + g * 0.8);
        vA = (0.5 + 0.5 * f + 0.3 * g) * (1.0 - smoothstep(0.7, 1.0, uExplode)) * smoothstep(0.6, 5.0, -mv.z);
        gl_PointSize = vA < 0.004 ? 0.0 : min((0.9 + aRand * 1.0) * uPx * (40.0 / depth) * (1.0 + f * 0.8), 22.0 * uPx);
      }`,
    fragmentShader: `
      varying vec3 vCol; varying float vA;
      void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(vCol, smoothstep(0.5, 0.05, d) * vA); }`,
  });
  function buildIntro() {
    if (!intro.active) return;
    if (intro.pts) { camera.remove(intro.pts); intro.pts.geometry.dispose(); }
    const two = MOBILE() || camera.aspect < 1.1;
    const lines = two ? ['FTU Legacy', 'K63'] : ['FTU Legacy K63'];
    const W = two ? 1500 : 2200, H = two ? 640 : 380, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `600 ${two ? 250 : 320}px "Inter Tight", "Segoe UI", sans-serif`;
    if ('letterSpacing' in x) x.letterSpacing = '-12px';
    lines.forEach((t, k) => x.fillText(t, W / 2, H / 2 + (k - (lines.length - 1) / 2) * (two ? 270 : 330) + 20));
    const data = x.getImageData(0, 0, W, H).data, pts = [];
    for (let yy = 0; yy < H; yy += 3) for (let xx = 0; xx < W; xx += 3) if (data[(yy * W + xx) * 4 + 3] > 140) pts.push([xx, yy]);
    const r = rng(11);
    for (let k = pts.length - 1; k > 0; k--) { const j = (r() * (k + 1)) | 0; [pts[k], pts[j]] = [pts[j], pts[k]]; }
    const nText = Math.min(MOBILE() ? 9000 : 22000, pts.length), nDust = MOBILE() ? 700 : 1600, n = nText + nDust;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), rnd = new Float32Array(n);
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * IT_D, halfW = halfH * camera.aspect;
    const textW = Math.min(halfW * 2 * (two ? 0.92 : 0.74), halfH * 2 * (two ? 1.2 : 2.6)), s = textW / W;
    const accents = G.map((g) => new THREE.Color(accentOf(g))), base = new THREE.Color('#DDE3FF');
    for (let k = 0; k < n; k++) {
      let px, py, pz;
      if (k < nText) { const [xx, yy] = pts[k]; px = (xx - W / 2) * s + (r() - 0.5) * s * 2; py = -(yy - H / 2) * s + (r() - 0.5) * s * 2 + halfH * (two ? 0.14 : 0.16); pz = (r() - 0.5) * 1.4; }
      else { px = (r() - 0.5) * halfW * 2.4; py = (r() - 0.5) * halfH * 2.4; pz = -r() * 24; }
      pos[k * 3] = px; pos[k * 3 + 1] = py; pos[k * 3 + 2] = pz - IT_D;
      const c = r() < 0.16 ? accents[(r() * accents.length) | 0] : base;
      col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
      rnd[k] = r();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
    intro.pts = new THREE.Points(geo, introMat);
    intro.pts.frustumCulled = false; intro.pts.renderOrder = 10;
    camera.add(intro.pts);
  }
  (document.fonts ? document.fonts.load('600 100px "Inter Tight"').catch(() => {}) : Promise.resolve()).then(buildIntro);
  function updateIntro(dt, D) {
    if (!intro.pts) return;
    IU.uTime.value += dt;
    intro.explode = lerp(intro.explode, intro.target, D(intro.target ? 0.045 : 0.028));
    IU.uExplode.value = intro.explode;
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * IT_D;
    if (mouse.in) IU.uMouse.value.lerp(new THREE.Vector2(mouse.nx * halfH * camera.aspect, -mouse.ny * halfH), D(0.2));
    IU.uMouseOn.value = lerp(IU.uMouseOn.value, mouse.in && mode === 'intro' ? 1 : 0, D(0.08));
    IU.uHold.value = lerp(IU.uHold.value, intro.hold, D(intro.hold ? 0.06 : 0.1));
    if (intro.target === 1 && intro.explode > 0.985) {
      camera.remove(intro.pts); intro.pts.geometry.dispose(); intro.pts = null; intro.active = false;
    }
  }

  /* ---------------- vòng lặp ---------------- */
  const par = { x: 0, y: 0 };      // thị sai đã làm mượt
  const cur = { x: innerWidth / 2, y: innerHeight / 2 };
  const groundMouse = new THREE.Vector2(999, 999);
  let last = performance.now(), time = 0, fovNow = 45;
  const tmp = new V3();

  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now; time += dt;
    const D = (k) => 1 - Math.pow(1 - k, dt * 60); // làm mượt không phụ thuộc FPS
    U.uTime.value = time;
    U.uReveal.value = Math.min(U.uReveal.value + dt * 70, 200);
    updateIntro(dt, D);
    if (mode === 'intro') { cursor.classList.add('is-intro'); $('#cursor-t').textContent = intro.hold ? 'Đang hút…' : 'Nhấp đúp để vào triển lãm'; }

    // bay
    if (tween) {
      const k = clamp((now - tween.t0) / tween.dur, 0, 1), e = ease(k), s = Math.sin(Math.PI * k);
      for (const key of ['tx', 'ty', 'tz', 'r', 'theta', 'phi', 'fov']) cam[key] = lerp(tween.from[key], tween.to[key], e);
      cam.r += s * tween.arc; cam.phi -= s * tween.lift; cam.fov += s * 9;
      if (k >= 1) { const d = tween.done; tween = null; $('#veil').classList.remove('is-on'); d && d(); }
    } else if ((mode === 'world' || mode === 'intro') && !drag && !RM && now - lastInteract > 3500) {
      cam.theta += dt * (mode === 'intro' ? 0.06 : 0.025);
    }

    // thị sai theo chuột
    const pk = mode === 'node' || mode === 'core' ? 0.35 : 1;
    par.x = lerp(par.x, mouse.in ? mouse.nx : 0, D(0.045));
    par.y = lerp(par.y, mouse.in ? mouse.ny : 0, D(0.045));
    const th = cam.theta - par.x * 0.16 * pk, ph = clamp(cam.phi - par.y * 0.07 * pk, 0.2, 1.48);
    camera.position.set(cam.tx + cam.r * Math.sin(ph) * Math.sin(th), cam.ty + cam.r * Math.cos(ph), cam.tz + cam.r * Math.sin(ph) * Math.cos(th));
    tmp.set(cam.tx, cam.ty, cam.tz).add(rightOf(th).multiplyScalar(par.x * 1.2 * pk));
    camera.lookAt(tmp);
    if (Math.abs(fovNow - cam.fov) > 0.01) { fovNow = cam.fov; camera.fov = fovNow; camera.updateProjectionMatrix(); }

    // chuột trên mặt đất → gợn sóng; hover
    if (mouse.in && !drag) {
      const p = pick(mouse.x, mouse.y);
      if (p.ground) groundMouse.lerp(new THREE.Vector2(p.ground.x, p.ground.z), 0.25);
      if (FINE && !tween) setHover(mode === 'intro' ? null : p.obj);
    }
    U.uMouse.value.copy(groundMouse);
    U.uMouseAmp.value = lerp(U.uMouseAmp.value, mouse.in && mode !== 'node' && mode !== 'core' ? 1 : 0, D(0.05));
    const focus = mode === 'node' && current >= 0 ? nodes[current].pos : null;
    if (focus) U.uFocus.value.set(focus.x, focus.z);
    U.uFocusAmp.value = lerp(U.uFocusAmp.value, focus ? 1 : 0, D(0.04));

    // con trỏ
    cur.x = lerp(cur.x, mouse.x, D(0.22)); cur.y = lerp(cur.y, mouse.y, D(0.22));
    cursor.style.transform = `translate(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px)`;
    cursor.classList.toggle('is-on', FINE && mouse.in);

    // quả cầu
    globe.rotation.y += dt * 0.12;
    globe.rotation.x = lerp(globe.rotation.x, par.y * 0.25, 0.05);
    globe.rotation.z = lerp(globe.rotation.z, -par.x * 0.2, 0.05);
    core.scale.setScalar(lerp(core.scale.x, hovered === 'core' ? 1.08 : 1, 0.1));

    // sản phẩm
    nodes.forEach((n) => {
      n.root.position.y = n.baseY + Math.sin(time * 0.6 + n.i * 1.3) * 0.35;
      const target = mode === 'node' && current === n.i ? th : Math.atan2(camera.position.x - n.root.position.x, camera.position.z - n.root.position.z);
      let d = target - n.yaw.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
      n.yaw.rotation.y += d * D(0.08);
      n.yaw.rotation.x = lerp(n.yaw.rotation.x, par.y * 0.12, 0.06);
      const hv = (hovered === n.i && mode !== 'node') || current === n.i ? 1 : 0;
      n.hover = lerp(n.hover, hv, D(0.12));
      n.yaw.scale.setScalar(1 + (current === n.i ? 0 : n.hover * 0.08));
      n.edges.material.opacity = 0.35 + n.hover * 0.6;
      n.halo.material.opacity = 0.18 + n.hover * 0.3;
      n.ringMat.opacity = 0.5 + n.hover * 0.5;
    });

    // bụi trôi lên
    const dp = dustGeo.attributes.position.array;
    for (let k = 0; k < dustN; k++) { dp[k * 3 + 1] += dt * 0.35; if (dp[k * 3 + 1] > GROUND_Y + 40) dp[k * 3 + 1] = GROUND_Y; }
    dustGeo.attributes.position.needsUpdate = true;

    // nhãn HTML
    const showLabels = mode !== 'intro';
    nodes.forEach((n) => placeLabel(n.el, tmp.copy(n.root.position).setY(n.root.position.y + 3.6), showLabels));
    placeLabel(coreLabel, tmp.set(0, CORE_Y + 9.5, 0), showLabels);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  function placeLabel(el, p, show) {
    p.project(camera);
    const vis = show && p.z < 1 && Math.abs(p.x) < 1.1 && Math.abs(p.y) < 1.1;
    el.style.opacity = vis ? 1 : 0;
    if (vis) el.style.transform = `translate(${((p.x + 1) / 2 * innerWidth).toFixed(1)}px, ${((1 - p.y) / 2 * innerHeight).toFixed(1)}px) translate(-50%, -100%)`;
  }

  addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    U.uPx.value = renderer.getPixelRatio(); IU.uPx.value = U.uPx.value;
    if (intro.active && intro.target === 0) buildIntro();
  });

  // vào thẳng nếu link trỏ tới một nhóm / thông tin dự án
  if (/^#\/(nhom|du-an)/.test(location.hash)) {
    U.uReveal.value = 200;
    Object.assign(cam, HOME(), { theta: 0.4 });
    mode = 'world'; intro.active = false; intro.target = 1; intro.explode = 1;
    $('#intro').classList.add('is-gone'); $('#index').classList.add('is-on');
    route();
  }
  requestAnimationFrame(frame);
})();
