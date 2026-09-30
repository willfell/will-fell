# Field Manual redesign: one dark page that shows the work

Date: 2026-09-29. Branch: `claude/personal-website-redesign-8e0916`. Design canvas: https://claude.ai/artifact/Mz2NZSLN8VzmU3tttuNBfd. The artboard "A · Field Manual — desktop, dark" (`project/Main.dc.html`) is the source of truth for layout and copy; "A · Field Manual — phone" is the same page at 390px. Artboards B and C were explored and not chosen.

## Purpose

willfellhoelter.com exists so a hiring manager or recruiter leaves knowing three things: Will listens first and then ships across whatever layer the outcome needs; he has done that at scale (the MCP mesh, observability for 400+ services, 1,000+ repos, 70+ AWS accounts) with teams, not alone; and he has a point of view on how agents should be used inside a team. The 2026-09-28 "three screens" site said the first thing and buried the other two: the numbers sat inside one paragraph, GitHub was a footer icon, and nothing on the page argued for anything.

Decisions Will made on 2026-09-29, all locked:

| Decision | Call |
|---|---|
| Direction | A, "Field Manual": spec-sheet layout, mono labels, numbered sections, hard edges, no shadows or gradients |
| Theme | Dark. Near-black ground, off-white type, one amber accent |
| Voice | Humbler than the first draft. The numbers were team efforts and the page says so. Listening is named in the hero, in How I work, and in the first Position |
| Lanes | Not pinned to forward deployed. Hero: "Open to new roles". Contact: "Platform, AI, customer-facing engineering, or a role that doesn't have a name yet" |
| Kubernetes | Written "K8s" everywhere on the site |
| Currently card | "Principal Software Engineer at Accuris. Agentic AI development, operations, K8s. Jack of all trades and master of none." and "Building Sauce." |
| New work shown | The New Relic and PagerDuty MCP servers written instead of paid vendor connectors; the incident plugin that takes a PagerDuty alert to a root cause in New Relic and documents it in the team's Obsidian vault; the New Relic K8s operator rollout with the platform team, 400+ services |
| GitHub | Contribution heatmap and total fetched at build time from the public calendar, with a committed snapshot as the fallback. Three repo cards: sauce, homebrew-sauce, will-fell (this site) |
| Photo | The existing profile photo, in colour, in a bordered card with the Currently caption |
| Resume bullets | Existing bullets stay word for word except Kubernetes → K8s. One Accuris bullet is extended and two are added; the same lines go to LinkedIn and the PDF next (`docs/linkedin-updates-2026-09-29.md`) |
| Roles at rest | Closed, native `<details>`, as on the current site |
| Word and height budgets | The 2026-09-28 gates (≤ 2,600px, ≤ 400 words) are retired. The page is about 7,000px at 1280 wide by design |

## Non-goals

- No change to Terraform, Plausible, the domain, or the shared `wac.lab.actions` workflows. The GitHub fetch runs inside `yarn build`, which both shared workflows already call, so no workflow inputs change.
- No CMS, no contact form, no new runtime dependencies, no new packages. One build-time Node script.
- No Sauce page (still phase 2). The Sauce blurb is unchanged.
- No new photo. If Will supplies one later it replaces `app/public/images/about/profilepic.jpg` and nothing else changes.

## Structure

Routes: `/` and `/WillFellhoelterResume.pdf`. Nothing else.

Nav, static, wraps on phones: `■ Will Fellhoelter` (links to `/`) — `Work` `Experience` `Positions` `GitHub` `[Resume ↓]`. The four are in-page anchors; Resume downloads the PDF and fires `Download Click`.

Bands inside `<main>`, in order, each with its `id`:

| # | id | Content |
|---|---|---|
| 1 | `hero` | Eyebrow "Open to new roles · Denver or remote"; h1 "I end up wherever the gap is between what a client needs and *what actually ships.*" (the emphasis is amber-underlined); lede; `Download resume` + `GitHub` `LinkedIn` `Email`; photo card with the Currently caption |
| 2 | `glance` | Five numbers: 8 years, 250+ tools, 100+ microservices, 1,000+ repositories, 70+ AWS accounts; caption "Accuris, 2025 to now. All of it with a team." |
| 3 | `how` | 01 How I work. "Defined, communicated, delivered." Four steps, each with a mono example line |
| 4 | `work` | 02 Selected work. Two featured cards with a four-node flow (MCP mesh; From a page to a documented root cause) and four cards in a 2×2 grid (observability, Sauce with install commands, forml on-prem, ephemeral environments) |
| 5 | `experience` | 03 Experience. "Eight years, seven roles." Seven `<details>` roles, education line, "Full resume, PDF" link |
| 6 | `positions` | 04 Positions. "Things I'll argue for." Four arguments |
| 7 | `github` | 05 GitHub. The total, the heatmap, three repo cards |
| 8 | `contact` | "Working on something that needs to ship?"; resume, email with copy, LinkedIn, GitHub |

Footer: `© <year> Will Fellhoelter · Denver, Colorado` and `Strava` `Site source`.

Bands 1 to 5 sit on `ink`; 6 to 8 on `pine`; the footer on `soot`.

## Copy

Every string on the page lives in `app/src/data/data.tsx`, transcribed from the artboard. Rules that never bend:

- "operations for" / "Operate 100+", never "run 100+".
- "Help map out", never a solo claim about the 1,000+ repos.
- "K8s", never "Kubernetes".
- Accuris specifics stay generic: "SSO", "one gateway"; never "Entra ID" or "AgentGateway".
- The Sauce blurb is the frozen text.
- Team credit stays where it is written: the glance caption, "With the platform team" on the mesh and the operator card, "Built with platform, product, and engineering teams along the way" under Selected work.

## Visual system: Field Manual, dark

Tokens, as Tailwind colour names:

| Name | Hex | Used for |
|---|---|---|
| `ink` | `#121513` | Page ground, bands 1 to 5, text on amber |
| `pine` | `#0F1A15` | Bands 6 to 8 |
| `soot` | `#0A0F0C` | Footer, the Sauce install block |
| `surface` | `#1A1E1B` | Featured cards, the photo card |
| `surface-pine` | `#16231C` | Repo cards |
| `line` | `#2E3330` | Rules on ink |
| `line-pine` | `#2A3A31` | Rules on pine |
| `line-mid` | `#3A403C` | Card borders, dashed rules, section rules |
| `line-pine-mid` | `#3A4A41` | Section rules and button borders on pine |
| `line-hi` | `#6B736E` | The roles' plus box |
| `line-soot` | `#1E2823` | Footer top rule |
| `paper` | `#ECEBE5` | Primary text, strong rules, highlighted flow node |
| `paper-2` | `#C2C7C3` | Body text |
| `muted` | `#939A95` | Labels, dates, captions (6.4:1 on ink, 6.2:1 on pine) |
| `ink-2` | `#4A4F4C` | Sub-text inside the paper flow node (7.0:1) |
| `amber` | `#E9A23B` | The accent: squares, buttons, underline, `$` prompt, position numbers |
| `heat-0` … `heat-4` | `#1E2A24` `#504320` `#806129` `#B58132` `#E9A23B` | Heatmap levels: 0, 1–9, 10–29, 30–69, 70+ |

Type: **Archivo** (variable: wdth 62–125, wght 100–900) for headings and body; **JetBrains Mono** 400–700 for labels, dates, nav, captions, code. Both from Google Fonts via one `<link>` in `_document.tsx`, replacing Inter and Fira Code. Headings use weight 650–750 and width 112–125%. Scale: h1 38/56/66px; section h2 30/42/50px; card h3 26px; featured h3 28/34/38px; body 17px; the hero lede 17/18/20px; mono labels 11.5–13px, uppercase, 0.06–0.12em tracking. Running text is capped at 46–58ch and uses `text-wrap: pretty`; headings `text-wrap: balance`.

Layout: content column `max-w-[1296px]`, side padding 20/32/48px, bands `py-16 md:py-24 xl:py-[120px]`. The hero has a faint 32px grid drawn with two linear gradients. Grids collapse to one column under `md`. Nothing is `100vh`. No shadows, gradients (other than the hero grid), rounded corners (the heatmap squares excepted), emoji, or icons beyond four inline stroke glyphs (download, external, flow arrow, plus). The GitHub, LinkedIn and Strava icon components are deleted; every social link is a text link.

Motion: the existing 500ms hero fade, and smooth in-page scrolling for the nav anchors; both off under `prefers-reduced-motion`. Keyboard focus is a 2px paper outline.

Accessibility: real `<a>`, `<button>`, `<details>`; `aria-label` on the copy button; `role="img"` with a full-sentence `aria-label` on each flow and on the heatmap; every text/ground pair ≥ 4.5:1; nav and buttons ≥ 44px tall; the heatmap scrolls sideways inside its own box so the page never overflows at 320px.

## GitHub data

`app/scripts/github/fetch-contributions.js` fetches `https://github.com/users/willfell/contributions`, the public calendar fragment, and writes `app/src/data/github-contributions.json`: `{ login, fetchedAt, total, days: [{ date, count }] }` for the last 53 weeks. It runs first in `yarn build`, so both shared workflows refresh the snapshot on every build without a token. Any failure (network, markup change, a calendar shorter than 360 days or not starting on a Sunday, a total that is not the sum of its days) keeps the committed snapshot and warns; the build never depends on GitHub being up. `--check` validates the snapshot without fetching; `GITHUB_CONTRIBUTIONS_SKIP=1` skips the fetch for offline runs. The script rewrites the file only when the total or a day changed, which is most days, since the window slides every UTC day: a local `yarn build` on a later day than the committed snapshot modifies a tracked file. Commit it to refresh the fallback, or check it out to drop the change. The fetch gives up after 15 seconds; a snapshot that is unreadable or invalid is reported rather than crashed on, and a successful fetch repairs it.

`GitHubActivity.tsx` renders the total, a 53-column heatmap (one column per week, Sunday first, month labels above, Mon/Wed/Fri at the left, a `title` per day), and the three repo cards from `data.tsx`.

Private contributions: today the public calendar shows about 5,000 of the 8,980 Will sees logged in, because the rest are in a private org. GitHub → Settings → Public profile → Contributions & activity → "Include private contributions on my profile" makes the public calendar carry the full count, as counts only, with no repo names. Flip it before the merge so the first deploy shows the real number; nothing in the code changes.

## Verification (gates)

All of these pass before the PR opens:

1. `yarn compile` (tsc) with zero errors.
2. `yarn lint:check` with zero errors.
3. `yarn images:validate` reports zero broken references and zero orphans.
4. `yarn github:fetch --check` passes on the committed snapshot.
5. `yarn build` succeeds; `out/` contains `index.html` and no `education/`, `site-info/`, `info/`, `contact/` or `archive/`.
6. `npm run site:verify` from the repo root, against `app/out/` after `yarn build && yarn copy-resume`:
   - page height at 1280 wide ≤ 8,000px; `<main>` ≤ 1,500 words;
   - the six required links (PDF, GitHub, LinkedIn, Strava, Sauce repo, site repo);
   - Archivo and JetBrains Mono loaded; the hero lede ≥ 17px;
   - exactly one hero `<img>`, served from `out/images/about/profilepic.jpg`, with alt text;
   - contrast ≥ 4.5:1 on the Sauce link, the footer source link, a glance label and a role date;
   - no horizontal overflow at 390px or 320px, including with every role open;
   - seven `<details>` roles, ≥ 2 bullets each, closed at rest, the first opening on click;
   - the page never says "run 100+", "Kubernetes", "Entra ID" or "AgentGateway";
   - `#github` renders one column per week and one cell per day in the snapshot, and its total equals the snapshot's;
   - the copy button in `#contact` survives a refused clipboard and leaves the address selected;
   - the hero heading is visible with JavaScript off; no hydration error when the visitor's clock is in a later year;
   - the PDF's sha256 is `ee0c9243f632798e01287555ce940188ed21459eebd4c26bd81eb6a45fb144ef`;
   - screenshots at 1280 and 390 land in `app/.screenshots/` for the PR.
7. The `pr` workflow's `validate-build` and `lint` jobs pass on the PR.

## Out of scope, tracked elsewhere

- LinkedIn and resume PDF updates: `docs/linkedin-updates-2026-09-29.md`.
- The `/sauce` page: phase 2, unchanged from the 2026-09-28 spec.
- Repo hygiene items from the 2026-09-25 handoff.
