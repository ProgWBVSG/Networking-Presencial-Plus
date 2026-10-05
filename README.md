# NP+ · Landing de inscripción

Página estática (HTML, CSS y JS, sin dependencias ni build). Se sube tal cual a Vercel, Netlify, Hostinger o cualquier hosting.

## Ver en local

```bash
python -m http.server 5173
```

Abrir http://localhost:5173

## Antes de publicar

1. **WhatsApp:** completar el número de la coordinación en `assets/js/main.js` (`NP_CONFIG.whatsapp`, con código de país y sin `+`, por ejemplo `5491112345678`).
2. **Textos entre corchetes:** precio, cuotas, duración, horario, requisitos, nombres de la dirección, trayectoria y testimonio.
3. **Temario:** las 4 etapas son una propuesta. Validar con la dirección.
4. **Fotos:** las de `assets/img` son provisorias de Unsplash. Reemplazar por fotos reales de los networking y la dirección con el mismo nombre de archivo (versión de 1600 y de 800 px de ancho, en WebP).
5. **Marca:** cuando lleguen logos y colores oficiales, cambiar las variables de `:root` en `assets/css/styles.css` y el logo (hoy es texto `NP+`).
6. **Medición:** pegar el píxel de Meta en el `<head>`. Los clics a WhatsApp ya disparan `fbq('track', 'Lead')` y un evento `whatsapp_click` en `dataLayer` si existen.
7. **Instagram y mail:** completar los links del pie.
