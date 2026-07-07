# Mukesh Karunamoorthy — Portfolio

A premium, animated single-page portfolio, refactored from a monolithic HTML file into a clean, deploy-ready static project.

## Project structure

```
.
├── index.html              # Semantic markup, links to external CSS/JS
├── css/
│   └── style.css           # All styles: layout, animations, responsiveness
├── js/
│   └── script.js           # All behavior: SDK + interactions (see below)
└── assets/
    ├── images/              # Reserved for future image assets (currently unused — icons are emoji, no images/screenshots are embedded)
    ├── icons/               # Reserved for future icon assets (currently unused — icons are emoji)
    └── fonts/                # Reserved for future self-hosted fonts (currently loaded from Google Fonts CDN)
```

No images, icon files, or custom font files existed in the original single-file build — all "icons" are emoji characters and all type is loaded from Google Fonts. The `assets/` subfolders are included per the requested structure and are ready to receive real files (e.g. project screenshots, a favicon, a logo) whenever you add them; just drop files in and reference them with a relative path such as `assets/images/project-1.jpg`.

## What moved where

- **All CSS** (root variables, layout, animations, 3D tilt/cube effects, particles, scroll reveal, responsive media queries) → `css/style.css`, linked via `<link rel="stylesheet" href="css/style.css">`.
- **All JavaScript** → `js/script.js`, loaded via `<script src="js/script.js"></script>` at the end of `<body>` (same execution order as the original inline scripts, so behavior is unchanged). This file contains two clearly commented sections:
  1. The GenMB contact-form SDK (submits the contact form to `/api/contact/submit`).
  2. The site's interactive behavior: loading screen, scroll progress bar, cursor glow, mobile nav toggle, scroll-reveal animations, animated stat counters, typed-role effect, tilt/magnetic hover effects, hero 3D cube parallax, testimonial slider, and the contact form handler.
- **`index.html`** now only contains semantic markup and content — no inline `<style>` or `<script>` blocks.

Every animation, transition, hover effect, 3D effect, typing effect, particle, scroll-reveal, and interactive feature from the original file is preserved exactly as-is — only the *location* of the code changed, not its behavior.

## Deployment

This is a static site with no build step, so it deploys as-is to:

- **GitHub Pages**: push to a repo and enable Pages for the branch/root, or serve from `/docs` — no configuration needed.
- **Netlify / Vercel**: point either platform at the repo root with an empty build command and `.` (or `/`) as the publish/output directory.

### One note on the contact form

The contact form calls a small SDK (`window.genmb.contactForm.submit(...)`) that `fetch`es a **relative** URL: `/api/contact/submit`. That endpoint is provided by the platform the site was originally built on. If you deploy this project to GitHub Pages, Netlify, or Vercel as a plain static site, that endpoint won't exist there, and form submissions will fail with the "Contact service is not available" error already built into the form. To make the form functional after moving hosts, you'll need to either point `baseUrl` in the SDK config (top of `js/script.js`) at a real backend that implements that endpoint, or swap in a different form backend (e.g. Formspree, Netlify Forms, a serverless function) using the same `contactForm.addEventListener('submit', ...)` handler as a starting point.
