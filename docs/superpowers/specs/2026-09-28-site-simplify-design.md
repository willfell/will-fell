# Site simplification: one page, three screens

Date: 2026-09-28. Branch: `worktree-site-simplify`. Proposal artifact: https://claude.ai/artifact/KB91xmrrTovHm8zr7ZpCQL

## Purpose

willfellhoelter.com exists so a hiring manager with four minutes leaves with one sentence, the resume, and one project. Today it takes fifteen screens, two navigation systems and five pages to say that, and repeats the same three claims four times. This spec cuts it to one page of about three screens, in the voice Will set on 2026-09-25: breadth is the lead claim, agentic AI at scale is where it points right now, slim, subtle, not heroic.

Decisions Will made on 2026-09-28, all locked:

| Decision | Call |
|---|---|
| Audience | Hiring managers and recruiters |
| Approach | One page, three screens (approach B in the artifact) |
| Visual direction | Quiet earth: current palette, everything layered on top of it removed |
| Third selected work | Ephemeral environments across Cerner, Lendflow and Project Canary |
| Roles | One line each, no bullets, including the current role |
| Sauce page | Phase 2, after the Sauce rework settles. Sauce copy is frozen until then |
| Accuris specifics | Genericised on the site: "SSO" and "one gateway", not "Entra ID" and "AgentGateway" |
| Strava | Stays in the footer. Will checks privacy zones separately |

## Non-goals

- No change to Terraform, the GitHub Actions workflows, Plausible, or the domain.
- No redirects for `/education`, `/site-info`, `/info` and `/contact`. They had no inbound links worth preserving; a static export on S3 will serve CloudFront's error behaviour for them.
- No contact form. No CMS. No new dependencies.
- No change to any Sauce copy. The card reuses the existing description verbatim.
- The public-repo hygiene work (GPS EXIF in tracked photos, the two public `docs/` files) is a separate task that Will ordered ahead of this one. This spec removes most of the GPS-tagged photos as a side effect but does not rewrite history.

## Structure

Routes after this change:

| Route | Content |
|---|---|
| `/` | The whole site: hero, about, selected work, roles, footer |
| `/WillFellhoelterResume.pdf` | Unchanged |
| `/sauce` | Phase 2. Not built in this change |

Deleted routes: `/education`, `/site-info`, `/info`, `/contact`.

One navigation bar, static at the top, no scroll-state colour switching, no side nav, no mobile drawer:

```
Will Fellhoelter                     Work   Experience   Resume ↓
```

`Work` and `Experience` are in-page anchors (`#work`, `#experience`). `Resume ↓` downloads the PDF and fires the existing `Download Click` event. On phones the four items wrap onto two lines; there is no hamburger.

## Home page

Five bands. Every band is visible at rest. Nothing is 100vh. At 1280×800 the page ends inside the third screen (height ≤ 2,600px). Word count on the page, excluding the nav and footer, ≤ 400 (the copy below totals about 370; the frozen Sauce blurb alone is 52).

### 1. Hero

Left: name as `h1`, one paragraph, three buttons. Right (desktop only, `lg:` and up): the profile photo in a circle, 288px. On phones the photo sits above the name at 112px.

Copy:

> **Will Fellhoelter**
>
> Principal Software Engineer in Denver. Eight years across the stack, from data and application code to the Kubernetes underneath. Lately that points at agentic AI infrastructure at scale.
>
> [Resume ↓] [GitHub] [LinkedIn]

`Resume ↓` is the one filled (tan) button. GitHub and LinkedIn are outlined. All three fire the existing `Hero CTA Click` event with `button` set to the label.

No background image, no gradient overlay, no frosted box, no parallax, no bouncing chevron.

### 2. About

One paragraph, `max-w-prose`, built from the About copy approved on 2026-09-25. This is the only place the numbers appear on the page.

> I usually end up wherever the gap is between what a client needs and what actually ships: data, application logic, deploys, the Kubernetes underneath, the alerting on top. At Accuris that means the MCP mesh connecting 250+ tools to every team, operations for 100+ microservices across 6 regions, a few services of my own the wider org depends on, and helping map out the work standardizing CI/CD across 1,000+ repos. Before that, first engineering hire at an AI startup, working with founders and enterprise clients. Wichita State, MIS, 2018. Open to forward deployed and platform roles.

The two factual corrections hold: "operations for", never "run"; "helping map out", never a solo claim.

### 3. Selected work (`#work`)

Heading: `Selected work`. Three entries in a three-column grid (one column on phones), equal weight, no images, no modal, no "view details". Each entry is a title, a one-line context in the mono face, and a short paragraph. Only Sauce has a link.

**MCP mesh** — Accuris · 2025–2026
> Governed agent tooling for the whole org: 250+ tools behind one gateway, SSO, central observability. Built the first internal MCP servers and the plugin library, then the mesh every team uses.

**Sauce** — Open source · 2026– · [GitHub ↗]
> Copy is the current `portfolioItems[0].description` verbatim, unchanged until the Sauce rework lands:
> An agentic operating loop for Obsidian. Notes become node-based work graphs that agents like Claude Code and Codex execute in isolated workers, with scheduling, retries, handoffs between agents, and a persistent task store. Started as a loop-based forward deployment mechanism, rebuilt around graphs. Versioned vault platform shipped via Homebrew, MIT.

**Ephemeral environments, three times** — Cerner · Lendflow · Project Canary
> Self-service test environments with data seeding and automatic cleanup, built for three different orgs: an AWX portal at Cerner, ephemeral infrastructure for dev and QA at Lendflow, a UI with branch and data-source selection at Project Canary. The problem I keep getting handed.

### 4. Experience (`#experience`)

Heading: `Experience`. One line per role: date range in the mono face, employer in bold, title, then three to five words of what it was. No bullets, no logos, no descriptions. The PDF carries the bullets. Dates are the locked months from the content-ownership doc.

| Dates | Employer | Title | Line |
|---|---|---|---|
| Mar 2026 – now | Accuris | Principal Software Engineer | MCP mesh, multi-region Kubernetes, 70+ AWS accounts |
| Apr 2025 – Mar 2026 | Accuris | Senior Software Engineer | GitHub migration, first internal MCP servers |
| Aug 2024 – Apr 2025 | Forml | Senior Full Stack Engineer | first engineering hire, on-prem deploys |
| May 2023 – Aug 2024 | Project Canary | DevOps Engineer | observability, ephemeral environments, RAG |
| Aug 2021 – May 2023 | Lendflow | DevSecOps Engineer | SOC 2, on-call, OpenSearch logging |
| Mar 2020 – Aug 2021 | MCG | DevOps Engineer | on-prem to Azure, Chef to Ansible |
| Oct 2018 – Mar 2020 | Cerner | Systems Engineer | 600+ vSphere hosts, AWX portal |

Layout: two-column grid, dates in a fixed 160px column on desktop; on phones the date sits above the role on its own line.

### 5. Footer

This is the contact page. Deep-forest background.

Left: the email address as selectable text with a copy button (fires `Email Click`), then LinkedIn, GitHub, Strava as inline SVG icons using the existing `Icon/GithubIcon`, `Icon/LinkedInIcon`, `Icon/StravaIcon` components (each fires `Social Click`).
Right: `source` linking to github.com/willfell/will-fell, and `© 2026 Will Fellhoelter` with the year computed as today.

No back-to-top chevron.

## Visual direction: Quiet earth

The existing palette with everything layered on top of it removed. No gradients, no image overlays, no frosted boxes, no card shadows, no underline-bar heading decorations, no `hover:scale`.

Tokens, all already in `tailwind.config.js` except `cream`, which is added:

| Role | Token | Hex |
|---|---|---|
| Page ground | `cream` (new) | `#F7F4EE` |
| Body text | `stone-black` | `#2A2A2A` |
| Headings, links, outlined buttons | `forest-green` | `#5E6746` |
| Muted text, mono labels, dates | `sage-green` | `#7D8A69` |
| Filled button | `earth-tan` | `#DBBB9C` |
| Selected-work band ground | `canyon-tan` | `#E4D5B7` |
| Footer ground | `deep-forest` | `#3A4428` |
| Footer text | `earth-tan` on `deep-forest` | |
| Rules | `stone-300` | Tailwind default |

Bands 1, 2 and 4 sit on `cream`. Band 3 sits on `canyon-tan`. Band 5 on `deep-forest`. That is the whole colour rhythm.

Typography: `font-sans` becomes Inter first (today Fira Code is first in the sans stack, which is a template accident); `font-mono` stays Fira Code and is used for the nav links, dates, and the context lines under selected-work titles. Scale: `h1` 48px/56px on desktop, 36px on phones; section headings 28px; body 17px with `leading-relaxed`; mono labels 13px with `tracking-wide`. Running text is capped at `max-w-prose`.

Spacing: bands are `py-16 md:py-20`. Content column is `max-w-screen-lg` with `px-4 lg:px-8`, as `Section` does today.

Motion: one CSS fade-and-rise on the hero at load, 500ms, defined in `globalStyles.scss`, starting from a visible state when `prefers-reduced-motion` is set. Nothing else moves. No scroll-triggered classes, no staggered delays, no `framer-motion` page transitions.

## Data

`data.tsx` stays the only content file. After this change it exports:

```ts
homePageMeta          // unchanged
heroData              // name, description (string), actions[3], imageSrc
aboutData             // description (string)
selectedWork[]        // { title, context, description, href? }  (3 entries)
roles[]               // { dates, employer, title, line }        (7 entries)
socialLinks[]         // { label, href, Icon }                    (GitHub, LinkedIn, Strava)
contactEmail          // string
```

Removed from `data.tsx`: `SectionId` (the `Section` component takes `sectionId: string` and pages pass the literals `"work"` and `"experience"`), `skills`, `education`, `experience` (replaced by `roles`), `testimonial`, `contact`, `portfolioItems`. `dataDef.ts` shrinks to match; `Hero.description` becomes a `string`, and `Social` gains `Icon` in place of `logo`.

`lifeData.tsx` is deleted.

## Components

Delete:

`components/MePage.tsx`, `ImageGallery.tsx`, `InfoPage.tsx`, `EducationPage.tsx`, `ContactPage.tsx`, `Sections/SideNav.tsx`, `Sections/Portfolio.tsx`, `Sections/PortfolioCard/`, `Sections/ProjectDetailModal/`, `Sections/Testimonials.tsx`, `Sections/Contact/`, `Sections/Experience/` (all five files), `Sections/About.tsx` (rewritten as a new file), `Icon/DribbbleIcon.tsx`, `Icon/FacebookIcon.tsx`, `Icon/TwitterIcon.tsx`, `Icon/InstagramIcon.tsx`, `Icon/StackOverflowIcon.tsx`, `Icon/QuoteIcon.tsx`, `Icon/HobbyIcon.tsx`, `Icon/HobbyIcons.tsx`, `hooks/useIntersectionObserver.ts`, `hooks/useNavObserver.tsx`, `hooks/useInterval.ts`, `hooks/useWindow.ts`, `hooks/useDetectOutsideClick.ts`, `utils/animationUtils.ts`, `utils/skillAnimations.js`, `utils/fileUtils.ts` (verified unimported), `pages/education.tsx`, `pages/site-info.tsx`, `pages/info.tsx`, `pages/contact.tsx`, `pages/api/.gitkeep`, `components/.gitkeep`.

New:

- `Sections/Nav.tsx` — the static top bar.
- `Sections/Hero.tsx` — rewritten, no parallax.
- `Sections/About.tsx` — one paragraph.
- `Sections/SelectedWork.tsx` — three entries.
- `Sections/Roles.tsx` — the one-line timeline.
- `Sections/Footer.tsx` — rewritten with email copy and icons.

Kept as is: `Layout/Page.tsx`, `Layout/Section.tsx`, `Icon/Icon.tsx`, `Icon/GithubIcon.tsx`, `Icon/LinkedInIcon.tsx`, `Icon/StravaIcon.tsx`, `utils/analytics.ts`, `utils/imageUrl.ts`, `config.ts`.

`pages/_app.tsx` is reduced to importing the styles and rendering `Component`. `pages/index.tsx` renders `Page > Nav, Hero, About, SelectedWork, Roles, Footer`.

Dependencies removed from `app/package.json`: `framer-motion`, `react-icons`, `ts-pattern`, `@headlessui/react`. Verified on 2026-09-28: each is imported only by `_app.tsx`, `InfoPage.tsx`, `Testimonials.tsx` or `dataDef.ts`, all of which this change deletes or rewrites.

`tailwind.config.js`: add `cream`, reorder the sans stack, remove the `typing`, `blink` and `rotate-loader` keyframes. `globalStyles.scss`: remove every keyframe and utility except the hero fade and the Google Fonts imports.

## Images

`app/public/images` goes from 65 files to one: `about/profilepic.jpg` (800×800, verified to carry no EXIF). It remains the hero photo.

Everything else moves to `app/public/images/_archive/` via the existing `yarn images:archive`, which is already git-ignored and not deployed. `yarn images:validate` must pass with zero broken references and zero orphans after the move. The archived files are then removed from the tree in the same commit so the deploy stops shipping them; the archive folder is only a local safety net.

Social icons are inline SVG components, not image files. The company logos are not used. `app/public/favicon.ico` and `site.webmanifest` stay.

## Resume

The served resume is the PDF Will supplied on 2026-09-28 (sha256 `e59ef541…dbaf`, 2 pages, 71 KB), not the one built from `resume/index.html`. It is committed to both `app/public/WillFellhoelterResume.pdf` and `app/src/assets/WillFellhoelterResume.pdf`, because the deploy's `yarn copy-resume` postbuild step overwrites the former with the latter.

Because the PDF is now produced outside the repo, the HTML build in `resume/` no longer describes what is served and running it would overwrite the real PDF with stale content. This change deletes `resume/` and the root `resume:build` script. The HTML source remains in history at `2246376` if it is ever wanted again. The root `playwright` dev dependency stays; the verification screenshots use it.

Two lines in the supplied PDF differ from the corrections in the 2026-09-25 content-ownership doc: "Run 100+ microservices" (the doc says "operate") and "Drive the standardization of deployment and CI/CD across 1,000+ repositories" (the doc says "help map out"). The site's own copy keeps the corrected wording. The PDF ships as supplied; changing it means changing it at its source, which is not in this repo.

## Phase 2: `/sauce`

Not built in this change. Gated on Will saying the Sauce README is stable. The structure is fixed now so the later work is copy only:

1. Hero: one line, `GitHub` and `Install` buttons, one real screenshot from the repo's `Docs/images`.
2. How it works: the README flowchart drawn flat in the site palette (note → graph → dispatcher → workers → back into the vault), three sentences under it.
3. One task in 30 seconds: the README's six steps, numbered.
4. Install: the three `brew`/`sauce` commands, copyable.
5. Status and links: the README's Status paragraph, links to engine, comparison, getting started, changelog.

When it ships, the Sauce card's `href` on the home page changes from GitHub to `/sauce` and the nav gains `Sauce`.

## Verification

All of these pass before the PR opens:

1. `yarn compile` (tsc) with zero errors.
2. `yarn lint` with no new errors. The 55 pre-existing eslint errors in `data.tsx` are expected to drop to zero because the JSX bullet content that caused them is gone.
3. `yarn build` succeeds and `out/` contains `index.html` and no `education/`, `site-info/`, `info/` or `contact/` directories.
4. `yarn images:validate` reports zero broken references and zero orphans.
5. `grep -rn "opacity-0\|animate-on-scroll\|animate-on-load" app/src` returns nothing.
6. `ls app/public/images` shows one file.
7. Playwright screenshot of `out/index.html` at 1280×800 and 390×844, attached to the PR. Total page height at 1280 wide ≤ 2,600px.
8. Word count of the rendered `<main>` text ≤ 400.
9. Every link on the page resolves: the PDF, GitHub, LinkedIn, Strava, the Sauce repo, the site repo.
10. The `pr` workflow's `validate-build` and `lint` jobs pass on the PR.
11. `out/WillFellhoelterResume.pdf` after `yarn build && yarn copy-resume` has sha256 `e59ef541c24fb78eeba19f838381d80c80db811442729d4838c66338d4d4dbaf`.

## Out of scope, tracked elsewhere

- Repo hygiene: GPS EXIF in history, the two public `docs/` files. Will's item 1, ahead of this.
- Role-title alignment between LinkedIn and the site for MCG, Cerner, Canary and Lendflow. Will's item 3. The one-line roles here use the titles already on the site.
- The single Sauce copy refresh across LinkedIn, site and resume once the rework settles. Will's item 4.
