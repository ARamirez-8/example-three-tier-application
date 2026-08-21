# Merge Demo F

- The frontend lives in `src/web/` and is built with Next.js using the App Router.
- Pages and layouts are defined in `src/web/app/`, with `layout.tsx` wrapping the whole UI.
- Global styles are applied via `src/web/app/globals.css` using Tailwind CSS through PostCSS.
- Server actions in `src/web/app/actions.ts` handle communication with the internal API tier.
- Static assets such as SVG icons are stored in `src/web/public/` and served by Next.js.
