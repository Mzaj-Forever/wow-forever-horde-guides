# Public guide-data format (v1)

The entire public website currently reads `guides.json`, making the guide contents independent from layout and page code. This is **published route data**, not the canonical research database.

## Top-level data

| Field | Type | Meaning |
| --- | --- | --- |
| `schemaVersion` | integer | `1`; change only with a deliberate renderer/schema migration |
| `catalogVersion` | string | Release version for the public catalog |
| `updatedOn` | ISO date | Most recent public data revision |
| `races`, `classes` | string arrays | Selector options (planning roster, not confirmed compatibility matrix) |
| `guides` | array | Published individual race/class guide objects |

## A guide

Every object in `guides` must contain:

- `id` — stable URL-friendly unique ID, e.g. `undead-warlock`.
- `race`, `class`, `title`, `version` — human-facing identity and revision.
- `status` and `statusLabel` — e.g. `preview` / `Research preview`; use `hidden` to remove a draft from the public selector.
- `shortDescription`, `description` — public context and limitations.
- `research` — `sourceSnapshot` (null until an exact reconciliation), `inGameStatus`, and `xpStatus`.
- `chapters` — ordered sections; changing order changes route display without rewriting the website.

## Chapters and steps

A chapter has a stable `id`, `title`, `zone`, optional `description`, and ordered `steps`.

A step has a stable `id`, `type`, `title`, `description`, `questIds` (integer array, empty if not applicable), and `checkable` (boolean). **Quest IDs and internal batch/step IDs are for research matching only. Never show them in player-visible guide headings, instructions, badges, tooltips, or addon text.** `checkable:false` creates a clearly distinguishable planning/note step rather than an actionable checklist task.

Optional fields include:

| Field | Example | Why it exists |
| --- | --- | --- |
| `batchId` | `brill-loop-01` | Bind accept/kill/turn-in steps into one efficient quest batch |
| `dependsOn` | `['uw-q1478']` | Reference prerequisite step IDs and enforce audit checks |
| `conditions` | `{ "minLevel": 10, "classes": ["Warlock"] }` | Race/class, class training, level or other route conditions |
| `optional` | `true` | Skippable branch or dungeon detour |
| `xpEstimate` | `null` | Numerical XP only when supported by the XP calculation; null means unknown |
| `zoneTransition` | `{ "from": "Tirisfal Glades", "to": "Silverpine Forest" }` | An actual planned handoff; do not invent one while routing is undecided |
| `dungeon` | `{ "name": "Ragefire Chasm", "mode": "quest-only" }` | Dungeon-quest-efficient route rather than an assumed full clear |
| `npc` / `coordinates` | `null` | Only supply verified NPC and coordinate information |

**Important:** The current public data intentionally uses no invented XP totals, travel metrics, coordinates, or definite future zone transitions. The research preview should not be mistaken for a finished optimized route.

## Working examples

To create a new guide, copy an existing guide entry and give it a **new** guide ID, character combination, chapters, and step IDs. Remove every quest and instruction that has not been confirmed for the new class/race. Do not reuse Warlock class quests for other classes.

To add a batch, place consecutive `accept` steps and their `objective` and `turnin` steps within the same `batchId`; reviewers can later route and optimize the loop without losing the association.

For a dungeon quest route, set the step `type` to `dungeon`, mark it optional unless the route requires it, and include a dungeon `{name,mode:'quest-only'}` descriptor. Dungeon XP calculations belong to the research/route builder and must use estimated actual quest-run kills rather than full clears.

## Future direction

When the catalog becomes large, a generator can split the same schema into one JSON file per guide and emit a small catalog automatically. The website and an eventual WoW addon can then consume different exports of the **same approved route definitions**. The web export is not a direct client for the private ChatGPT Library, and the addon will require its own Lua export and in-game API testing.

## Checklist for every publication

- Every `guide.id`, `chapter.id` within a guide, and `step.id` within a guide is unique.
- `race` and `class` match the approved playable combination.
- `dependsOn` references a real step ID and does not form a cycle.
- Quest IDs, prerequisite relations, and offers are consistent with current research (or explicitly guarded).
- Guide UI displays **quest names only**, never quest numbers (e.g. do not append `Q1470` to a title).
- Notes are not falsely presented as completed quests.
- Unknown XP, NPC coordinates and travel times are represented as unknown, not fabricated.
- GitHub Pages finishes deploying; verify the homepage and guide links on mobile.
