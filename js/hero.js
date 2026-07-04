/* ==========================================================================
   HERO — Three.js globe + particle field + animated stat counters
   ========================================================================== */
(function () {
  function initHeroStats() {
    const el = document.getElementById('heroStats');
    if (!el) return;
    DC_DATA.heroStats.forEach(s => {
      const div = document.createElement('div');
      div.className = 'hero-stat';
      div.innerHTML = `<div class="val"><span class="accent">${s.prefix || ''}</span><span class="count" data-target="${s.value}">0</span>${s.suffix}${s.unit ? ' <span class="accent">' + s.unit + '</span>' : ''}</div><div class="lbl">${s.label}</div>`;
      el.appendChild(div);
    });
  }

  function animateCount(node, target, duration = 1800) {
    const isDecimal = target % 1 !== 0;
    const finalText = isDecimal ? target.toFixed(1) : target.toLocaleString();
    if (document.hidden) { node.textContent = finalText; return; } // backgrounded tab: rAF won't fire, skip straight to final
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      node.textContent = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else node.textContent = finalText;
    }
    requestAnimationFrame(tick);
  }

  window.triggerCounters = function (root) {
    (root || document).querySelectorAll('.count[data-target]:not(.done)').forEach(node => {
      node.classList.add('done');
      animateCount(node, parseFloat(node.dataset.target));
    });
  };

  function initHelix() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    function resize() {
      const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // Group holds the helix rotated 90° so its axis runs horizontally,
    // spanning the landscape hero banner left-to-right instead of top-to-bottom.
    const group = new THREE.Group();
    group.rotation.z = Math.PI / 2;
    scene.add(group);

    // --- glyph textures: small canvas-baked "code characters" with a soft glow ---
    const GLYPHS = "01{}[]<>/\\#$%01A9F0".split('');
    function makeGlyphTexture(char) {
      const size = 96;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.35, 'rgba(255,255,255,0.35)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      ctx.font = '700 34px "JetBrains Mono", "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fillText(char, size / 2, size / 2 + 1);
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    }
    const glyphTextures = GLYPHS.map(makeGlyphTexture);

    // --- helix strands built from glowing glyph sprites ---
    const TURNS = 5;
    const STEPS = 220;
    const RADIUS = 1.5;
    const LENGTH = 12.5;
    const BLUE = new THREE.Color(0x5eb3ff);
    const CYAN = new THREE.Color(0x22e2ee);
    const ORANGE = new THREE.Color(0xffb066);

    const strandSprites = [];
    const rungLines = [];

    function buildStrand(phase) {
      for (let i = 0; i < STEPS; i++) {
        const t = i / STEPS;
        const angle = t * Math.PI * 2 * TURNS + phase;
        const y = t * LENGTH - LENGTH / 2;
        const x = Math.cos(angle) * RADIUS;
        const z = Math.sin(angle) * RADIUS;
        const tex = glyphTextures[(i + (phase > 0 ? 7 : 0)) % glyphTextures.length];
        const mat = new THREE.SpriteMaterial({
          map: tex, color: BLUE.clone(), transparent: true,
          blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8
        });
        const sprite = new THREE.Sprite(mat);
        const scale = 0.22 + Math.sin(i * 0.7) * 0.03;
        sprite.scale.set(scale, scale, scale);
        sprite.position.set(x, y, z);
        group.add(sprite);
        strandSprites.push({ sprite, t, phase });
      }
    }
    buildStrand(0);
    buildStrand(Math.PI);

    const RUNG_EVERY = 5;
    for (let i = 0; i < STEPS; i += RUNG_EVERY) {
      const t = i / STEPS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = t * LENGTH - LENGTH / 2;
      const p1 = new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
      const p2 = new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS);
      const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const mat = new THREE.LineBasicMaterial({ color: 0x3b8dff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
      const line = new THREE.Line(geo, mat);
      group.add(line);
      rungLines.push({ line, t });
    }

    // Particle field (stars) — not rotated with the helix group
    const starGeo = new THREE.BufferGeometry();
    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x8fc9ff, size: 0.018, transparent: true, opacity: 0.65 });
    scene.add(new THREE.Points(starGeo, starMat));

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    camera.position.set(0, 0, 8.5);

    const clock = new THREE.Clock();
    const reduced = window.PREFERS_REDUCED_MOTION;
    function animate() {
      const t = reduced ? 0.6 : clock.getElapsedTime();

      // slow spin around the helix's own (now horizontal) axis, plus mouse parallax
      group.rotation.x = reduced ? 0 : t * 0.12 + mouseY * 0.3;
      group.rotation.y = reduced ? 0 : mouseX * 0.25;

      // traveling warm highlight band sweeping along the strand
      const bandCenter = (Math.sin(t * 0.4) * 0.5 + 0.5);
      const bandWidth = 0.1;
      strandSprites.forEach(s => {
        const dist = Math.abs(s.t - bandCenter);
        const glow = Math.max(0, 1 - dist / bandWidth);
        const base = s.phase === 0 ? BLUE : CYAN;
        s.sprite.material.color.copy(base).lerp(ORANGE, glow);
        s.sprite.material.opacity = 0.6 + glow * 0.4 + (reduced ? 0 : Math.sin(t * 3 + s.t * 20) * 0.05);
      });
      rungLines.forEach(r => {
        const dist = Math.abs(r.t - bandCenter);
        const glow = Math.max(0, 1 - dist / bandWidth);
        r.line.material.color.copy(new THREE.Color(0x3b8dff)).lerp(ORANGE, glow);
        r.line.material.opacity = 0.18 + glow * 0.5;
      });

      if (!reduced) camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    if (reduced) animate(); // reduced-motion: exactly one static frame
    else window.rafGate(canvas, animate); // runs only while hero is in view
    canvas.classList.add('ready');
  }

  function initHeroText() {
    if (typeof gsap === 'undefined' || window.PREFERS_REDUCED_MOTION) return; // text renders in place, no slide-up reveal
    gsap.from('.hero h1 .line span', {
      y: '110%', duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.2
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroStats();
    initHelix();
    initHeroText();
    setTimeout(() => window.triggerCounters(document.getElementById('heroStats')), 500);
  });
})();
