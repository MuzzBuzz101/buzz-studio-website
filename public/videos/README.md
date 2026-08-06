This folder is for small, self-hosted clips only — anything the browser has to
download directly, so it must stay light.

- `showreel.mp4` — looping ambient hero background reel. Keep it short (~15-30s),
  muted (no audio track), downscaled (≤1920px wide), H.264, ideally under 8MB.
  Reference it as `<Hero videoSrc="/videos/showreel.mp4" />` in `src/app/page.tsx`.

Full-length case-study films (the long, heavy stuff) do **not** belong here — upload
those to Vimeo and embed them via `vimeoId` in `src/data/projects.ts` instead. See
`raw-footage/README.md` at the project root for that workflow.
