# NP+ · Landing de inscripción

Página estática (HTML, CSS y JS, sin dependencias ni build). Se sube tal cual a Vercel, Netlify, Hostinger o cualquier hosting.

## Ver en local

```bash
python -m http.server 5173
```

Abrir http://localhost:5173

## Antes de publicar

1. **WhatsApp:** cargado en `assets/js/main.js` (`NP_CONFIG.whatsapp = 5493484359294`, es el +54 9 3484 35-9294 de la coordinación). Para cambiarlo, usar código de país y sin `+` ni espacios.
2. **Textos entre corchetes:** precio, cuotas, duración, horario, requisitos, nombres de la dirección, trayectoria y testimonio.
3. **Temario:** las 4 etapas son una propuesta. Validar con la dirección.
4. **Fotos:** las de `assets/img` son provisorias de Unsplash. Reemplazar por fotos reales de los networking y la dirección con el mismo nombre de archivo (versión de 1600 y de 800 px de ancho, en WebP).
5. **Marca:** cuando lleguen logos y colores oficiales, cambiar las variables de `:root` en `assets/css/styles.css` y el logo (hoy es texto `NP+`).
6. **Medición:** pegar el píxel de Meta en el `<head>`. Los clics a WhatsApp ya disparan `fbq('track', 'Lead')` y un evento `whatsapp_click` en `dataLayer` si existen.
7. **Instagram y mail:** completar los links del pie.

## SEO (ver la skill `seo-experto`)

1. **Dominio:** reemplazar `https://TU-DOMINIO.com` por el dominio real en `index.html`, `robots.txt`, `sitemap.xml` y `llms.txt` (buscar y reemplazar en todo el proyecto).
2. **Redes:** sumar el Instagram (y LinkedIn si hay) en `sameAs` del JSON-LD de `index.html` y en `llms.txt`.
3. **Google Search Console:** verificar el dominio, enviar `sitemap.xml` y pedir la indexación de la home.
4. **Bing Webmaster Tools:** importar desde Search Console (Bing alimenta a Copilot y a parte de ChatGPT).
5. **Medir:** PageSpeed Insights en celular (LCP menor a 2,5 s, INP menor a 200 ms, CLS menor a 0,1).
6. **Cuando cambie algo importante** (fechas, programa, equipo): actualizar `index.md`, `llms.txt` (fecha de actualización) y el `lastmod` del sitemap.

Archivos para buscadores e IA: `robots.txt` (permite a Google y a los bots de ChatGPT, Claude, Perplexity y Gemini), `sitemap.xml`, `llms.txt` (resumen para IA), `index.md` (la página en texto limpio), `manifest.webmanifest`, `favicon.svg` e íconos, y `assets/img/og-image.jpg` (imagen al compartir en WhatsApp y redes).
