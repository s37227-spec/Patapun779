// ===== CSS Cat — rotates toward mouse position =====
// Pure CSS draws the cat; this script only updates two CSS variables
// (--cat-rx, --cat-ry) so the cat tilts toward the cursor.

(function () {
  const cat = document.getElementById('cat');
  const stage = document.getElementById('catStage');
  if (!cat || !stage) return;

  const MAX_TILT = 16; // degrees, keeps the tilt subtle and natural
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;

  function updateFromPointer(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (clientX - centerX) / (window.innerWidth / 2);
    const dy = (clientY - centerY) / (window.innerHeight / 2);

    // Invert Y so moving the mouse up tilts the cat's head up
    targetRY = Math.max(-1, Math.min(1, dx)) * MAX_TILT;
    targetRX = Math.max(-1, Math.min(1, -dy)) * MAX_TILT;
  }

  window.addEventListener('mousemove', (e) => {
    updateFromPointer(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      updateFromPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Smoothly ease current rotation toward target rotation each frame
  function animate() {
    currentRX += (targetRX - currentRX) * 0.08;
    currentRY += (targetRY - currentRY) * 0.08;

    cat.style.setProperty('--cat-rx', currentRX.toFixed(2) + 'deg');
    cat.style.setProperty('--cat-ry', currentRY.toFixed(2) + 'deg');

    requestAnimationFrame(animate);
  }

  animate();
})();
