/* NP+ · Landing de inscripción */

// Datos a completar por NP+. El número va con código de país, sin + ni espacios (ej: 5491112345678).
const NP_CONFIG = {
  whatsapp: '',
};

document.documentElement.classList.add('js');

// ---------- WhatsApp ----------
function waLink(message) {
  const text = encodeURIComponent(message);
  return NP_CONFIG.whatsapp
    ? `https://wa.me/${NP_CONFIG.whatsapp}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

function trackLead(source) {
  if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: source });
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'whatsapp_click', source });
}

document.querySelectorAll('[data-wa]').forEach((el) => {
  el.href = waLink(el.dataset.wa);
  el.target = '_blank';
  el.rel = 'noopener';
  el.addEventListener('click', () => trackLead(el.dataset.wa));
});

// ---------- Reserva en dos toques ----------
const form = document.getElementById('reserva');
const preview = document.getElementById('wa-preview');

function buildMessage() {
  const motivo = form.querySelector('input[name="motivo"]:checked').value;
  const cuando = form.querySelector('input[name="cuando"]:checked').value;
  const quiero = cuando.startsWith('por ahora') ? cuando : `me gustaría ${cuando}`;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return `Hola. ${cap(motivo)}. ${cap(quiero)}. ¿Me pasan el programa completo?`;
}

if (form) {
  form.addEventListener('change', () => { preview.textContent = buildMessage(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = buildMessage();
    trackLead('reserva');
    window.open(waLink(message), '_blank', 'noopener');
  });
}

// ---------- Menú en celular ----------
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); };
  toggle.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ---------- Aparición al hacer scroll ----------
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// ---------- Carrusel de la comunidad ----------
const carousel = document.querySelector('.carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.carousel__slide')];
  const dotsBox = carousel.querySelector('.carousel__dots');
  const N = slides.length;
  const INTERVAL = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 1;
  let timer = null;

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Foto ${i + 1} de ${N}`);
    b.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(b);
    return b;
  });

  function render() {
    slides.forEach((slide, i) => {
      let off = ((i - current) % N + N) % N;
      if (off > N / 2) off -= N;
      slide.style.setProperty('--off', off);
      slide.classList.toggle('is-active', off === 0);
      slide.classList.toggle('is-near', Math.abs(off) <= 1);
      slide.setAttribute('aria-hidden', String(Math.abs(off) > 1));
    });
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
  }

  function goTo(i) {
    current = (i + N) % N;
    render();
    restart();
  }

  function restart() {
    clearTimeout(timer);
    if (reduceMotion || document.hidden) return;
    timer = setTimeout(() => goTo(current + 1), INTERVAL);
  }

  let swiped = false;
  slides.forEach((s, i) => s.addEventListener('click', () => {
    if (swiped) { swiped = false; return; }
    if (i !== current) goTo(i);
  }));

  document.addEventListener('visibilitychange', restart);

  // Deslizar con el dedo
  let startX = null;
  const track = carousel.querySelector('.carousel__track');
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  track.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) { swiped = true; goTo(current + (dx < 0 ? 1 : -1)); }
  });

  render();
  restart();
}

// ---------- Barra fija en celular ----------
const sticky = document.getElementById('sticky');
const hero = document.querySelector('.hero');
const enroll = document.getElementById('inscripcion');
if (sticky && hero && 'IntersectionObserver' in window) {
  let heroVisible = true;
  let enrollVisible = false;
  const update = () => {
    const show = !heroVisible && !enrollVisible;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', String(!show));
    sticky.querySelector('a').tabIndex = show ? 0 : -1;
  };
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe(hero);
  if (enroll) new IntersectionObserver(([e]) => { enrollVisible = e.isIntersecting; update(); }).observe(enroll);
}
