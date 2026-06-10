'use strict';

/* ============================================================
   CANVAS FX — Partículas de fondo
   ============================================================ */
const fx   = document.getElementById('fx');
const fxCx = fx.getContext('2d');

function resizeFx() {
  fx.width  = window.innerWidth;
  fx.height = window.innerHeight;
}
window.addEventListener('resize', resizeFx);
resizeFx();

/* ------ Paleta festiva ------ */
const PALETTE = ['#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#ff9a00','#c77dff','#ff4da6','#00d4ff'];

/* ============================================================
   Confeti
   ============================================================ */
const confettiList = [];

function spawnConfetti(n) {
  for (let i = 0; i < n; i++) {
    confettiList.push({
      x:  Math.random() * fx.width,
      y:  -10 - Math.random() * fx.height * 0.3,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      w:  6 + Math.random() * 6,
      h:  4 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.2,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      alpha: 0.85 + Math.random() * 0.15,
      life:  1,
    });
  }
}

function tickConfetti() {
  for (let i = confettiList.length - 1; i >= 0; i--) {
    const c = confettiList[i];
    c.x     += c.vx;
    c.y     += c.vy;
    c.angle += c.spin;
    c.vx    += (Math.random() - 0.5) * 0.1;
    if (c.y > fx.height + 20) confettiList.splice(i, 1);
  }
}

function drawConfetti() {
  confettiList.forEach(c => {
    fxCx.save();
    fxCx.globalAlpha = c.alpha;
    fxCx.translate(c.x, c.y);
    fxCx.rotate(c.angle);
    fxCx.fillStyle = c.color;
    fxCx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    fxCx.restore();
  });
}

/* ============================================================
   Corazones
   ============================================================ */
const hearts = [];

function spawnHeart(x, y, burst) {
  const n = burst ? 10 : 1;
  for (let i = 0; i < n; i++) {
    hearts.push({
      x:     x ?? Math.random() * fx.width,
      y:     y ?? fx.height + 20,
      vx:    (Math.random() - 0.5) * (burst ? 4 : 1.5),
      vy:    -(1.5 + Math.random() * 2.5),
      size:  14 + Math.random() * 20,
      alpha: 0.7 + Math.random() * 0.3,
      life:  1,
    });
  }
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
  ctx.bezierCurveTo(x - size * 0.5, y + size * 0.65, x, y + size * 0.9, x, y + size);
  ctx.bezierCurveTo(x, y + size * 0.9, x + size * 0.5, y + size * 0.65, x + size * 0.5, y + size * 0.3);
  ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
  ctx.closePath();
  ctx.fill();
}

function tickHearts() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.x    += h.vx;
    h.y    += h.vy;
    h.life -= 0.008;
    h.alpha = h.life * 0.9;
    if (h.life <= 0 || h.y < -40) hearts.splice(i, 1);
  }
}

function drawHearts() {
  hearts.forEach(h => {
    fxCx.save();
    fxCx.globalAlpha = h.alpha;
    fxCx.fillStyle = '#ff6b9d';
    drawHeart(fxCx, h.x - h.size / 2, h.y - h.size / 2, h.size);
    fxCx.restore();
  });
}

/* ============================================================
   Globos
   ============================================================ */
const balloons = [];

function spawnBalloon() {
  balloons.push({
    x:     30 + Math.random() * (fx.width - 60),
    y:     fx.height + 80,
    vy:    -(0.6 + Math.random() * 0.8),
    vx:    (Math.random() - 0.5) * 0.4,
    sway:  Math.random() * Math.PI * 2,
    size:  24 + Math.random() * 20,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    alpha: 0.75 + Math.random() * 0.2,
  });
}

function tickBalloons() {
  for (let i = balloons.length - 1; i >= 0; i--) {
    const b = balloons[i];
    b.sway += 0.03;
    b.x    += b.vx + Math.sin(b.sway) * 0.3;
    b.y    += b.vy;
    if (b.y < -100) balloons.splice(i, 1);
  }
}

function drawBalloons() {
  balloons.forEach(b => {
    fxCx.save();
    fxCx.globalAlpha = b.alpha;
    // cuerpo
    fxCx.beginPath();
    fxCx.ellipse(b.x, b.y, b.size * 0.72, b.size, 0, 0, Math.PI * 2);
    fxCx.fillStyle = b.color;
    fxCx.fill();
    // brillo
    fxCx.beginPath();
    fxCx.ellipse(b.x - b.size * 0.2, b.y - b.size * 0.3, b.size * 0.2, b.size * 0.3, -0.4, 0, Math.PI * 2);
    fxCx.fillStyle = 'rgba(255,255,255,0.35)';
    fxCx.fill();
    // hilo
    fxCx.beginPath();
    fxCx.moveTo(b.x, b.y + b.size);
    fxCx.quadraticCurveTo(b.x + 8, b.y + b.size + 20, b.x, b.y + b.size + 40);
    fxCx.strokeStyle = b.color;
    fxCx.lineWidth = 1;
    fxCx.globalAlpha = b.alpha * 0.6;
    fxCx.stroke();
    fxCx.restore();
  });
}

/* ============================================================
   Fuegos artificiales
   ============================================================ */
const rockets  = [];
const sparkles = [];

function launchRocket(forced) {
  const x = 60 + Math.random() * (fx.width - 120);
  const targetY = 60 + Math.random() * (fx.height * 0.45);
  rockets.push({
    x,
    y: fx.height,
    targetY,
    vy: -10 - Math.random() * 6,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    trail: [],
  });
}

function explode(x, y, color) {
  const n = 60 + Math.floor(Math.random() * 40);
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
    const speed = 2 + Math.random() * 5;
    sparkles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color,
      size: 2 + Math.random() * 2,
    });
  }
}

function tickRockets() {
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.trail.push({ x: r.x, y: r.y });
    if (r.trail.length > 8) r.trail.shift();
    r.y += r.vy;
    r.vy *= 0.97;
    if (r.y <= r.targetY || r.vy > -0.5) {
      explode(r.x, r.y, r.color);
      rockets.splice(i, 1);
    }
  }
}

function tickSparkles() {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.x     += s.vx;
    s.y     += s.vy;
    s.vy    += 0.1;  // gravity
    s.vx    *= 0.98;
    s.alpha -= 0.018;
    if (s.alpha <= 0) sparkles.splice(i, 1);
  }
}

function drawRockets() {
  rockets.forEach(r => {
    // estela
    r.trail.forEach((pt, idx) => {
      fxCx.beginPath();
      fxCx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      fxCx.fillStyle = r.color;
      fxCx.globalAlpha = (idx / r.trail.length) * 0.5;
      fxCx.fill();
    });
    // punta
    fxCx.beginPath();
    fxCx.arc(r.x, r.y, 3, 0, Math.PI * 2);
    fxCx.fillStyle = '#fff';
    fxCx.globalAlpha = 1;
    fxCx.fill();
  });
  fxCx.globalAlpha = 1;
}

function drawSparkles() {
  sparkles.forEach(s => {
    fxCx.save();
    fxCx.globalAlpha = Math.max(0, s.alpha);
    fxCx.beginPath();
    fxCx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    fxCx.fillStyle = s.color;
    fxCx.shadowBlur = 6;
    fxCx.shadowColor = s.color;
    fxCx.fill();
    fxCx.restore();
  });
}

/* ============================================================
   LOOP PRINCIPAL
   ============================================================ */
let frame = 0;
let blownOut = false;

function loop() {
  fxCx.clearRect(0, 0, fx.width, fx.height);

  frame++;

  // Confeti continuo suave
  if (frame % 4 === 0 && confettiList.length < 120) spawnConfetti(3);
  // Más confeti tras soplar
  if (blownOut && frame % 2 === 0 && confettiList.length < 350) spawnConfetti(6);

  // Corazones flotando suaves
  if (frame % 60 === 0) spawnHeart();
  if (blownOut && frame % 20 === 0) spawnHeart(
    fx.width * 0.2 + Math.random() * fx.width * 0.6,
    fx.height * 0.5 + Math.random() * fx.height * 0.4,
    false
  );

  // Globos
  if (frame % 90 === 0 && balloons.length < 12) spawnBalloon();

  // Fuegos artificiales
  const rocketInterval = blownOut ? 35 : 90;
  if (frame % rocketInterval === 0) launchRocket();

  // Ticks
  tickConfetti();
  tickHearts();
  tickBalloons();
  tickRockets();
  tickSparkles();

  // Dibujo (fondo al frente)
  drawBalloons();
  drawHearts();
  drawConfetti();
  drawRockets();
  drawSparkles();

  requestAnimationFrame(loop);
}

loop();

/* ============================================================
   INTERACCIÓN — Soplar velas
   ============================================================ */
const blowBtn    = document.getElementById('blow-btn');
const dedicatoria = document.getElementById('dedicatoria');
const flames     = document.querySelectorAll('.flame');
const candles    = document.querySelectorAll('.candle');
const cakeMouth  = document.getElementById('cake-mouth');
const eyeLeft    = document.getElementById('eye-left');
const eyeRight   = document.getElementById('eye-right');

blowBtn.addEventListener('click', () => {
  if (blownOut) return;
  blownOut = true;

  // Apagar llamas una a una
  flames.forEach((f, i) => {
    setTimeout(() => {
      f.classList.add('out');
      candles[i].classList.add('blown');
    }, i * 120);
  });

  // Cambiar carita a enamorada
  setTimeout(() => {
    cakeMouth.classList.add('love');
    eyeLeft.textContent  = '🩷';
    eyeRight.textContent = '🩷';
    eyeLeft.style.fontSize  = '11px';
    eyeRight.style.fontSize = '11px';
    eyeLeft.style.background  = 'none';
    eyeRight.style.background = 'none';
    eyeLeft.style.borderRadius  = '0';
    eyeRight.style.borderRadius = '0';
  }, 700);

  // Ráfaga de corazones
  setTimeout(() => {
    const cx = fx.width / 2;
    const cy = fx.height / 2;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnHeart(cx + (Math.random()-0.5)*200, cy + (Math.random()-0.5)*200, true), i * 200);
    }
  }, 600);

  // Fuegos artificiales extra
  setTimeout(() => {
    for (let i = 0; i < 5; i++) setTimeout(launchRocket, i * 180);
  }, 400);

  // Mostrar dedicatoria
  setTimeout(() => {
    dedicatoria.classList.add('show');
  }, 1200);

  // Ocultar botón
  blowBtn.classList.add('hidden');
});
