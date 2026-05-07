# AGENTS.md

## What this repo does

`NFC-Jukebox` is primarily a sticker-generation app: a React + Vite client in `client/` talks to an Express backend in `server/` to search music metadata and export print-ready NFC card sticker artwork.

This repo also contains early hardware research assets for a future NFC music controller. Treat the app and the hardware exploration as related but separate workstreams.

## High-value directories

- `client/` — React UI for search, editing, preview, and export flows.
- `server/` — Express API for Spotify, YouTube, and PNG/PDF export.
- `hardware/` — hardware planning notes and NotebookLM-ready source material.
- `.ai/setupPrompts/` — prompt templates used to seed AI research workflows.
- `.github/` — repo-local AI customizations including hardware instructions, prompts, and reusable skills.

## Commands agents should know

- Install all dependencies: `npm run install:all`
- Start both client and server: `npm run dev`
- Build the client: `npm run build`
- Lint the client only: `cd client && npm run lint`

There are currently no meaningful automated tests; do not claim test coverage unless you added and ran tests yourself.

## Environment notes

- Spotify credentials are required for live Spotify search.
- YouTube search can use mock data unless `YOUTUBE_API_KEY` is configured.
- The server reads environment variables via `dotenv`; if you are setting up local runtime secrets, prefer `server/.env` when launching the backend from `server/`.

## Hardware workflow guidance

When the task is about the physical NFC music controller rather than the sticker app:

1. Start with `.ai/setupPrompts/NotebookLM Project Prompt.md`.
2. Use the source pack in `hardware/notebooklm/` for BOM, enclosure, and integration constraints.
3. Use `hardware/notebooklm/Source Index.md` to decide which files to upload into NotebookLM.
4. Use `.github/prompts/esphome-bring-up.prompt.md` for firmware architecture and staged bring-up planning.
5. Check `.github/skills/` for reusable hardware review workflows before drafting new guidance.
6. Preserve hardware prompt language that separates verified facts from assumptions or estimates.
7. Prefer decision-ready outputs: tradeoffs, risks, integration constraints, and prototype sequencing.

## Documentation conventions

- Link to existing docs instead of duplicating large sections from `README.md`.
- Keep new AI guidance concise and actionable.
- If hardware and software guidance diverge, say which track the instruction applies to.
