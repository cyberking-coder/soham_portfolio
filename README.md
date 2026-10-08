# Soham Kiran Gavate — Portfolio

A clean, minimal, professional portfolio website built in a monochrome
(black & white) editorial style, with motion graphics and scroll-driven
animations.

## Highlights

- **Monochrome editorial design** — pure black / off-white paper palette,
  large display typography (Space Grotesk + Instrument Serif + Inter).
- **Interactive hero canvas** — a constellation of connected dots that
  react to the cursor.
- **Senior-level motion** — preloader counter, custom blend-mode cursor,
  scroll progress bar, reveal-on-scroll, animated stat counters, marquee,
  hover state transitions.
- **Fully responsive** — adapts from large desktop to mobile, with a
  full-screen mobile menu.
- **Accessible & performant** — semantic HTML, keyboard-friendly,
  `prefers-reduced-motion` support, canvas paused when off-screen, no build
  step or dependencies.

## Structure

```
index.html        # Markup & content (from résumé)
css/style.css     # All styles
js/main.js        # Interactions & animations
```

## Run locally

It's a static site — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Content

All content is sourced from Soham Kiran Gavate's résumé — summary,
professional experience, education, skills, athletic & trading background,
event management, and volunteer work.

---

Built with vanilla HTML, CSS and JavaScript. No frameworks, no build step.
