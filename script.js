/* ============================================================
   1) SCROLL REVEAL — แก้บั๊ก: ก่อนหน้านี้ไฟล์นี้ว่างเปล่า ทำให้
      ทุก section ที่มี class="reveal" ค้างที่ opacity:0 ตลอดไป
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
   2) CUSTOM CURSOR — จุดทองตามเมาส์ ขยายตอน hover ปุ่ม/ลิงก์/การ์ด
   ============================================================ */
const cursor = document.getElementById('cursor');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let tx = cx, ty = cy;

document.addEventListener('mousemove', e => {
  tx = e.clientX;
  ty = e.clientY;
});

function moveCursor() {
  cx += (tx - cx) * 0.2;
  cy += (ty - cy) * 0.2;
  cursor.style.transform = `translate(${cx - 5}px, ${cy - 5}px)`;
  requestAnimationFrame(moveCursor);
}
moveCursor();

const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-tag, .card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});


/* ============================================================
   3) RAINBOW MOUSE TRAIL
   ============================================================ */
const trailCanvas = document.getElementById('trail-canvas');
const tctx = trailCanvas.getContext('2d');
let tw, th;
function resizeTrail() { tw = trailCanvas.width = window.innerWidth; th = trailCanvas.height = window.innerHeight; }
resizeTrail();
window.addEventListener('resize', resizeTrail);

let hue = 0;
const points = [];
const MAX_POINTS = 40;
let mouseX = tw / 2, mouseY = th / 2;
let smoothX = mouseX, smoothY = mouseY;
let moving = false;
let idleTimer = null;
let trailOpacity = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  moving = true;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { moving = false; }, 100);
});

function animateTrail() {
  smoothX += (mouseX - smoothX) * 0.15;
  smoothY += (mouseY - smoothY) * 0.15;

  trailOpacity = moving
    ? Math.min(1, trailOpacity + 0.08)
    : Math.max(0, trailOpacity - 0.04);

  hue = (hue + 2.5) % 360;
  points.unshift({ x: smoothX, y: smoothY, hue });
  if (points.length > MAX_POINTS) points.pop();

  tctx.clearRect(0, 0, tw, th);

  if (trailOpacity > 0) {
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      const t = 1 - i / MAX_POINTS;
      tctx.beginPath();
      tctx.moveTo(prev.x, prev.y);
      tctx.lineTo(p.x, p.y);
      tctx.strokeStyle = `hsla(${p.hue}, 100%, 62%, ${t * trailOpacity * 0.9})`;
      tctx.lineWidth = t * 8 + 1;
      tctx.lineCap = 'round';
      tctx.lineJoin = 'round';
      tctx.shadowColor = `hsl(${p.hue}, 100%, 65%)`;
      tctx.shadowBlur = 8;
      tctx.stroke();
    }
    tctx.shadowBlur = 0;
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();


/* ============================================================
   4) AMBIENT GOLD PARTICLES — ฝุ่นทองลอยเบาๆ พื้นหลัง
   ============================================================ */
const pCanvas = document.getElementById('particles-canvas');
const pctx = pCanvas.getContext('2d');
let pw, ph;
function resizeParticles() { pw = pCanvas.width = window.innerWidth; ph = pCanvas.height = window.innerHeight; }
resizeParticles();
window.addEventListener('resize', resizeParticles);

const PARTICLE_COUNT = 36;
const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * pw,
  y: Math.random() * ph,
  r: Math.random() * 1.6 + 0.4,
  speed: Math.random() * 0.3 + 0.08,
  drift: (Math.random() - 0.5) * 0.15,
  alpha: Math.random() * 0.35 + 0.1,
}));

function animateParticles() {
  pctx.clearRect(0, 0, pw, ph);
  particles.forEach(p => {
    p.y -= p.speed;
    p.x += p.drift;
    if (p.y < -10) { p.y = ph + 10; p.x = Math.random() * pw; }
    if (p.x < -10) p.x = pw + 10;
    if (p.x > pw + 10) p.x = -10;

    pctx.beginPath();
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(212, 168, 75, ${p.alpha})`;
    pctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ============================================================
   5) SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${pct})`;
}


/* ============================================================
   6) ACTIVE NAV LINK ตาม section ที่กำลังมองเห็น
   ============================================================ */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section, footer');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => navObserver.observe(sec));


/* ============================================================
   7) BACK TO TOP BUTTON
   ============================================================ */
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > window.innerHeight * 0.6) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   8) PROJECT CARD 3D TILT ตามเมาส์
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(600px) rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ============================================================
   9) ปุ่ม "ดูผลงาน" — หันหน้าตามเมาส์ทั่วทั้งหน้าจอตลอดเวลา
      (ไม่ต้องแตะปุ่มก่อน) + ขยาย/เรืองแสงตอน hover จริงๆ
   ============================================================ */
const heroBtn = document.querySelector('.hero-btn');

if (heroBtn) {
  let btnTiltX = 0, btnTiltY = 0, btnTargetX = 0, btnTargetY = 0;
  let btnScale = 1, btnTargetScale = 1;
  const MAX_TILT = 22; // องศาเอียงสูงสุด

  // ใช้ตำแหน่งเมาส์ทั้งหน้าจอ ไม่ใช่แค่ตอนอยู่บนปุ่ม
  document.addEventListener('mousemove', e => {
    const rect = heroBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // normalize ตามขนาดจอ แล้ว clamp ไม่ให้เอียงเกิน MAX_TILT
    const nx = Math.max(-1, Math.min(1, dx / (window.innerWidth / 2)));
    const ny = Math.max(-1, Math.min(1, dy / (window.innerHeight / 2)));

    btnTargetY = nx * MAX_TILT;   // หมุนซ้าย-ขวา ตามแนวนอนของเมาส์
    btnTargetX = ny * -MAX_TILT;  // หมุนบน-ล่าง ตามแนวตั้งของเมาส์
  });

  // ขยาย + เรืองแสง เฉพาะตอนเมาส์อยู่บนปุ่มจริงๆ
  heroBtn.addEventListener('mouseenter', () => { btnTargetScale = 1.12; });
  heroBtn.addEventListener('mouseleave', () => { btnTargetScale = 1; });

  function animateBtnTilt() {
    btnTiltX += (btnTargetX - btnTiltX) * 0.1;
    btnTiltY += (btnTargetY - btnTiltY) * 0.1;
    btnScale  += (btnTargetScale - btnScale) * 0.15;

    heroBtn.style.transform =
      `perspective(500px) rotateX(${btnTiltX}deg) rotateY(${btnTiltY}deg) scale(${btnScale})`;

    requestAnimationFrame(animateBtnTilt);
  }
  animateBtnTilt();
}


window.addEventListener('scroll', () => {
  const bookSection = document.getElementById('hero-book-section');
  if (!bookSection) return;

  const rect = bookSection.getBoundingClientRect();
  const sectionHeight = bookSection.offsetHeight;
  const viewHeight = window.innerHeight;

  let progress = -rect.top / (sectionHeight - viewHeight);
  progress = Math.max(0, Math.min(1, progress)); // บีบช่วง 0 - 1

  // 1. คุมการกางเปิดของปกหน้า
  const frontCover = document.querySelector('.book-cover.front');
  if (frontCover) {
    const rotateAngle = progress * -150; 
    frontCover.style.transform = `rotateY(${rotateAngle}deg)`;

    // ถ้าเปิดสมุดไประดับนึงแล้ว ให้เมาส์ทะลุผ่านหน้าปกหน้าไปเลย เส้นสีรุ้งจะได้ไม่ขาดตอน
    if (progress > 0.15) {
      frontCover.style.pointerEvents = 'none';
    } else {
      frontCover.style.pointerEvents = 'auto';
    }
  }

  // 2. คุมเอฟเฟกต์แสงไฟขาววิ้งรอบขอบ และฝุ่นทองลอยฟุ้งกระจาย
  const laserGlow = document.querySelector('.inner-laser-glow');
  const pageParticles = document.querySelector('.page-particles');
  const innerContent = document.querySelector('.inner-content');
  const pageMain = document.querySelector('.book-page.page-main');
  
  if (laserGlow) {
    let glowProgress = Math.max(0, Math.min(1, (progress - 0.15) / 0.85));
    laserGlow.style.opacity = glowProgress;
    laserGlow.style.transform = `scale(${0.4 + glowProgress * 0.8}) rotate(${glowProgress * 45}deg)`;
  }

  if (pageParticles) {
    let partProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.95));
    pageParticles.style.opacity = partProgress * 0.85;
  }

  if (pageMain) {
    let edgeProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.6));
    pageMain.style.borderColor = `rgba(255, 255, 255, ${edgeProgress * 0.2})`;
    pageMain.style.boxShadow = `0 0 40px rgba(255, 255, 255, ${edgeProgress * 0.06})`;
  }

  if (innerContent) {
    let contentProgress = Math.max(0, Math.min(1, (progress - 0.35) / 0.65));
    innerContent.style.opacity = contentProgress;
    innerContent.style.transform = `translateY(${25 - (contentProgress * 25)}px)`;
  }
  
  // 3. ปรับมุมมององศา 3D
  const book3D = document.querySelector('.book-3d');
  if (book3D) {
    const currentRotateX = 12 - (progress * 8); 
    const currentRotateY = -8 + (progress * 16); 
    book3D.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
  }
});
