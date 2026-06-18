// ===== 3D Ambient Background (Three.js) =====
// Gold wireframe + crystal shapes drifting in space, subtle parallax on mouse move.

(function () {
  const container = document.getElementById('bg-3d');
  if (!container || typeof THREE === 'undefined') return;

  const GOLD = 0xd4a84b;
  const GOLD_DIM = 0x8a6f33;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // ---- Lighting ----
  const ambient = new THREE.AmbientLight(0x222222, 1.2);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(GOLD, 1.4, 60);
  keyLight.position.set(8, 6, 14);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xffffff, 0.25, 60);
  rimLight.position.set(-10, -6, 8);
  scene.add(rimLight);

  // ---- Shape factory ----
  const shapes = [];
  const group = new THREE.Group();
  scene.add(group);

  function makeGeometry(type, size) {
    switch (type) {
      case 'octa':
        return new THREE.OctahedronGeometry(size, 0);
      case 'icosa':
        return new THREE.IcosahedronGeometry(size, 0);
      case 'tetra':
        return new THREE.TetrahedronGeometry(size, 0);
      case 'torus':
        return new THREE.TorusGeometry(size * 0.7, size * 0.22, 8, 24);
      case 'box':
        return new THREE.BoxGeometry(size, size, size);
      default:
        return new THREE.OctahedronGeometry(size, 0);
    }
  }

  const types = ['octa', 'icosa', 'tetra', 'torus', 'box'];
  const COUNT = 16;

  for (let i = 0; i < COUNT; i++) {
    const type = types[i % types.length];
    const size = THREE.MathUtils.randFloat(0.6, 2.1);
    const geo = makeGeometry(type, size);

    let mesh;
    // Mix of wireframe outlines and faint solid faces for depth variety
    if (i % 3 === 0) {
      const material = new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 0.6,
        roughness: 0.35,
        transparent: true,
        opacity: 0.16,
      });
      mesh = new THREE.Mesh(geo, material);
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 })
      );
      mesh.add(line);
    } else {
      const edges = new THREE.EdgesGeometry(geo);
      mesh = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color: i % 2 === 0 ? GOLD : GOLD_DIM,
          transparent: true,
          opacity: THREE.MathUtils.randFloat(0.35, 0.65),
        })
      );
    }

    // Spread shapes through 3D space, biased away from dead center so text stays clean
    const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.6;
    const radius = THREE.MathUtils.randFloat(6, 15);
    mesh.position.set(
      Math.cos(angle) * radius * THREE.MathUtils.randFloat(0.6, 1.3),
      THREE.MathUtils.randFloat(-9, 9),
      THREE.MathUtils.randFloat(-12, 4)
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    mesh.userData = {
      rotSpeedX: THREE.MathUtils.randFloat(-0.15, 0.15),
      rotSpeedY: THREE.MathUtils.randFloat(-0.18, 0.18),
      floatSpeed: THREE.MathUtils.randFloat(0.15, 0.4),
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
    };

    group.add(mesh);
    shapes.push(mesh);
  }

  // ---- Faint particle field for depth ----
  const particleCount = 180;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = THREE.MathUtils.randFloatSpread(40);
    particlePositions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(30);
    particlePositions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(30) - 10;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: GOLD,
    size: 0.05,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Mouse parallax ----
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / width) * 2 - 1;
    mouseY = (e.clientY / height) * 2 - 1;
  });

  // ---- Scroll-based depth drift ----
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // ---- Resize ----
  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', handleResize);

  // ---- Reduced motion respect ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Animation loop ----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    const delta = clock.getDelta();

    if (!prefersReducedMotion) {
      shapes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotSpeedX * delta;
        mesh.rotation.y += mesh.userData.rotSpeedY * delta;
        mesh.position.y =
          mesh.userData.baseY +
          Math.sin(elapsed * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.6;
      });

      particles.rotation.y += delta * 0.01;
    }

    // Smooth camera parallax toward mouse
    targetRotX += (mouseY * 0.18 - targetRotX) * 0.04;
    targetRotY += (mouseX * 0.22 - targetRotY) * 0.04;
    group.rotation.x = targetRotX * 0.3;
    group.rotation.y = targetRotY * 0.3;

    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    // Gentle depth shift on scroll (parallax through the page)
    const scrollFactor = scrollY * 0.0025;
    group.position.y = scrollFactor * 1.5;
    camera.position.z = 18 - Math.min(scrollY * 0.002, 3);

    renderer.render(scene, camera);
  }

  animate();
})();
