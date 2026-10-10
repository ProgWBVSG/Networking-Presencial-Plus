/* NP+ · Globo del mundo con el sello NP+ (basado en el componente GlobePulse de cobe, sin React) */
import createGlobe from './vendor/cobe.esm.js';

const section = document.querySelector('.country');
const canvas = document.getElementById('globe');

if (section && canvas) {
  const wrap = canvas.closest('.globe');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ciudades con el sello NP+. Buenos Aires es el origen de los arcos.
  const cities = [
    { id: 'baires', location: [-34.6, -58.38], size: 0.04 },
    { id: 'saopaulo', location: [-23.55, -46.63] },
    { id: 'lima', location: [-12.05, -77.04] },
    { id: 'bogota', location: [4.71, -74.07] },
    { id: 'mexico', location: [19.43, -99.13] },
    { id: 'miami', location: [25.76, -80.19] },
    { id: 'losangeles', location: [34.05, -118.24] },
    { id: 'madrid', location: [40.42, -3.7] },
    { id: 'panama', location: [8.98, -79.52] },
  ];
  const origin = cities[0].location;

  // Arranca mirando América del Sur y gira sola
  const toPhi = (lng) => Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);
  const baseTheta = 0.28;
  let phi = toPhi(-62);

  let globe = null;
  let rafId = 0;
  let running = false;
  let drag = null;
  const offset = { phi: 0, theta: 0 };

  function addPins() {
    cities.forEach((c, i) => {
      const pin = document.createElement('span');
      pin.className = 'globe__pin';
      pin.setAttribute('aria-hidden', 'true');
      pin.style.setProperty('position-anchor', `--cobe-${c.id}`);
      pin.style.setProperty('--d', `${(i * 0.37).toFixed(2)}s`);
      pin.style.opacity = `var(--cobe-visible-${c.id}, 0)`;
      pin.innerHTML = '<i></i><i></i><b></b>';
      wrap.appendChild(pin);
    });
  }

  function init() {
    const width = canvas.offsetWidth;
    if (!width || globe) return;
    globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi,
      theta: baseTheta,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 8,
      baseColor: [0.39, 0.65, 0.67],
      markerColor: [0.98, 0.81, 0.18],
      glowColor: [0.2, 0.23, 0.34],
      markerElevation: 0.01,
      markers: cities.map((c) => ({ location: c.location, size: c.size || 0.025, id: c.id })),
      arcs: cities.slice(1).map((c) => ({ from: origin, to: c.location, id: `ba-${c.id}` })),
      arcColor: [0.98, 0.81, 0.18],
      arcWidth: 0.45,
      arcHeight: 0.22,
      opacity: 0.85,
    });
    addPins();
    canvas.style.opacity = '1';
    if (reduceMotion) globe.update({ phi, theta: baseTheta });
  }

  function frame() {
    if (!running) return;
    if (!drag && !reduceMotion) phi += 0.0035;
    globe.update({ phi: phi + offset.phi, theta: baseTheta + offset.theta });
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    init();
    if (!globe || running) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(rafId); }

  // Solo se dibuja cuando la sección está a la vista
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: '200px' }).observe(section);

  // Arrastrar para girarlo
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; canvas.style.cursor = 'grabbing'; });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    offset.phi = (e.clientX - drag.x) / 260;
    offset.theta = Math.max(-0.6, Math.min(0.6, (e.clientY - drag.y) / 600));
  }, { passive: true });
  window.addEventListener('pointerup', () => {
    if (!drag) return;
    phi += offset.phi;
    offset.phi = 0;
    offset.theta *= 0.5;
    drag = null;
    canvas.style.cursor = 'grab';
  }, { passive: true });
}
