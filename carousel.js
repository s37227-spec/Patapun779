// ============================================================
// ตั้งค่ารูปภาพ — ใส่ path รูปจริงตรงนี้
// ============================================================
const CARDS = [
  'url("cat.jpg")',
  'url("m1.jpg")',
  'url("cat2.png")',
  'url("cat3.jpg")',
  'url("cat4.jpg")',
];

// ============================================================
// ค่า config ปรับได้
// ============================================================
const CARD_W = 160;   // ความกว้างการ์ด (px)
const CARD_H = 210;   // ความสูงการ์ด (px)
const GAP    = 30;    // ระยะห่างระหว่างการ์ด (px)
const SPEED  = 0.7;   // ความเร็วเลื่อน
const TILT   = 50;    // องศาเอียงสูงสุด

// ============================================================
// สร้างการ์ด (ไม่ต้องแก้ส่วนนี้)
// ============================================================
const N      = CARDS.length;
const STEP   = CARD_W + GAP;
const totalW = N * STEP;
const track  = document.getElementById('track');
const scene  = track.parentElement; // .scene — กว้างเท่า 100vw เสมอ

// ทำซ้ำให้พอเต็มจอเสมอ
const REPEATS = Math.max(3, Math.ceil((window.innerWidth * 2.5) / totalW) + 1);

for (let rep = 0; rep < REPEATS; rep++) {
  CARDS.forEach(bg => {
    const el = document.createElement('div');
    el.className = 'card';
    el.style.background = bg;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    track.appendChild(el);
  });
}

const allCards = Array.from(track.children);
let offset = 0;

function update() {
  offset = (offset + SPEED) % totalW;

  // ใช้ .scene กว้างเท่าหน้าจอจริง (100vw) เสมอ
  const cw = scene.getBoundingClientRect().width || window.innerWidth;
  const cx = cw / 2;

  allCards.forEach((card, idx) => {
    const i    = idx % N;
    const rep  = Math.floor(idx / N);
    const baseX = i * STEP + rep * totalW - offset - (totalW * Math.floor(REPEATS / 2));
    const dist  = baseX + CARD_W / 2;
    const norm  = dist / (cw * 0.45);
    const absN  = Math.abs(norm);

    if (absN > 2.6) { card.style.opacity = 0; return; }

    const scale = Math.max(0.35, 1 - absN * 0.55);
    const rotY  = norm * TILT;
    const tz    = (1 - absN) * 80;
    const alpha = Math.max(0, 1 - absN * 0.62);
    const tx    = baseX - CARD_W / 2;

    card.style.transform = `translateX(${tx}px) translateY(-50%) perspective(900px) rotateY(${rotY}deg) scale(${scale}) translateZ(${tz}px)`;
    card.style.opacity   = alpha;
    card.style.zIndex    = Math.round((1 - absN) * 20);
  });

  requestAnimationFrame(update);
}

update();
