'use strict';

const MENSAJES = [
  '¿Por qué eres tan inteligente y a la vez bonita?',
  '¿Sabías que eres el amor de mi vida?',
  '¿Ya te dije que me siento orgulloso de ti?',
  'Confío y siempre confiaré en ti',
  'Qué chimba tener una novia tan maravillosa como tú',
  'Juntitos foreveeer',
  'Me encanta cada detalle de ti',
];

const floatingLayer = document.getElementById('floating-layer');

function rectsOverlap(x, y, w, h, rect, margin) {
  return (
    x < rect.right  + margin &&
    x + w > rect.left  - margin &&
    y < rect.bottom + margin &&
    y + h > rect.top   - margin
  );
}

function spawnFloatingMessage() {
  const text = MENSAJES[Math.floor(Math.random() * MENSAJES.length)];

  const span = document.createElement('span');
  span.className = 'floating-msg';
  if (window.innerWidth < 600) span.classList.add('floating-msg--narrow');
  span.textContent = text;

  // Medir el tamaño real antes de posicionar
  span.style.visibility = 'hidden';
  span.style.left = '-9999px';
  span.style.top = '0';
  floatingLayer.appendChild(span);
  const MSG_W = span.offsetWidth;
  const MSG_H = span.offsetHeight;
  span.style.visibility = '';
  span.style.left = '';

  const MARGIN = 20;
  const avoidEls = ['.carta', '.hero-content', '.cierre'];
  const avoidRects = avoidEls
    .map(sel => document.querySelector(sel))
    .filter(Boolean)
    .map(el => el.getBoundingClientRect());

  const maxLeft = Math.max(0, window.innerWidth  - MSG_W - 8);
  const maxTop  = Math.max(0, window.innerHeight - MSG_H - 8);

  let x, y, tries = 0;
  do {
    x = 8 + Math.floor(Math.random() * maxLeft);
    y = 8 + Math.floor(Math.random() * maxTop);
    tries++;
  } while (
    avoidRects.some(r => rectsOverlap(x, y, MSG_W, MSG_H, r, MARGIN)) &&
    tries < 15
  );

  if (tries >= 15) { span.remove(); return; }

  span.style.left = x + 'px';
  span.style.top  = y + 'px';

  span.addEventListener('animationend', () => span.remove(), { once: true });
}

setInterval(spawnFloatingMessage, 4000);
setTimeout(spawnFloatingMessage, 900);

// Animación de entrada al hacer scroll
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
sections.forEach(s => observer.observe(s));
