/* NP+ · Globo de Argentina (basado en el componente GlobePulse de cobe, sin React) */
import createGlobe from './vendor/cobe.esm.js';

const section = document.querySelector('.country');
const canvas = document.getElementById('globe');

if (section && canvas) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ciudades: Buenos Aires es el origen de la red; el resto muestra que la academia virtual llega a todo el país.
  const cities = [
    { id: 'baires', location: [-34.6, -58.38], size: 0.045 },
    { id: 'cordoba', location: [-31.42, -64.18], size: 0.04 },
    { id: 'rosario', location: [-32.95, -60.65] },
    { id: 'mendoza', location: [-32.89, -68.84] },
    { id: 'tucuman', location: [-26.82, -65.22] },
    { id: 'salta', location: [-24.78, -65.41] },
    { id: 'resistencia', location: [-27.46, -58.98] },
    { id: 'neuquen', location: [-38.95, -68.06] },
    { id: 'mardelplata', location: [-38.0, -57.56] },
    { id: 'bariloche', location: [-41.13, -71.31] },
    { id: 'comodoro', location: [-45.86, -67.48] },
    { id: 'ushuaia', location: [-54.8, -68.3] },
  ];
  const origin = cities[0].location;

  // Ángulos para centrar Argentina en el globo
  const toAngles = ([lat, lng]) => [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
  const [basePhi, baseTheta] = toAngles([-40, -64]);

  let globe = null;
  let rafId = 0;
  let running = false;
  let t = 0;
  let drag = null;               // { x, y } al empezar a arrastrar
  const offset = { phi: 0, theta: 0 };

  function init() {
    const width = canvas.offsetWidth;
    if (!width || globe) return;
    globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi: basePhi,
      theta: baseTheta,
      dark: 1,
      scale: 1.35,
      diffuse: 1.4,
      mapSamples: 20000,
      mapBrightness: 7,
      baseColor: [0.32, 0.42, 0.7],
      markerColor: [0.56, 0.7, 1],
      glowColor: [0.08, 0.14, 0.32],
      markerElevation: 0.01,
      markers: cities.map((c) => ({ location: c.location, size: c.size || 0.025, id: c.id })),
      arcs: cities.slice(1).map((c) => ({ from: origin, to: c.location, id: `ba-${c.id}` })),
      arcColor: [0.56, 0.7, 1],
      arcWidth: 0.45,
      arcHeight: 0.18,
      opacity: 0.85,
    });
    canvas.style.opacity = '1';
    if (reduceMotion) globe.update({ phi: basePhi, theta: baseTheta });
  }

  function frame() {
    if (!running) return;
    if (!drag) {
      t += 0.006;
      // Vuelve suave a Argentina después de arrastrar
      offset.phi *= 0.94;
      offset.theta *= 0.94;
    }
    const sway = reduceMotion ? 0 : Math.sin(t) * 0.1; // vaivén leve, siempre sobre Argentina
    globe.update({ phi: basePhi + sway + offset.phi, theta: baseTheta + offset.theta });
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

  // Arrastrar para mirar alrededor
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, phi: offset.phi, theta: offset.theta }; canvas.style.cursor = 'grabbing'; });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    offset.phi = drag.phi + (e.clientX - drag.x) / 260;
    offset.theta = Math.max(-0.6, Math.min(0.6, drag.theta + (e.clientY - drag.y) / 600));
  }, { passive: true });
  window.addEventListener('pointerup', () => { drag = null; canvas.style.cursor = 'grab'; }, { passive: true });
}
