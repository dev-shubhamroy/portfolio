# Shubham Roy: Portfolio

Personal software engineering portfolio built with React, Vite, TypeScript and Tailwind CSS. It has an interactive 3D Earth hero (Three.js with React Three Fiber), About, Featured Projects and Contact sections.

## Requirements

- Node.js 20.19+ (developed on 22.12)
- npm

## Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # type-check and build to dist/
npm run preview  # serve the production build at http://localhost:4173
npm run lint     # lint with oxlint
```

## Editing content

| What | Where |
|---|---|
| Name, phone, WhatsApp, GitHub, LinkedIn, email, resume path | `src/data/profile.ts` |
| Featured projects | `src/data/projects.ts` |
| About text, highlights, skills | `src/data/about.ts` |
| Navigation items | `src/data/navigation.ts` |

**Resume:** the Download Resume button is shown as "coming soon" until `resumeUrl` in `profile.ts` is set. Put the PDF in `public/` (for example `public/Shubham-Roy-Resume.pdf`) and set `resumeUrl: '/Shubham-Roy-Resume.pdf'`.

## Structure

```
src/
  components/         shared UI (Navbar, Footer, IconLink, HeroBackdrop, FloatingLabels, GlobePlaceholder)
  components/globe/   3D Earth (Globe wrapper and fallback, GlobeScene, shaders, network data)
  components/about/    About visuals
  components/contact/ copy-email button
  components/projects/ project card and SVG visuals
  sections/           Hero, About, Projects, Contact
  data/               content and config
  hooks/              reusable hooks (reveal on scroll, media queries, card effects)
  utils/              small helpers
  styles/             global CSS and Tailwind theme tokens
```

## Deploying to Vercel (free Hobby plan)

This is a static single-page site, so no `vercel.json` is needed. Vercel detects Vite automatically.

1. Push the repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected settings: framework **Vite**, build command `npm run build`, output directory `dist`. No environment variables are required.
4. Deploy. Later pushes to the main branch redeploy automatically.

## Notes

- The 3D globe is loaded lazily, pauses when off-screen, and falls back to a CSS illustration if WebGL is unavailable. It renders statically when the user prefers reduced motion.
- Project descriptions are based on each repository's README and source. Do not add metrics, demos or features the repositories do not support.
- The page has no social preview image yet. Add one (for example `public/og.png`) with `og:image` and `og:url` tags in `index.html` once the final URL is known.

## Credits

The Earth's continents are drawn at runtime from **Natural Earth** land polygons (1:110m scale). Natural Earth data is in the **public domain** (https://www.naturalearthdata.com/about/terms-of-use/). The polygons came from the `world-atlas` package's `land-110m.json` (ISC license, Mike Bostock), converted to plain `[lon, lat]` rings and bundled as `src/data/land110m.json` (about 65 KB). No external image or URL is loaded at runtime.
