# WoW Forever Horde Leveling Guides

An unofficial, static, GitHub Pages-hosted website for **Horde race/class leveling guides** in WoW Forever.

## Website files

- `index.html` — homepage and race/class selector.
- `guide.html` — shared guide page; used for every character combination.
- `app.js` — dynamically renders race/class options and published guide cards.
- `guide.js` — dynamically renders chapters and steps, with browser-local progress.
- `guides.json` — **public guide-data file; the only place that preview routes are edited**.
- `styles.css` — site appearance.
- `GUIDE_DATA_FORMAT.md` — schema and publishing rules.

## What is and is not in this repository

This repository contains the website and **approved public guide previews only**. Our canonical 912-quest research registry and audit evidence remain in the separate ChatGPT project Library. GitHub is not a replacement for that research database. Changing the Library does not update the website automatically.

Quest IDs may be preserved in the technical route data for source matching, but **players never see quest IDs in guide steps or addon instructions**. The initial Undead Warlock entry contains only the seven research-preview milestones from the first public website, reorganized into a reusable format. It is **not** the complete 62-step offline experimental route. Neither preview is blanket-certified by live game testing.

## Adding or updating a guide

1. Finish and merge source-supported quest research in the ChatGPT project Library.
2. Design the candidate guide route from that data; review prerequisites, travel, quest batching, class quests, optional dungeons, and XP assumptions.
3. Add or revise the entry in `guides.json`. Give every guide and step a **stable unique ID**, and never invent numeric XP estimates or coordinates.
4. Add the research snapshot identifier only when the route is genuinely reconciled to that source version.
5. Upload the changed `guides.json` to the repository's root, commit, and verify the GitHub Pages deployment and page behavior.
6. Keep the published route status as `preview` until validated to the agreed standard.

See `GUIDE_DATA_FORMAT.md` for the guide-data fields and future addon/export rules.

## Deployment

GitHub → repository **Settings → Pages → Deploy from a branch → main → /(root)**.

Published URL: https://mzaj-forever.github.io/wow-forever-horde-guides/

No compilation, server, paid hosting, or AI coding agent is required for routine `guides.json` updates.

## Progress checkmarks

Checkmarks are saved only in the visitor's browser (`localStorage`) and are keyed by stable guide/step IDs, so rearranging steps will not reset them. The new engine includes a one-time compatibility import of checkmarks from the site's earlier Undead Warlock preview.

## Legal / accuracy

Unofficial fan project, not affiliated with Blizzard Entertainment, RestedXP, or the WoW Forever operators. Review source claims and in-game availability before publishing route instructions.
