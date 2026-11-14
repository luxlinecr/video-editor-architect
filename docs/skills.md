# Skills and plugins for this template

[Español](habilidades.es.md)

None of the skills below ship inside this repository. Each one is installed separately, from its author, under its own license. This page tells you what to use for what, how to install it, and what its license is. Everything was checked on 2026-10-11; the sources are listed in [fuentes-investigacion.md](fuentes-investigacion.md).

## Quick map: which skill for which job

- **Editing a reel (cuts, captions, cards, render):** this template's own skills (`/editar`, `/ajustar`, `/entrenar-estilo`) plus the **Remotion agent skills**.
- **Captions:** `remotion-captions` (Remotion). HyperFrames also has an `embedded-captions` skill if you build a clip with HyperFrames instead.
- **Motion graphics:** Remotion skills (`remotion-markup`) inside this project; **HyperFrames** for standalone HTML-based clips; **Motion Architect** for full motion pieces with a storyboard (macOS and Linux only).
- **Design (palettes, fonts for captions, cards and titles, design tokens):** **UI UX Pro Max** and **frontend-design**.
- **Animation feel (easing, timing, springs):** **Emil Kowalski's skills** (`emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `animation-vocabulary`).
- **Studying reference videos for a new style:** **watch** (`bradautomates/claude-video`).
- **Launch or promo videos of a project:** **BRAG** (`/brag`, `/brag-slim`).
- **Writing your own skills:** **skill-creator** (or Antigravity IDE's built-in `agy-customizations` skill).

## How to install external skills in Antigravity IDE

None of these external skills install automatically when you clone the repo. [marketplaces.json](marketplaces.json) preserves the originally suggested GitHub repos and pinned `sha` commits as a reference, and you can install skills in Antigravity IDE in two ways:

1. **Using the `skills` CLI** (compatible with `.agents/skills/` and standard coding agents):

```bash
npx skills add remotion-dev/skills
npx skills add emilkowalski/skills
npx skills add heygen-com/hyperframes
npx skills add https://github.com/latent-spaces/brag --skill brag-slim
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
```

2. **From Antigravity IDE's Plugins Manager** (when an equivalent integration or plugin is available in the Agent Marketplace).

This repository's own skills live in `.agents/skills/` and its workflows in `.agents/workflows/`.

## Remotion agent skills

- **What:** the official Remotion skills. `remotion-best-practices` is the router; `remotion-create`, `remotion-markup` (compositions, timing, fonts, audio, transitions, text measuring, motion blur, light leaks and more), `remotion-captions` (transcribe, import SRT, display and animate captions), `remotion-studio`, `remotion-render`, `remotion-multimedia` (Mediabunny metadata), `remotion-interactivity`, `remotion-maps`, `remotion-saas`, `remotion-docs` (search the docs as Markdown) and `remotion-upgrade`. Version checked locally: 4.0.533.
- **Install:** `npx skills add remotion-dev/skills` (or `npx remotion skills add` inside a Remotion project).
- **License:** the `remotion-dev/skills` repository has no license file (GitHub reports none). Not included here; installed from Remotion. Using Remotion itself has its own license: see [remotion.md](remotion.md).

## UI UX Pro Max

- **What:** a searchable local design database (version 2.13.0: 79 styles, 192 palettes, 74 font pairings, design-system generator) plus sub-skills `design-system` (three-layer tokens), `brand`, `design`, `banner-design`, `slides` and `ui-styling`.
- **For this editor:** pick a palette and a font pairing for your captions, keyword cards and title, then write them as design tokens in your style profile. Its search script needs Python 3 (standard library only).
- **Careful:** the `design` sub-skill can generate logos with paid AI services (Gemini and others). That spends money; ask before using it.
- **Install:** listed in [marketplaces.json](marketplaces.json), or `npx skills add nextlevelbuilder/ui-ux-pro-max-skill`.
- **License:** MIT (Copyright 2024 Next Level Builder).

## frontend-design and skill-creator

- **frontend-design:** guidance for distinctive, non-generic interfaces. Useful for the look of cards, titles and any web demo you record.
- **skill-creator:** create, test and tune skills, for example a skill that captures your editing style (in Antigravity IDE you also have the built-in `agy-customizations` skill).
- **Install:** `npx skills add anthropics/skills --skill frontend-design` (check the official `anthropics/skills` repository).
- **License:** Apache-2.0.

## HyperFrames (HeyGen)

- **What:** an open-source framework that turns HTML, CSS, media and seekable animations (GSAP, CSS, Lottie, Three.js and others) into deterministic MP4 files. It renders each frame in headless Chrome and encodes with FFmpeg. Its skills include `hyperframes`, `motion-graphics`, `embedded-captions`, `talking-head-recut` and `remotion-to-hyperframes`.
- **How it complements Remotion:** Remotion stays the engine of this editor (React, the EDL, the final render). HyperFrames is handy for one-off motion pieces written as plain HTML, which you then drop into a reel as an insert (an MP4 clip). Keep the final edit in Remotion.
- **Requirements:** Node.js 22 or newer and FFmpeg. Official Windows support: **not verified** (the site offers desktop apps for macOS and Linux).
- **Install:** `npx skills add heygen-com/hyperframes`.
- **License:** Apache-2.0. The README says there are no per-render fees or commercial-use thresholds. Optional HeyGen voices need a HeyGen sign-in; without it, narration uses Kokoro locally (third-party source, not verified officially).

## BRAG

- **What:** a skill/workflow by Shunit Haviv Hakimi that turns a project into a 15 to 25 second launch video with music, motion and share copy. `/brag` uses HyperFrames; `/brag-slim` builds the whole video with the tools already on the machine (`/brag --full` keeps the HyperFrames workflow).
- **For this editor:** a quick way to make a promo of your own reel editor or of any project. It is not part of the reel pipeline.
- **Requirements:** Node.js 22+, FFmpeg on PATH, and for `/brag` the HyperFrames CLI (`npx hyperframes doctor`). On Windows its README says Git needs `core.symlinks=true` and Developer Mode or admin rights for its symlinks; otherwise copy `skills/brag/` by hand.
- **Install:** just `/brag-slim`: `npx skills add https://github.com/latent-spaces/brag --skill brag-slim` (or the full `latent-spaces/brag` repo).
- **License:** MIT (Copyright 2026 Shunit Haviv Hakimi). Bundled music and SFX are credited to ende.app and Kenney in its README.

## watch (claude-video)

- **What:** `/watch <url or file>` downloads with yt-dlp, extracts frames with ffmpeg and gets captions or a transcript, so the agent can look at a video. Useful in `/entrenar-estilo` to study reference creators you name.
- **Careful:** when a video has no captions it falls back to a Whisper **API** that needs a key and costs money. Prefer this template's local whisper.cpp.
- **Install:** `npx skills add bradautomates/claude-video` (or inspect the repo listed in [marketplaces.json](marketplaces.json)).
- **License:** MIT (Copyright 2026 Bradley Bonanno).

## Emil Kowalski's skills (animation)

- **What:** `emil-design-eng` (UI polish and animation decisions), `animate` (build an animation choosing curve, duration and properties), `review-animations` (strict review, invoked by hand), `improve-animations` (audit a codebase and plan fixes), `animation-vocabulary` (name the effect you have in mind). The repo has more (for example `animation-performance`, `apple-design`).
- **For this editor:** easing and timing for card pops, sticker entrances and floating motion. The values are written for web UI; adapt them to frames (30 fps).
- **Install:** `npx skills@latest add emilkowalski/skills`.
- **License:** MIT (Copyright 2026 Emil Kowalski), in the repo's `LICENSE`. The individual `SKILL.md` files carry no license header. Not included here; installed from the author.

## Motion Architect

- **What:** a motion graphics agent/workflow with Remotion: it studies references, sets your brand, writes a storyboard for approval, animates and renders vertical, horizontal, square or 4:5. Version 0.2.0. Its installer supports macOS and Linux only.
- **Install (from its README):** `git clone https://github.com/Hainrixz/motion-architect.git`, then `./install.sh`.
- **Status: not verified.** On 2026-10-11 the GitHub repo returned 404 to anonymous requests (private or not published yet), so it is not in `marketplaces.json`. Add it once the repo is public.
- **License:** MIT, per its `LICENSE` and `plugin.json`. It renders with Remotion, so the Remotion license applies.
