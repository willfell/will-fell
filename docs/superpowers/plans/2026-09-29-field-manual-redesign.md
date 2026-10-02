# Field Manual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild willfellhoelter.com as the dark "Field Manual" page from the 2026-09-29 spec: one page with hero, numbers, how Will works, selected work, expandable roles, positions, a build-time GitHub contribution calendar, and contact.

**Architecture:** Next.js 14 static export with `app/src/data/data.tsx` as the only prose file. The home page is `Page > Nav, main(Hero, Glance, HowIWork, SelectedWork, Roles, Positions, GitHubActivity, Contact), Footer`. A build-time script fetches the public GitHub calendar into a committed JSON snapshot that the page imports; the Playwright gate at the repo root is rewritten first and is the failing test until the page lands.

**Tech Stack:** Next.js 14.0.3, React 18, TypeScript 5.3, Tailwind 3.3.5 (no `text-balance`, so `[text-wrap:balance]` arbitrary properties), Sass, Yarn 1.22 (on PATH), Node 26 locally and 22 in CI, Playwright at the repo root.

**Spec:** `docs/superpowers/specs/2026-09-29-field-manual-redesign.md`. Copy source: the artboard `project/Main.dc.html` on https://claude.ai/artifact/Mz2NZSLN8VzmU3tttuNBfd, transcribed into Task 4's `data.tsx`.

## Global Constraints

- Every `yarn` command runs from `app/`. The root `package.json` has `site:verify`, run with `npm run` from the repo root.
- `app/src/data/data.tsx` holds every sentence on the page. Components may carry UI labels only (button text, section labels, "Currently", "Less"/"More").
- Copy rules that never bend: "Operate 100+" / "operations for", never "run 100+"; "Help map out", never a solo claim about the 1,000+ repos; "K8s", never "Kubernetes"; "SSO" and "one gateway", never "Entra ID" or "AgentGateway"; the Sauce blurb is the frozen text. `scripts/verify-site.js` pins all four.
- Tailwind 3.3.5: `[text-wrap:balance]`, `[text-wrap:pretty]`, `[font-stretch:115%]`, `[direction:rtl]` are arbitrary properties; `h-3 w-3`, never `size-3`.
- Colour tokens are the spec's table, added to `tailwind.config.js` in Task 3 and used only by name. No hex in components.
- Motion budget: the existing `.hero-enter` fade, smooth anchor scrolling, and the roles' plus glyph turning; all off under `prefers-reduced-motion`.
- `yarn build` runs `yarn github:fetch` first (Task 2). Offline, set `GITHUB_CONTRIBUTIONS_SKIP=1` so the committed snapshot is used.
- Gates before the PR opens: `yarn compile`, `yarn lint:check`, `yarn images:validate`, `yarn github:fetch --check`, `yarn build && yarn copy-resume`, `npm run site:verify`.
- Commit on this branch (`claude/personal-website-redesign-8e0916`) after each task. Every commit message ends with a blank line and the `Co-Authored-By:` line of the session that made it (the commits carry Sonnet 5.5 and Opus 5.5). Do not push or open the PR without Will's go-ahead (Task 6 asks).

## Review Focus

1. **A visitor on a 320–390px phone.** The heatmap is 53 columns wide and lives in its own `overflow-x-auto` box, started at the right edge by `[direction:rtl]`; role rows and the flow diagrams wrap. Pinned by the `scrollWidth ≤ width` assertions at 390 and 320, including with every role open.
2. **GitHub down or its markup changed at build time.** `fetch-contributions.js` validates what it fetched (≥ 360 consecutive days, total = sum) and on any failure keeps the committed snapshot with a warning; the build never fails on GitHub. Pinned by the `GITHUB_CONTRIBUTIONS_URL` failure run in Task 2 and by `yarn github:fetch --check`.
3. **The number Will sees is not the number the public sees.** Logged in, GitHub shows him 8,980; the public calendar shows about 5,000 because the rest is in a private org. Nothing in the code can change that. GitHub → Settings → Public profile → Contributions & activity → "Include private contributions on my profile" fixes it, and the next build picks it up. Task 6 reminds him before the merge.
4. **A browser that refuses `navigator.clipboard`.** The copy button in `#contact` must not throw or claim "Copied"; the address stays selected as a `mailto:` link. Pinned by the clipboard check.
5. **The deploy's postbuild step overwriting the PDF.** `yarn copy-resume` copies `src/assets/` over `public/`; the sha256 gate catches a mismatch.
6. **JavaScript off or `prefers-reduced-motion` on.** Roles are native `<details>`, the hero fade starts visible under reduced motion, and the no-script check reads the hero heading's opacity.
7. **Copy drift from LinkedIn.** Resume bullets are word for word from the current site except Kubernetes → K8s and the three Accuris lines Will approved on 2026-09-29; `docs/linkedin-updates-2026-09-29.md` carries them to LinkedIn and the PDF.

---

### Task 0: Toolchain and a baseline build

**Files:** none changed.

- [ ] **Step 1: Install app dependencies**

Run from `app/`:

```bash
yarn install --frozen-lockfile
```

Expected: ends with `Done in …s.` and no `error` lines.

- [ ] **Step 2: Install the root verifier and its browser**

Run from the repo root:

```bash
npm install && npx playwright install chromium
```

Expected: `added … packages` then Playwright downloads Chromium (the cache at `~/Library/Caches/ms-playwright` is empty on this machine).

- [ ] **Step 3: Build the current site so Task 1's gate has something to fail against**

Run from `app/`:

```bash
yarn build && yarn copy-resume
```

Expected: `next build` reports `Route (pages) /` and `out/index.html` exists. Then, from the repo root:

```bash
git check-ignore -q app/out && echo ignored
```

Expected: `ignored`. If it prints nothing, append `app/out/` to `.gitignore` and include that change in Task 1's commit.

---

### Task 1: The verification gate (the failing test)

**Files:**
- Modify: `scripts/verify-site.js`

The 2026-09-28 gates that the redesign retires: height ≤ 2,600, ≤ 400 words, Fira Code, the 17px hero paragraph, the copy button in the footer. The new page is about 7,000px tall, loads Archivo and JetBrains Mono, keeps the copy button in `#contact`, renders the GitHub snapshot, and never says Kubernetes.

- [ ] **Step 1: Replace the constants and the desktop checks**

In `scripts/verify-site.js`, replace everything from `const ROOT` down to the end of `const MIME = {…};` with:

```js
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "app", "out");
const SHOTS = path.join(ROOT, "app", ".screenshots");
const SNAPSHOT = path.join(ROOT, "app", "src", "data", "github-contributions.json");
const SITE_ORIGIN = "https://willfellhoelter.com";
const MAX_HEIGHT = 8000;
const MAX_WORDS = 1500;
const PHONE_WIDTHS = [390, 320];
const MIN_LEDE_PX = 17;
const FONTS = ["Archivo", "JetBrains Mono"];
const PDF_PATH = "/WillFellhoelterResume.pdf";
const PDF_SHA256 =
  "ee0c9243f632798e01287555ce940188ed21459eebd4c26bd81eb6a45fb144ef";
const REQUIRED_LINKS = [
  PDF_PATH,
  "https://github.com/willfell",
  "https://linkedin.com/in/will-fellhoelter-1aa17312b",
  "https://www.strava.com/athletes/112909908",
  "https://github.com/willfell/sauce",
  "https://github.com/willfell/will-fell",
];
const DEAD_ROUTES = ["education", "site-info", "info", "contact", "archive"];
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
};
```

Then, inside `desktopChecks`, replace the block that starts `const bodyFont = await page.evaluate(` and ends with the `monoLoaded` check (two `check(...)` calls) with:

```js
  const lede = await page.evaluate(() => {
    const p = document.querySelector("#hero [data-lede]");
    return p ? parseFloat(getComputedStyle(p).fontSize) : 0;
  });
  check(lede >= MIN_LEDE_PX, `hero lede is ${lede}px, spec says at least ${MIN_LEDE_PX}px`);

  const missingFonts = await page.evaluate(
    (families) =>
      families.filter(
        (family) =>
          !Array.from(document.fonts).some(
            (f) => f.family.replace(/["']/g, "") === family && f.status === "loaded",
          ),
      ),
    FONTS,
  );
  check(missingFonts.length === 0, `fonts never loaded: ${missingFonts.join(", ")}`);
```

And replace the `targets` object inside the contrast `page.evaluate` with:

```js
    const targets = {
      "sauce link": document.querySelector('#work a[href*="sauce"]'),
      "footer source line": document.querySelector('footer a[href*="will-fell"]'),
      "glance label": document.querySelector("#glance dt"),
      "role date": document.querySelector("#experience summary span"),
      "positions strip": document.querySelector("#positions p"),
    };
```

- [ ] **Step 2: Add the GitHub gate and the Kubernetes rule**

After the `rolesChecks` function, add:

```js
// The GitHub band renders the committed snapshot: one column per week, one
// cell per day, and the total the snapshot carries.
async function githubChecks(browser, origin) {
  const present = fs.existsSync(SNAPSHOT);
  check(present, "app/src/data/github-contributions.json missing; run `yarn github:fetch` in app/");
  if (!present) return;
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, new Set());
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  const rendered = await page.evaluate(() => ({
    weeks: document.querySelectorAll("#github [data-week]").length,
    days: document.querySelectorAll("#github [data-day]").length,
    total: document.querySelector("#github [data-total]")?.textContent,
    labels: Array.from(document.querySelectorAll("#github [data-week] > span:first-child")).filter(
      (s) => s.textContent.trim(),
    ).length,
    link: !!document.querySelector('#github a[href="https://github.com/willfell"]'),
  }));
  const weeks = Math.ceil(snapshot.days.length / 7);
  check(rendered.days === snapshot.days.length, `heatmap renders ${rendered.days} days, snapshot has ${snapshot.days.length}`);
  check(rendered.weeks === weeks, `heatmap renders ${rendered.weeks} weeks, expected ${weeks}`);
  check(
    rendered.total === snapshot.total.toLocaleString("en-US"),
    `GitHub total reads ${JSON.stringify(rendered.total)}, snapshot says ${snapshot.total}`,
  );
  check(rendered.labels >= 11, `heatmap shows ${rendered.labels} month labels, expected at least 11`);
  check(rendered.link, "GitHub band has no link to github.com/willfell");
  await context.close();
}
```

In `rolesChecks`, directly after the `Entra ID|AgentGateway` check, add:

```js
  check(!/Kubernetes/.test(text), 'page says "Kubernetes"; the site says "K8s"');
```

- [ ] **Step 3: Move the clipboard check to the contact band**

In `clipboardChecks`, change both selectors from `'footer button[aria-label="Copy email address"]'` to `'#contact button[aria-label="Copy email address"]'`, and replace the `after.label !== "copied"` check with:

```js
  check(!/copied/i.test(after.label || ""), 'copy button claims "Copied" although the clipboard was refused');
```

In `main()`, add `await githubChecks(browser, origin);` on the line after `await rolesChecks(browser, origin);`.

- [ ] **Step 4: Run the gate against the old build and watch it fail**

Run from the repo root:

```bash
npm run site:verify
```

Expected: exit 1 with `FAIL` lines including `hero lede is 0px`, `fonts never loaded: Archivo, JetBrains Mono`, `app/src/data/github-contributions.json missing`, `page says "Kubernetes"`, `glance label contrast 0:1`, and a Playwright timeout naming `#contact button[aria-label="Copy email address"]` (the old button sits in the footer; the timeout takes 30 seconds to surface). The height and word limits pass because the old page is small.

- [ ] **Step 5: Commit**

Executed 2026-09-29. The code-quality review of this task then hardened the gate beyond the text above, and the committed `scripts/verify-site.js` is the reference: `githubChecks` compares the rendered `data-day` dates to the snapshot's and names the first one that differs (not just counts), requires every column after the first to start on a Sunday, derives the week count from the first day's weekday, tolerates an unreadable snapshot without aborting the run, and at 320px scrolls the oldest week into view (instantly, so a smooth-scrolling box cannot fake a failure) to prove the heatmap's own box carries the overflow; `staticChecks` also rejects "Kubernetes" anywhere in `out/index.html` (attributes and `<meta>` included); a missing lede or contrast target is reported as missing rather than as 0; the fonts check awaits `document.fonts.ready`; and a missing `#contact` copy button fails at once instead of after a 30-second timeout.

```bash
git add scripts/verify-site.js .gitignore
git commit -m "test: retire the three-screen gates and add the Field Manual ones

Height and word budgets loosen to the new page, the fonts become Archivo
and JetBrains Mono, the copy button moves to #contact, and three gates
are new: the GitHub band must render the committed snapshot week for
week and day for day with its total, the page must never say
Kubernetes, and contrast is also checked on a glance label, a role date
and the positions strip.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 2: The GitHub contribution snapshot

**Files:**
- Create: `app/scripts/github/fetch-contributions.js`
- Create: `app/src/data/github-contributions.json` (written by the script)
- Modify: `app/package.json` (scripts)

**Interfaces:**
- `yarn github:fetch` writes `src/data/github-contributions.json` as `{ login, fetchedAt, total, days: [{ date: "YYYY-MM-DD", count }] }`, rewriting only when the calendar changed; exit 0 on any fetch failure when a snapshot exists.
- `yarn github:fetch --check` validates the committed snapshot and fetches nothing; exit 1 with `FAIL …` lines otherwise.
- Env: `GITHUB_CONTRIBUTIONS_SKIP=1` skips the fetch; `GITHUB_CONTRIBUTIONS_URL` overrides the source (used only to test the failure path).

- [ ] **Step 1: Write the script**

Create `app/scripts/github/fetch-contributions.js`:

```js
#!/usr/bin/env node
"use strict";

// Fetches the last year of github.com/willfell contributions into
// src/data/github-contributions.json. It reads the public calendar, so no
// token is needed; private contributions show up once GitHub's "Include
// private contributions on my profile" setting is on. Any failure keeps the
// committed snapshot so a build never depends on GitHub being up.
//
//   node scripts/github/fetch-contributions.js          fetch, rewrite on change
//   node scripts/github/fetch-contributions.js --check  validate the snapshot only
//   GITHUB_CONTRIBUTIONS_SKIP=1 ...                     skip the fetch (offline)

const fs = require("fs");
const path = require("path");

const LOGIN = "willfell";
const SOURCE =
  process.env.GITHUB_CONTRIBUTIONS_URL || `https://github.com/users/${LOGIN}/contributions`;
const OUT = path.resolve(__dirname, "../../src/data/github-contributions.json");
const MIN_DAYS = 360;
const DAY_MS = 86400000;
const FETCH_TIMEOUT_MS = 15000;

// GitHub's calendar fragment: one <td data-date … id="contribution-day-component-R-C">
// per day (attribute order is not relied on), its count in a <tool-tip for="…">
// ("No contributions on …" or "12 contributions on …"), and the year's total
// in the activity heading.
function parse(html) {
  const heading = html.match(/id="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/);
  const totalMatch = heading && heading[1].replace(/\s+/g, " ").match(/([\d,]+) contributions?/);
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : NaN;
  const tips = new Map();
  for (const m of html.matchAll(
    /<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g,
  )) {
    tips.set(m[1], m[2]);
  }
  const days = [];
  for (const [cell] of html.matchAll(/<td\b[^>]*>/g)) {
    const date = cell.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/);
    const id = cell.match(/\bid="(contribution-day-component-\d+-\d+)"/);
    if (!date || !id) continue;
    const count = (tips.get(id[1]) || "").match(/^\s*(\d[\d,]*|No) contributions?/);
    days.push({
      date: date[1],
      count: count && count[1] !== "No" ? Number(count[1].replace(/,/g, "")) : 0,
    });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { total, days };
}

function validate(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.days)) return ["snapshot has no days array"];
  if (!snapshot.days.length) return ["snapshot has no days"];
  const malformed = snapshot.days.findIndex(
    (d) => !d || !/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !Number.isInteger(d.count) || d.count < 0,
  );
  if (malformed !== -1) return [`day ${malformed} is not { date: "YYYY-MM-DD", count: n }`];
  const problems = [];
  if (snapshot.days.length < MIN_DAYS) {
    problems.push(`only ${snapshot.days.length} days, expected at least ${MIN_DAYS}`);
  }
  for (let i = 1; i < snapshot.days.length; i++) {
    const gap = Date.parse(snapshot.days[i].date) - Date.parse(snapshot.days[i - 1].date);
    if (gap !== DAY_MS) {
      problems.push(
        `days are not consecutive between ${snapshot.days[i - 1].date} and ${snapshot.days[i].date}`,
      );
      break;
    }
  }
  // The page lays the days out seven per column from the first one, so the
  // calendar must start on a Sunday, as GitHub's fragment does.
  if (new Date(`${snapshot.days[0].date}T00:00:00Z`).getUTCDay() !== 0) {
    problems.push(`calendar starts on ${snapshot.days[0].date}, which is not a Sunday`);
  }
  const sum = snapshot.days.reduce((n, d) => n + d.count, 0);
  if (snapshot.total !== sum) problems.push(`total ${snapshot.total} is not the sum of the days, ${sum}`);
  return problems;
}

// The committed snapshot and the reasons it cannot be used, if any. Git writes
// this file too (a conflicted merge), so it is never trusted unread.
function readExisting() {
  if (!fs.existsSync(OUT)) {
    return { snapshot: null, problems: ["src/data/github-contributions.json is missing"] };
  }
  try {
    const snapshot = JSON.parse(fs.readFileSync(OUT, "utf8"));
    return { snapshot, problems: validate(snapshot) };
  } catch (error) {
    return {
      snapshot: null,
      problems: [`src/data/github-contributions.json is not valid JSON: ${error.message}`],
    };
  }
}

function sameCalendar(a, b) {
  return !!a && !!b && a.total === b.total && JSON.stringify(a.days) === JSON.stringify(b.days);
}

// Write beside the file and rename, so an interrupted write never leaves a
// truncated snapshot behind; a failed rename leaves no scratch file either.
function write(snapshot) {
  const tmp = `${OUT}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify(snapshot, null, 2) + "\n");
    fs.renameSync(tmp, OUT);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

function warn(message) {
  if (!process.env.GITHUB_ACTIONS) {
    console.warn(message);
    return;
  }
  const escaped = message.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  console.warn(`::warning title=github:fetch::${escaped}`);
}

// Node puts the network reason (ECONNREFUSED, ENOTFOUND, a certificate error)
// in error.cause; "fetch failed" alone is not diagnosable in a CI log.
function describe(error) {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause && (error.cause.code || error.cause.message);
  return cause ? `${error.message} (${cause})` : error.message;
}

async function fetchSnapshot() {
  const res = await fetch(SOURCE, {
    headers: { "user-agent": "willfellhoelter.com build" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  const snapshot = { login: LOGIN, fetchedAt: new Date().toISOString(), ...parse(await res.text()) };
  const problems = validate(snapshot);
  if (problems.length) throw new Error(`fetched calendar failed validation: ${problems.join("; ")}`);
  return snapshot;
}

async function main() {
  const existing = readExisting();
  if (process.argv.includes("--check")) {
    for (const p of existing.problems) console.error(`FAIL ${p}`);
    if (existing.problems.length) process.exit(1);
    const { days, total, fetchedAt } = existing.snapshot;
    console.log(`PASS ${days.length} days, ${total} contributions, fetched ${fetchedAt}`);
    return;
  }
  if (process.env.GITHUB_CONTRIBUTIONS_SKIP === "1") {
    if (existing.problems.length) {
      console.error(
        `github:fetch skipped, but the committed snapshot is unusable: ${existing.problems.join("; ")}`,
      );
      process.exit(1);
    }
    console.log("github:fetch skipped (GITHUB_CONTRIBUTIONS_SKIP=1)");
    return;
  }
  try {
    const snapshot = await fetchSnapshot();
    if (!existing.problems.length && sameCalendar(existing.snapshot, snapshot)) {
      console.log(`github:fetch unchanged: ${snapshot.total} contributions over ${snapshot.days.length} days`);
      return;
    }
    write(snapshot);
    console.log(`github:fetch wrote ${snapshot.days.length} days, ${snapshot.total} contributions`);
  } catch (error) {
    if (existing.problems.length) {
      console.error(
        `github:fetch failed (${describe(error)}) and the committed snapshot is unusable: ` +
          existing.problems.join("; "),
      );
      process.exit(1);
    }
    warn(`github:fetch failed, keeping the snapshot from ${existing.snapshot.fetchedAt}: ${describe(error)}`);
  }
}

main().catch((error) => {
  console.error(`github:fetch crashed: ${describe(error)}`);
  process.exit(1);
});
```

- [ ] **Step 2: Wire the scripts**

In `app/package.json`, change the `build` script and add `github:fetch` so the `scripts` block reads:

```json
  "scripts": {
    "build": "yarn github:fetch && yarn compile && yarn lint:check && yarn next build",
    "clean": "rm -rf build-tsc .next",
    "compile": "yarn run -T tsc --build --verbose",
    "dev": "yarn compile && yarn next dev",
    "start": "yarn next start",
    "sitemap": "yarn next-sitemap",
    "copy-resume": "cp -r src/assets/WillFellhoelterResume.pdf out/WillFellhoelterResume.pdf",
    "export": "yarn next export",
    "lint": "eslint . --fix",
    "lint:check": "eslint .",
    "format": "prettier --write .",
    "github:fetch": "node scripts/github/fetch-contributions.js",
    "images:validate": "node scripts/images/validate.js",
    "images:optimize": "node scripts/images/optimize.js",
    "images:archive": "node scripts/images/archive-orphans.js"
  },
```

- [ ] **Step 3: Fetch the first snapshot and validate it**

Run from `app/`:

```bash
yarn github:fetch && yarn github:fetch --check
```

Expected: `github:fetch wrote 369 days, N contributions` (GitHub's fragment runs from Sunday 2025-09-28 through tomorrow in UTC, so 368 or 369 days depending on the hour; N is about 5,000 until Will enables private contributions), then `PASS 369 days, N contributions, fetched 2026-…`.

- [ ] **Step 4: Prove the failure path keeps the snapshot**

Run from `app/`:

```bash
GITHUB_CONTRIBUTIONS_URL=https://github.com/users/willfell/no-such-page yarn github:fetch; echo "exit $?"
```

Expected: `github:fetch failed, keeping the snapshot from …: GitHub answered 404` and `exit 0`. Then:

```bash
GITHUB_CONTRIBUTIONS_SKIP=1 yarn github:fetch
```

Expected: `github:fetch skipped (GITHUB_CONTRIBUTIONS_SKIP=1)`. Only the literal `1` skips; any other value fetches.

- [ ] **Step 5: Lint the script**

Run from `app/`:

```bash
yarn lint:check
```

Expected: no output (exit 0). The flat config treats `scripts/**/*.js` as CommonJS with Node globals.

- [ ] **Step 6: Commit**

```bash
git add app/scripts/github/fetch-contributions.js app/src/data/github-contributions.json app/package.json
git commit -m "site: fetch the GitHub contribution calendar at build time

yarn build now starts by reading the public calendar for willfell into
src/data/github-contributions.json, the file the page imports. The
script validates what it fetched, rewrites only on change, and on any
failure keeps the committed snapshot, so the build never depends on
GitHub. --check validates the snapshot; GITHUB_CONTRIBUTIONS_SKIP=1
skips the fetch offline.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 3: Theme foundation

**Files:**
- Modify: `app/tailwind.config.js`
- Modify: `app/src/globalStyles.scss`
- Modify: `app/src/pages/_document.tsx`
- Modify: `app/src/components/Layout/Page.tsx`
- Modify: `app/public/site.webmanifest`

The old components keep compiling after this task (unknown Tailwind classes simply render nothing), so it is a safe commit on its own.

- [ ] **Step 1: Tokens and type**

Replace `app/tailwind.config.js` with:

```js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css,scss}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Archivo", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"],
      },
      // Token names only, by role. `amber` replaces Tailwind's amber-* scale on
      // purpose: the page has one accent, so `text-amber-400` must not exist.
      colors: {
        ink: "#121513",
        "ink-2": "#4A4F4C",
        pine: "#0F1A15",
        soot: "#0A0F0C",
        surface: "#1A1E1B",
        "surface-pine": "#16231C",
        line: "#2E3330",
        "line-pine": "#2A3A31",
        "line-mid": "#3A403C",
        "line-pine-mid": "#3A4A41",
        "line-hi": "#6B736E",
        "line-soot": "#1E2823",
        paper: "#ECEBE5",
        "paper-2": "#C2C7C3",
        muted: "#939A95",
        amber: "#E9A23B",
        heat: {
          0: "#1E2A24",
          1: "#504320",
          2: "#806129",
          3: "#B58132",
          4: "#E9A23B",
        },
      },
      maxWidth: {
        page: "1296px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

- [ ] **Step 2: Ground colour and the hero grid**

Replace `app/src/globalStyles.scss` with:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  -webkit-tap-highlight-color: transparent;
  color-scheme: dark;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

body {
  @apply bg-ink text-paper antialiased;
}

/* Keyboard focus on a dark ground: the browser default is easy to lose. */
:focus-visible {
  outline: 2px solid theme("colors.paper");
  outline-offset: 2px;
}

@layer utilities {
  /* The faint 32px grid behind the hero; the two gradients are the only
     gradients on the page. */
  .bg-grid {
    background-image:
      linear-gradient(to right, theme("colors.paper / 4.5%") 1px, transparent 1px),
      linear-gradient(to bottom, theme("colors.paper / 4.5%") 1px, transparent 1px);
    background-size: 32px 32px;
  }
}

@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.hero-enter {
  animation: hero-enter 500ms ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-enter {
    animation: none;
  }
}
```

- [ ] **Step 3: Fonts**

In `app/src/pages/_document.tsx`, replace the Google Fonts `<link>` (the one whose `href` names Inter and Fira Code) with:

```tsx
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
```

- [ ] **Step 4: Browser chrome colours**

In `app/src/components/Layout/Page.tsx`, add this line directly after `<meta content={description} name="description" />`:

```tsx
        <meta content="#121513" name="theme-color" />
```

Replace `app/public/site.webmanifest` with:

```json
{
  "name": "Will Fellhoelter",
  "short_name": "Will Fellhoelter",
  "icons": [{ "src": "/favicon.ico", "sizes": "any" }],
  "theme_color": "#121513",
  "background_color": "#121513",
  "display": "browser"
}
```

- [ ] **Step 5: Compile and lint**

Run from `app/`:

```bash
yarn compile && yarn lint:check
```

Expected: tsc prints the project it built with no errors; eslint prints nothing.

- [ ] **Step 6: Commit**

```bash
git add app/tailwind.config.js app/src/globalStyles.scss app/src/pages/_document.tsx app/src/components/Layout/Page.tsx app/public/site.webmanifest
git commit -m "site: dark Field Manual tokens and type

The spec's palette (ink, pine, soot grounds; paper and muted text; one
amber accent; five heatmap levels) becomes Tailwind colour names,
Archivo and JetBrains Mono replace Inter and Fira Code, the body goes
dark, and the browser chrome follows.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 4: The page

**Files:**
- Modify: `app/src/data/dataDef.ts`
- Modify: `app/src/data/data.tsx`
- Modify: `app/src/components/Layout/Section.tsx`
- Create: `app/src/components/Layout/SectionHeader.tsx`
- Create: `app/src/components/Icon/Glyphs.tsx`
- Modify: `app/src/components/Sections/Nav.tsx`
- Modify: `app/src/components/Sections/Hero.tsx`
- Create: `app/src/components/Sections/Glance.tsx`
- Create: `app/src/components/Sections/HowIWork.tsx`
- Create: `app/src/components/Sections/Flow.tsx`
- Modify: `app/src/components/Sections/SelectedWork.tsx`
- Modify: `app/src/components/Sections/Roles.tsx`
- Create: `app/src/components/Sections/Positions.tsx`
- Create: `app/src/components/Sections/GitHubActivity.tsx`
- Create: `app/src/components/Sections/Contact.tsx`
- Modify: `app/src/components/Sections/Footer.tsx`
- Modify: `app/src/pages/index.tsx`
- Delete: `app/src/components/Sections/About.tsx`, `app/src/components/Icon/Icon.tsx`, `app/src/components/Icon/GithubIcon.tsx`, `app/src/components/Icon/LinkedInIcon.tsx`, `app/src/components/Icon/StravaIcon.tsx`

This is one task because the data shape changes under every section at once; the tree does not compile between Step 2 and Step 18, so there is one commit at the end. Write the files in order; each step is one file.

**Interfaces (used by every later step):**
- `data.tsx` exports: `homePageMeta`, `resumeHref`, `contactEmail`, `githubHref`, `linkedInHref`, `stravaHref`, `siteRepoHref`, `navLinks`, `heroData`, `heroLinks`, `stats`, `statsCaption`, `howIWork`, `selectedWorkIntro`, `featuredWork`, `workItems`, `roles`, `education`, `positionsIntro`, `positions`, `repos`, `contact`.
- `Section` props: `sectionId`, `band?: "ink" | "pine"`, `className?`, `innerClassName?` (default `py-16 md:py-24 xl:py-[120px]`).
- `SectionHeader` props: `number`, `label`, `heading`, `lede?`, `action?`, `band?`; it also exports `Eyebrow` (`number`, `label`, `band?`).
- `Glyphs` exports `DownloadGlyph`, `ExternalGlyph`, `FlowArrowGlyph`, `PlusGlyph`, each taking `className?`.
- `Flow` props: `label`, `nodes: FlowNode[]`.

- [ ] **Step 1: Types**

Replace `app/src/data/dataDef.ts` with:

```ts
export interface HomepageMeta {
  title: string;
  description: string;
}

export interface NavLink {
  href: string;
  text: string;
}

export interface HeroAction {
  href: string;
  text: string;
  external?: boolean;
}

export interface Hero {
  headline: string;
  emphasis: string;
  lede: string;
  imageSrc: string;
  imageAlt: string;
  currently: { lead: string; rest: string }[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface Intro {
  heading: string;
  lede: string;
}

export interface Step {
  title: string;
  body: string;
  example: string;
}

export interface HowIWork extends Intro {
  steps: Step[];
}

export interface FlowNode {
  title: string;
  detail: string;
  highlight?: boolean;
}

export interface FeaturedWork {
  context: string;
  title: string;
  description: string;
  flowLabel: string;
  flow: FlowNode[];
}

export interface Metric {
  value: string;
  label: string;
  before?: string;
}

export interface WorkItem {
  context: string;
  title: string;
  description: string;
  metric?: Metric;
  install?: string[];
  href?: string;
  hrefText?: string;
  hrefLabel?: string;
}

export interface Role {
  dates: string;
  employer: string;
  title: string;
  line: string;
  bullets: string[];
}

export interface Education {
  year: string;
  school: string;
  degree: string;
}

export interface Position {
  title: string;
  body: string;
}

export interface Repo {
  name: string;
  href: string;
  description: string;
  meta: string[];
}
```

- [ ] **Step 2: Copy**

Replace `app/src/data/data.tsx` with (every string is verbatim from the artboard; keep the curly apostrophes):

```tsx
import { getImageUrl } from "../utils/imageUrl";
import {
  Education,
  FeaturedWork,
  Hero,
  HeroAction,
  HomepageMeta,
  HowIWork,
  Intro,
  NavLink,
  Position,
  Repo,
  Role,
  Stat,
  WorkItem,
} from "./dataDef";

export const homePageMeta: HomepageMeta = {
  title: "Will Fellhoelter - Principal Software Engineer",
  description:
    "Will Fellhoelter, Principal Software Engineer in Denver. Eight years across the stack, lately agentic AI: MCP servers, plugin libraries, and the knowledge bases agents work from.",
};

export const resumeHref = "/WillFellhoelterResume.pdf";
export const contactEmail = "willfellhoelter@gmail.com";
export const githubHref = "https://github.com/willfell";
export const linkedInHref = "https://linkedin.com/in/will-fellhoelter-1aa17312b";
export const stravaHref = "https://www.strava.com/athletes/112909908";
export const siteRepoHref = "https://github.com/willfell/will-fell";

export const navLinks: NavLink[] = [
  { href: "#work", text: "Work" },
  { href: "#experience", text: "Experience" },
  { href: "#positions", text: "Positions" },
  { href: "#github", text: "GitHub" },
];

export const heroData: Hero = {
  headline: "I end up wherever the gap is between what a client needs and",
  emphasis: "what actually ships.",
  lede: "Eight years across the stack: data, application logic, deploys, the K8s underneath, the alerting on top. Most of it starts with listening, so what gets built is what was actually needed. Lately that points at agentic AI: MCP servers, plugin libraries, and the knowledge bases agents work from.",
  imageSrc: getImageUrl("/images/about/profilepic.jpg"),
  imageAlt: "Will Fellhoelter laughing, in sunglasses, against a blue sky",
  currently: [
    {
      lead: "Principal Software Engineer at Accuris.",
      rest: "Agentic AI development, operations, K8s. Jack of all trades and master of none.",
    },
    {
      lead: "Building Sauce.",
      rest: "An agentic operating loop for Obsidian, open source.",
    },
  ],
};

export const heroLinks: HeroAction[] = [
  { href: githubHref, text: "GitHub", external: true },
  { href: linkedInHref, text: "LinkedIn", external: true },
  { href: `mailto:${contactEmail}`, text: "Email" },
];

export const stats: Stat[] = [
  { value: "8", label: "Years across the stack" },
  { value: "250+", label: "Tools behind the org’s MCP gateway" },
  { value: "100+", label: "Microservices in operations, 6 regions" },
  { value: "1,000+", label: "Repositories moved to GitHub" },
];

export const statsCaption = "Accuris, 2025 to now. All of it with a team.";

export const howIWork: HowIWork = {
  heading: "Defined, communicated, delivered.",
  lede: "It starts with listening: understanding what someone actually needs, then using the engineering to get there without the misunderstandings that derail most projects. Then making it repeatable, so the next team doesn’t start from zero.",
  steps: [
    {
      title: "Defined",
      body: "Sit with the people who need the thing. Listen more than talk. Pin down what done looks like before anyone writes code.",
      example: "forml → first engineering hire, scoping with founders and enterprise clients",
    },
    {
      title: "Communicated",
      body: "Say it back in plain language, argue the approach while it’s still cheap, and keep the decision where everyone can find it.",
      example: "Accuris → design reviews with teams for cost and security",
    },
    {
      title: "Delivered",
      body: "Data, application code, deploys, the K8s underneath, the alerting on top. Whatever layer the outcome needs.",
      example: "forml → one-click on-prem installs, onboarding from 3 days to 4 hours",
    },
    {
      title: "Repeatable",
      body: "Turn the one-off into the pattern: an MCP server, a plugin, a template, a note an agent can read.",
      example: "Accuris → the plugin library and MCP mesh teams use every day",
    },
  ],
};

export const selectedWorkIntro: Intro = {
  heading: "Work I’d point you to.",
  lede: "Agent tooling for a whole org, observability for hundreds of services, installs on someone else’s hardware. Built with platform, product, and engineering teams along the way.",
};

export const featuredWork: FeaturedWork[] = [
  {
    context: "Accuris · 2025–2026 · With the platform team",
    title: "MCP mesh",
    description:
      "Governed agent tooling for the whole org: 250+ tools behind one gateway, SSO, central observability. Built the first internal MCP servers and the plugin library, then, with the platform team, the mesh every team uses. Our own servers for New Relic and PagerDuty live inside it instead of paid vendor connectors.",
    flowLabel:
      "How the mesh fits together: every team uses the plugin library, which goes through the MCP gateway to 250+ tools, including the org’s own New Relic and PagerDuty servers",
    flow: [
      { title: "Every team", detail: "Engineering, product, cross-functional" },
      { title: "Plugin library", detail: "Repeatable workflows, not one-off prompts" },
      { title: "MCP gateway", detail: "SSO and central observability", highlight: true },
      { title: "250+ tools", detail: "Including our own New Relic and PagerDuty servers" },
    ],
  },
  {
    context: "Accuris · 2026 · Runs on the mesh",
    title: "From a page to a documented root cause",
    description:
      "Point the plugin at a PagerDuty alert. It works through the team’s skills and our own context-aware MCP servers, finds the root cause in New Relic, and writes the finding into the team’s Obsidian vault. Troubleshooting and documentation happen in one pass, so the notes are never behind the incident.",
    flowLabel:
      "The incident flow: a PagerDuty alert goes to the agentic plugin, which finds the root cause in New Relic through the org’s own MCP server and documents it in the team’s Obsidian vault",
    flow: [
      { title: "PagerDuty alert", detail: "The page, linked straight from the plugin" },
      { title: "Agentic plugin", detail: "Team skills plus context-aware MCPs", highlight: true },
      { title: "Root cause in New Relic", detail: "Through our own MCP server, not a paid connector" },
      { title: "Obsidian vault", detail: "Documented for the team, same pass" },
    ],
  },
];

export const workItems: WorkItem[] = [
  {
    context: "Accuris · With the platform team",
    title: "The same observability for every service",
    description:
      "Configured the New Relic K8s operator with the platform team so every deployed service gets the same APM injection automatically. No manual setup for developers, consistent naming, and one way to troubleshoot across the org.",
    metric: { value: "400+", label: "Services instrumented the same way, no developer effort" },
  },
  {
    context: "Open source · 2026–",
    title: "Sauce",
    description:
      "An agentic operating loop for Obsidian. Notes become node-based work graphs that agents like Claude Code and Codex execute in isolated workers, with scheduling, retries, handoffs between agents, and a persistent task store. Started as a loop-based forward deployment mechanism, rebuilt around graphs. Versioned vault platform shipped via Homebrew, MIT.",
    install: ["brew tap willfell/sauce", "brew install willfell/sauce/sauce"],
    href: "https://github.com/willfell/sauce",
    hrefText: "github.com/willfell/sauce",
    hrefLabel: "github.com/willfell/sauce (Sauce on GitHub)",
  },
  {
    context: "forml · 2024–2025",
    title: "On-prem in four hours",
    description:
      "First engineering hire at an AI startup. Worked with the founders and enterprise clients to understand what they actually needed, then built one-click on-prem deployment so the deals that required customer-hosted installs could close.",
    metric: { before: "3 days", value: "4 hours", label: "Enterprise onboarding time" },
  },
  {
    context: "Cerner · Lendflow · Project Canary",
    title: "Ephemeral environments, three times",
    description:
      "Self-service test environments with data seeding and automatic cleanup, built for three different orgs: an AWX portal at Cerner, ephemeral infrastructure for dev and QA at Lendflow, a UI with branch and data-source selection at Project Canary. The problem I keep getting handed.",
    metric: { value: "−32%", label: "Environment costs at Lendflow" },
  },
];

export const roles: Role[] = [
  {
    dates: "Mar 2026 – Now",
    employer: "Accuris",
    title: "Principal Software Engineer",
    line: "MCP mesh, observability, multi-region K8s",
    bullets: [
      "Built and launched the MCP mesh: one governed entry point to 250+ tools for engineering, product, and cross-functional teams, with SSO and centralized observability",
      "Designed and shipped production MCP servers that give AI agents natural-language access to internal systems, including our own New Relic and PagerDuty servers in place of paid vendor connectors",
      "Built the incident plugin that takes a PagerDuty alert to a root cause in New Relic and documents it in the team’s Obsidian vault in the same pass",
      "Grew the AI plugin library into how teams use AI day to day, turning one-off prompts into repeatable workflows",
      "With the platform team, rolled out the New Relic K8s operator so 400+ deployed services get consistent APM injection with no manual work from developers, standardizing naming and troubleshooting across the org",
      "Operate 100+ microservices on K8s across 6 regions; led the multi-region buildout of compute and data tiers",
      "Help map out and drive the standardization of deployment and CI/CD across 1,000+ repositories with templated K8s",
      "Build and run CDC pipelines from PostgreSQL into Databricks for mission-critical data",
    ],
  },
  {
    dates: "Apr 2025 – Mar 2026",
    employer: "Accuris",
    title: "Senior Software Engineer",
    line: "GitHub migration, first internal MCP servers",
    bullets: [
      "Led the move of 1,000+ repositories to GitHub and consolidated CI onto GitHub Actions with reusable workflows",
      "Built the first internal MCP servers and the original AI plugin library",
    ],
  },
  {
    dates: "Aug 2024 – Apr 2025",
    employer: "forml",
    title: "Senior Full Stack Engineer",
    line: "First engineering hire, on-prem deploys",
    bullets: [
      "First engineering hire; worked directly with the founders and enterprise clients to scope requirements, set quarterly roadmaps, and ship the platform end to end (Python, Angular, AWS, PostgreSQL)",
      "Built one-click on-prem deployment for enterprise clients, cutting onboarding from 3 days to 4 hours and unblocking deals that required customer-hosted installs",
      "Led the API and architecture work that carried the platform through 2x user growth in 2 months; promoted to Senior",
    ],
  },
  {
    dates: "May 2023 – Aug 2024",
    employer: "Project Canary",
    title: "DevOps Engineer",
    line: "Ephemeral environments, RAG, SOC 2",
    bullets: [
      "Built a self-service tool that lets developers and QA deploy an isolated test environment from any branch in one click, with selectable data sources and automatic cleanup",
      "Built a RAG search app on AWS Bedrock and vector databases for querying internal documents across departments",
      "Ran observability for 10+ critical services (99.99% uptime) and moved it to New Relic, cutting monitoring costs 14%",
      "Fixed bottlenecks in high-throughput time-series PostgreSQL databases, improving query performance 23%",
      "Drove the security work behind passing SOC 2 Type I and Type II, automating controls and cutting audit prep ~30%",
    ],
  },
  {
    dates: "Aug 2021 – May 2023",
    employer: "Lendflow",
    title: "DevSecOps Engineer",
    line: "OpenSearch logging, WAF, on-call",
    bullets: [
      "Centralized logging on OpenSearch, cutting the time to pinpoint production issues from ~3 hours to under 10 minutes",
      "Built ephemeral dev and QA environments to replace always-on ones, cutting environment costs 32%",
      "Put AWS WAF and CloudFront in front of the platform, reducing security incidents 60%",
      "On-call engineer for a platform serving 20K+ users; cut average ticket resolution time 25%",
    ],
  },
  {
    dates: "Mar 2020 – Aug 2021",
    employer: "MCG Health",
    title: "Cloud / DevOps Engineer",
    line: "On-prem to Azure, Chef to Ansible",
    bullets: [
      "Led the migration from on-prem infrastructure to Azure for 3+ teams",
      "Built modular Terraform components that cut new environment setup from ~2 days to 1 hour",
      "Moved configuration management for 100+ Windows servers from Chef to Ansible, with Datadog monitoring",
    ],
  },
  {
    dates: "Oct 2018 – Mar 2020",
    employer: "Cerner Corporation",
    title: "System Engineer",
    line: "Ansible automation, AWX portal",
    bullets: [
      "Wrote Ansible playbooks for server configuration and troubleshooting, saving the team 40+ hours a month",
      "Built an AWX-based portal for scheduling data restores and spinning up ephemeral test environments",
      "Taught biweekly Linux fundamentals sessions for new hires through Cerner’s Tech Academy",
    ],
  },
];

export const education: Education = {
  year: "2018",
  school: "Wichita State University",
  degree: "Management Information Systems",
};

export const experienceHeading = "Eight years, seven roles.";

export const positionsIntro: Intro = {
  heading: "Things I’ll argue for.",
  lede: "I like a real discussion about the right way to do things, and I change my mind when the better argument wins. These are the ones I keep coming back to.",
};

export const positions: Position[] = [
  {
    title: "Listen first, argue early, write it down.",
    body: "Most rework comes from a misunderstanding nobody caught early. So I listen more than I talk, push back while it’s still cheap, and put the decision where the next person will look.",
  },
  {
    title: "Plugins over prompts.",
    body: "A prompt helps one person, once. A plugin backed by an MCP server gives a whole team the same tools, the same context, and the same result.",
  },
  {
    title: "The knowledge base comes first.",
    body: "Personal notes, team runbooks, org decisions. If it isn’t somewhere an agent can read it, the agent is guessing. Obsidian, for me and for the teams I work with.",
  },
  {
    title: "Workflows need a schema.",
    body: "Agents are only as consistent as the work they’re handed. Typed notes, templates, and defined handoffs beat clever one-off chains. Sauce is that idea, open-sourced.",
  },
];

export const repos: Repo[] = [
  {
    name: "willfell/sauce",
    href: "https://github.com/willfell/sauce",
    description:
      "Agentic operating loop for Obsidian: node-based agent execution, versioned vault platform, shipped via Homebrew",
    meta: ["JavaScript", "MIT"],
  },
  {
    name: "willfell/homebrew-sauce",
    href: "https://github.com/willfell/homebrew-sauce",
    description: "Brew up the sauce",
    meta: ["Ruby", "Homebrew tap"],
  },
  {
    name: "willfell/will-fell",
    href: siteRepoHref,
    description:
      "This site. Next.js and Terraform on S3 and CloudFront, deployed by GitHub Actions on every merge.",
    meta: ["TypeScript", "Terraform"],
  },
];

export const contact: Intro = {
  heading: "Working on something that needs to ship?",
  lede: "Platform, AI, customer-facing engineering, or a role that doesn’t have a name yet. If the hard part is getting it into people’s hands, I’d like to hear about it.",
};
```

- [ ] **Step 3: Section**

Replace `app/src/components/Layout/Section.tsx` with:

```tsx
import classNames from "classnames";
import { FC, memo, PropsWithChildren } from "react";

export type Band = "ink" | "pine";

// One band of the page: the ground colour spans the viewport, the content
// sits in the shared column. Bands with their own vertical rhythm pass
// innerClassName.
const Section: FC<
  PropsWithChildren<{
    sectionId: string;
    band?: Band;
    className?: string;
    innerClassName?: string;
  }>
> = memo(
  ({
    children,
    sectionId,
    band = "ink",
    className,
    innerClassName = "py-16 md:py-24 xl:py-[120px]",
  }) => (
    <section
      className={classNames(band === "pine" ? "bg-pine" : "bg-ink", className)}
      id={sectionId}
    >
      <div
        className={classNames(
          "mx-auto max-w-page px-5 md:px-8 xl:px-12",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  ),
);

Section.displayName = "Section";
export default Section;
```

- [ ] **Step 4: SectionHeader**

Create `app/src/components/Layout/SectionHeader.tsx`:

```tsx
import classNames from "classnames";
import { FC, memo, ReactNode } from "react";

import { Band } from "./Section";

// The numbered mono strip above every band after the hero: square, number,
// label, rule.
export const Eyebrow: FC<{ number: string; label: string; band?: Band }> =
  memo(({ number, label, band = "ink" }) => (
    <p className="flex items-center gap-3.5 font-mono text-xs uppercase tracking-[0.1em] text-muted">
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 bg-amber" />
      <span className="font-bold text-paper">{number}</span>
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={classNames(
          "h-px grow",
          band === "pine" ? "bg-line-pine-mid" : "bg-line-mid",
        )}
      />
    </p>
  ));

Eyebrow.displayName = "Eyebrow";

const SectionHeader: FC<{
  number: string;
  label: string;
  heading: string;
  lede?: string;
  action?: ReactNode;
  band?: Band;
}> = memo(({ number, label, heading, lede, action, band = "ink" }) => (
  <div className="flex flex-col gap-10">
    <Eyebrow band={band} label={label} number={number} />
    <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
      <h2 className="max-w-[16ch] text-[30px] font-[650] leading-[1.04] tracking-[-0.028em] [text-wrap:balance] md:text-[42px] xl:text-[50px]">
        {heading}
      </h2>
      {lede && (
        <p className="max-w-[46ch] text-[17px] leading-relaxed text-paper-2 [text-wrap:pretty]">
          {lede}
        </p>
      )}
      {action}
    </div>
  </div>
));

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
```

- [ ] **Step 5: Glyphs**

Create `app/src/components/Icon/Glyphs.tsx`:

```tsx
import classNames from "classnames";
import { FC, memo } from "react";

type GlyphProps = { className?: string };

// The four line glyphs on the page. Stroke only, so each takes the text
// colour of whatever it sits in.
export const DownloadGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0", className)}
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
  >
    <path
      d="M6 1.5V10M2.5 6.5 6 10l3.5-3.5"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.6"
    />
  </svg>
));
DownloadGlyph.displayName = "DownloadGlyph";

export const ExternalGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0", className)}
    fill="none"
    height="11"
    viewBox="0 0 12 12"
    width="11"
  >
    <path
      d="M3 9l6-6M4 3h5v5"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.5"
    />
  </svg>
));
ExternalGlyph.displayName = "ExternalGlyph";

export const FlowArrowGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0 text-muted", className)}
    fill="none"
    height="12"
    viewBox="0 0 22 12"
    width="22"
  >
    <path d="M0 6h19M14 1.5 19.5 6 14 10.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
));
FlowArrowGlyph.displayName = "FlowArrowGlyph";

export const PlusGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0", className)}
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
  >
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" />
  </svg>
));
PlusGlyph.displayName = "PlusGlyph";
```

- [ ] **Step 6: Nav**

Replace `app/src/components/Sections/Nav.tsx` with:

```tsx
import Link from "next/link";
import { FC, memo } from "react";

import { navLinks, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph } from "../Icon/Glyphs";

const Nav: FC = memo(() => (
  <header className="border-b border-line bg-ink">
    <nav
      aria-label="Site"
      className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-7 px-5 py-2 md:px-8 md:py-3.5 xl:px-12"
    >
      <Link className="flex min-h-[44px] items-center gap-3 text-paper" href="/">
        <span aria-hidden="true" className="h-3 w-3 shrink-0 bg-amber" />
        <span className="text-lg font-[750] tracking-[-0.01em] [font-stretch:115%]">
          Will Fellhoelter
        </span>
      </Link>
      <ul className="order-last flex w-full justify-between font-mono text-[13px] tracking-[0.02em] md:order-none md:ml-auto md:w-auto md:gap-x-7">
        {navLinks.map(({ href, text }) => (
          <li key={href}>
            <a className="flex min-h-[44px] items-center text-paper" href={href}>
              {text}
            </a>
          </li>
        ))}
      </ul>
      <a
        className="flex min-h-[44px] items-center gap-2 bg-amber px-4 font-mono text-[13px] font-bold tracking-[0.02em] text-ink"
        download=""
        href={resumeHref}
        onClick={() => trackEvent("Download Click", { file: "Resume" })}
      >
        Resume
        <DownloadGlyph />
      </a>
    </nav>
  </header>
));

Nav.displayName = "Nav";
export default Nav;
```

- [ ] **Step 7: Hero**

Replace `app/src/components/Sections/Hero.tsx` with:

```tsx
import Image from "next/image";
import { FC, memo } from "react";

import { heroData, heroLinks, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, ExternalGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";

const Hero: FC = memo(() => {
  const { headline, emphasis, lede, imageSrc, imageAlt, currently } = heroData;

  return (
    <Section
      className="bg-grid border-b border-line"
      innerClassName="py-12 md:py-20 xl:py-[104px]"
      sectionId="hero"
    >
      <div className="hero-enter flex flex-wrap items-center gap-x-[72px] gap-y-12">
        <div className="flex min-w-0 flex-[1_1_540px] flex-col gap-7">
          <h1 className="text-[38px] font-[650] leading-[1.03] tracking-[-0.03em] [text-wrap:balance] md:text-[56px] xl:text-[66px]">
            {`${headline} `}
            <span className="underline decoration-amber decoration-[0.14em] underline-offset-[0.12em]">
              {emphasis}
            </span>
          </h1>
          <p
            className="max-w-[58ch] text-[17px] leading-[1.55] text-paper-2 [text-wrap:pretty] md:text-lg xl:text-xl"
            data-lede=""
          >
            {lede}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <a
              className="inline-flex min-h-[52px] items-center gap-2.5 bg-amber px-6 text-base font-bold text-ink"
              download=""
              href={resumeHref}
              onClick={() => trackEvent("Hero CTA Click", { button: "Resume" })}
            >
              Download resume
              <DownloadGlyph />
            </a>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-sm">
              {heroLinks.map(({ href, text, external }) => (
                <li key={text}>
                  <a
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-paper underline decoration-1 underline-offset-[5px]"
                    href={href}
                    onClick={() => trackEvent("Hero CTA Click", { button: text })}
                    {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                  >
                    {text}
                    {external && <ExternalGlyph />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure className="flex min-w-0 flex-[0_1_380px] flex-col border border-line-mid bg-surface">
          <Image
            alt={imageAlt}
            className="aspect-[4/5] h-auto w-full border-b border-line-mid object-cover object-[50%_45%]"
            height={475}
            priority
            src={imageSrc}
            width={380}
          />
          <figcaption className="flex flex-col gap-3.5 px-5 pb-5 pt-[18px]">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Currently
            </span>
            {currently.map(({ lead, rest }, i) => (
              <span className="flex gap-3.5 text-[15px] leading-[1.45] text-paper-2" key={lead}>
                <span className="shrink-0 font-mono text-xs leading-[21px] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <b className="font-bold text-paper">{lead}</b> {rest}
                </span>
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
});

Hero.displayName = "Hero";
export default Hero;
```

- [ ] **Step 8: Glance**

Create `app/src/components/Sections/Glance.tsx`:

```tsx
import { FC, memo } from "react";

import { stats, statsCaption } from "../../data/data";
import Section from "../Layout/Section";

const Glance: FC = memo(() => (
  <Section
    className="border-b border-line"
    innerClassName="flex flex-col gap-4 pb-5"
    sectionId="glance"
  >
    <dl className="grid grid-cols-2 border-r border-line md:grid-cols-3 xl:grid-cols-5">
      {stats.map(({ value, label }) => (
        <div className="flex flex-col gap-3 border-l border-line px-5 pb-[30px] pt-7" key={label}>
          <dt className="order-2 font-mono text-[11.5px] uppercase leading-normal tracking-[0.06em] text-muted">
            {label}
          </dt>
          <dd className="order-1 text-[clamp(28px,8.75vw,34px)] font-bold leading-none tracking-[-0.03em] [font-stretch:125%] md:text-[44px] xl:text-[52px]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
    <p className="font-mono text-xs leading-normal text-muted">{statsCaption}</p>
  </Section>
));

Glance.displayName = "Glance";
export default Glance;
```

- [ ] **Step 9: HowIWork**

Create `app/src/components/Sections/HowIWork.tsx`:

```tsx
import { FC, memo } from "react";

import { howIWork } from "../../data/data";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";

const HowIWork: FC = memo(() => (
  <Section sectionId="how">
    <div className="flex flex-col gap-10">
      <SectionHeader
        heading={howIWork.heading}
        label="How I work"
        lede={howIWork.lede}
        number="01"
      />
      <ol className="grid grid-cols-1 border-r border-t border-r-line border-t-paper md:grid-cols-2 xl:grid-cols-4">
        {howIWork.steps.map(({ title, body, example }, i) => (
          <li className="flex flex-col gap-3.5 border-l border-line py-6 pl-5 pr-6" key={title}>
            <span className="font-mono text-xs text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl font-bold leading-[1.1] tracking-[-0.015em] [font-stretch:115%]">
              {title}
            </h3>
            <p className="text-base leading-relaxed text-paper-2 [text-wrap:pretty]">{body}</p>
            <p className="mt-auto border-t border-dashed border-line-mid pt-3 font-mono text-xs leading-relaxed text-muted">
              {example}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </Section>
));

HowIWork.displayName = "HowIWork";
export default HowIWork;
```

- [ ] **Step 10: Flow**

Create `app/src/components/Sections/Flow.tsx`:

```tsx
import classNames from "classnames";
import { FC, Fragment, memo } from "react";

import { FlowNode } from "../../data/dataDef";
import { FlowArrowGlyph } from "../Icon/Glyphs";

// Four boxes joined by arrows, read as one picture: the label is the whole
// sentence a screen reader gets.
const Flow: FC<{ label: string; nodes: FlowNode[] }> = memo(({ label, nodes }) => (
  <div
    aria-label={label}
    className="flex min-w-0 flex-[1.5_1_540px] flex-col gap-2.5 md:flex-row md:gap-x-2"
    role="img"
  >
    {nodes.map(({ title, detail, highlight }, i) => (
      <Fragment key={title}>
        {i > 0 && <FlowArrowGlyph className="rotate-90 self-center md:rotate-0" />}
        <div
          className={classNames(
            "flex flex-col gap-2 border p-3.5 md:min-h-[124px] md:flex-1",
            highlight ? "border-paper bg-paper text-ink" : "border-line-mid bg-ink",
          )}
        >
          <span className="text-base font-bold [font-stretch:110%]">{title}</span>
          <span
            className={classNames(
              "font-mono text-[11.5px] leading-normal",
              highlight ? "text-ink-2" : "text-muted",
            )}
          >
            {detail}
          </span>
        </div>
      </Fragment>
    ))}
  </div>
));

Flow.displayName = "Flow";
export default Flow;
```

- [ ] **Step 11: SelectedWork**

Replace `app/src/components/Sections/SelectedWork.tsx` with:

```tsx
import { FC, memo } from "react";

import { featuredWork, selectedWorkIntro, workItems } from "../../data/data";
import { WorkItem } from "../../data/dataDef";
import { trackEvent } from "../../utils/analytics";
import { ExternalGlyph, FlowArrowGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";
import Flow from "./Flow";

const contextClass = "font-mono text-xs uppercase tracking-[0.08em] text-muted";

const WorkCard: FC<WorkItem> = memo(
  ({ context, title, description, metric, install, href, hrefText, hrefLabel }) => (
    <article className="flex h-full flex-col gap-3.5 border border-line-mid p-7">
      <p className={contextClass}>{context}</p>
      <h3 className="text-[26px] font-[750] leading-[1.1] tracking-[-0.02em] [font-stretch:115%] [text-wrap:balance]">
        {title}
      </h3>
      <p className="text-[15.5px] leading-relaxed text-paper-2 [text-wrap:pretty]">
        {description}
      </p>
      {install && (
        <pre className="mt-auto flex flex-col overflow-x-auto border border-line bg-soot px-4 py-3.5 font-mono text-[12.5px] leading-[1.8] text-paper">
          {install.map((command) => (
            <code className="whitespace-nowrap" key={command}>
              <span className="select-none text-amber">$</span> {command}
            </code>
          ))}
        </pre>
      )}
      {metric && (
        <>
          <p className="mt-auto flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-t border-line pt-[18px] text-[30px] font-bold leading-[1.1] tracking-[-0.02em] [font-stretch:120%]">
            {metric.before && (
              <>
                <span className="text-muted line-through decoration-2">{metric.before}</span>
                <span className="sr-only">to</span>
                <FlowArrowGlyph className="self-center" />
              </>
            )}
            <span>{metric.value}</span>
          </p>
          <p className="font-mono text-xs text-muted">{metric.label}</p>
        </>
      )}
      {href && (
        <a
          aria-label={hrefLabel}
          className="inline-flex min-h-[44px] items-center gap-1.5 font-mono text-[13.5px] text-paper underline decoration-1 underline-offset-[5px]"
          href={href}
          onClick={() => trackEvent("Project Click", { project: title })}
          rel="noopener noreferrer"
          target="_blank"
        >
          {hrefText}
          <ExternalGlyph />
        </a>
      )}
    </article>
  ),
);

WorkCard.displayName = "WorkCard";

const SelectedWork: FC = memo(() => (
  <Section className="border-t border-line" sectionId="work">
    <div className="flex flex-col gap-10">
      <SectionHeader
        heading={selectedWorkIntro.heading}
        label="Selected work"
        lede={selectedWorkIntro.lede}
        number="02"
      />
      {featuredWork.map(({ context, title, description, flowLabel, flow }) => (
        <article
          className="flex flex-wrap items-center gap-x-14 gap-y-8 border border-line-mid bg-surface p-6 md:p-8 xl:p-10"
          key={title}
        >
          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5">
            <p className={contextClass}>{context}</p>
            <h3 className="text-[28px] font-[750] leading-[1.05] tracking-[-0.02em] [font-stretch:115%] [text-wrap:balance] md:text-[34px] xl:text-[38px]">
              {title}
            </h3>
            <p className="max-w-[52ch] text-[17px] leading-relaxed text-paper-2 [text-wrap:pretty]">
              {description}
            </p>
          </div>
          <Flow label={flowLabel} nodes={flow} />
        </article>
      ))}
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {workItems.map((item) => (
          <li key={item.title}>
            <WorkCard {...item} />
          </li>
        ))}
      </ul>
    </div>
  </Section>
));

SelectedWork.displayName = "SelectedWork";
export default SelectedWork;
```

- [ ] **Step 12: Roles**

Replace `app/src/components/Sections/Roles.tsx` with:

```tsx
import { FC, memo } from "react";

import { education, experienceHeading, resumeHref, roles } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, PlusGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";

const dateClass = "w-[180px] shrink-0 whitespace-nowrap font-mono text-[13px] text-muted";
const nameClass =
  "flex min-w-0 flex-[1_1_200px] flex-wrap items-baseline gap-x-3.5 gap-y-0.5";
const employerClass = "text-[21px] font-[750] tracking-[-0.015em] [font-stretch:115%]";

const Roles: FC = memo(() => (
  <Section className="border-t border-line" sectionId="experience">
    <div className="flex flex-col gap-10">
      <SectionHeader
        action={
          <a
            className="inline-flex min-h-[44px] items-center gap-2 font-mono text-sm text-paper underline decoration-1 underline-offset-[5px]"
            download=""
            href={resumeHref}
            onClick={() => trackEvent("Download Click", { file: "Resume" })}
          >
            Full resume, PDF
            <DownloadGlyph />
          </a>
        }
        heading={experienceHeading}
        label="Experience"
        number="03"
      />
      <ol className="border-t border-paper">
        {roles.map(({ dates, employer, title, line, bullets }) => (
          <li className="border-b border-line" key={`${employer}-${title}`}>
            <details
              className="group"
              onToggle={(e) =>
                e.currentTarget.open &&
                trackEvent("Role Expand", { role: `${employer} ${title}` })
              }
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-6 gap-y-2 py-[22px] [&::-webkit-details-marker]:hidden">
                <span className={dateClass}>{dates}</span>
                <span className={nameClass}>
                  <span className={employerClass}>{employer}</span>
                  <span className="text-[17px]">{title}</span>
                  <span className="basis-full text-[15px] leading-normal text-muted">
                    {line}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line-hi"
                >
                  <PlusGlyph className="transition-transform group-open:rotate-45 motion-reduce:transition-none" />
                </span>
              </summary>
              <div className="flex flex-wrap gap-x-6 pb-[26px]">
                <span aria-hidden="true" className="hidden w-[180px] shrink-0 md:block" />
                <ul className="flex min-w-0 flex-[1_1_200px] list-[square] flex-col gap-2 pl-[18px] text-[15.5px] leading-[1.55] text-paper-2 marker:text-muted">
                  {bullets.map((bullet) => (
                    <li className="pl-1 [text-wrap:pretty]" key={bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </li>
        ))}
        <li className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-[22px]">
          <span className={dateClass}>{education.year}</span>
          <span className={nameClass}>
            <span className={employerClass}>{education.school}</span>
            <span className="text-[17px]">{education.degree}</span>
          </span>
        </li>
      </ol>
    </div>
  </Section>
));

Roles.displayName = "Roles";
export default Roles;
```

- [ ] **Step 13: Positions**

Create `app/src/components/Sections/Positions.tsx`:

```tsx
import { FC, memo } from "react";

import { positions, positionsIntro } from "../../data/data";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";

const Positions: FC = memo(() => (
  <Section
    band="pine"
    className="border-t border-line"
    innerClassName="py-16 md:py-24 xl:pb-[88px] xl:pt-[120px]"
    sectionId="positions"
  >
    <div className="flex flex-col gap-10">
      <SectionHeader
        band="pine"
        heading={positionsIntro.heading}
        label="Positions"
        lede={positionsIntro.lede}
        number="04"
      />
      <ol className="grid grid-cols-1 gap-x-14 md:grid-cols-2">
        {positions.map(({ title, body }, i) => (
          <li className="flex gap-5 border-t border-line-pine py-[30px]" key={title}>
            <span className="shrink-0 pt-[9px] font-mono text-[13px] text-amber">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2.5">
              <h3 className="text-2xl font-bold leading-[1.12] tracking-[-0.02em] [font-stretch:112%] [text-wrap:balance] md:text-[28px] xl:text-[32px]">
                {title}
              </h3>
              <p className="text-[16.5px] leading-relaxed text-paper-2 [text-wrap:pretty]">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </Section>
));

Positions.displayName = "Positions";
export default Positions;
```

- [ ] **Step 14: GitHubActivity**

Create `app/src/components/Sections/GitHubActivity.tsx`:

```tsx
import classNames from "classnames";
import { FC, memo } from "react";

import { githubHref, repos } from "../../data/data";
import snapshot from "../../data/github-contributions.json";
import { trackEvent } from "../../utils/analytics";
import { ExternalGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import { Eyebrow } from "../Layout/SectionHeader";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVELS = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

// GitHub's own buckets are relative to the year's peak; fixed ones keep the
// picture honest across quiet and busy years.
const level = (count: number) =>
  count === 0 ? 0 : count < 10 ? 1 : count < 30 ? 2 : count < 70 ? 3 : 4;

const month = (date: string) => new Date(`${date}T00:00:00Z`).getUTCMonth();

// The snapshot starts on a Sunday, so every seven days is one column. A
// column is labelled when it starts a new month; the first never is.
const weeks = Array.from({ length: Math.ceil(snapshot.days.length / 7) }, (_, w) => {
  const days = snapshot.days.slice(w * 7, w * 7 + 7);
  const m = month(days[0].date);
  const label = w > 0 && m !== month(snapshot.days[(w - 1) * 7].date) ? MONTHS[m] : "";
  return { days, label };
});

const total = snapshot.total.toLocaleString("en-US");

const dayTitle = (date: string, count: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  const n = count === 0 ? "No" : count.toLocaleString("en-US");
  return `${n} contribution${count === 1 ? "" : "s"} on ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

const GitHubActivity: FC = memo(() => (
  <Section
    band="pine"
    innerClassName="flex flex-col gap-9 pb-16 pt-14 md:pb-24 md:pt-20 xl:pb-[120px] xl:pt-[88px]"
    sectionId="github"
  >
    <Eyebrow band="pine" label="GitHub" number="05" />
    <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
      <h2 className="flex flex-col gap-3">
        <span
          className="text-[64px] font-[750] leading-[0.88] tracking-[-0.045em] [font-stretch:125%] md:text-[104px] xl:text-[136px]"
          data-total=""
        >
          {total}
        </span>
        <span className="text-[19px] text-paper-2">contributions in the last year</span>
      </h2>
      <a
        className="inline-flex min-h-[48px] items-center gap-2 border border-paper px-5 font-mono text-sm text-paper"
        href={githubHref}
        onClick={() => trackEvent("Social Click", { platform: "GitHub" })}
        rel="noopener noreferrer"
        target="_blank"
      >
        github.com/willfell
        <ExternalGlyph />
      </a>
    </div>
    <figure className="flex flex-col gap-3.5">
      <div
        aria-label="Contribution heatmap, scrolls sideways"
        className="overflow-x-auto pb-1.5 [direction:rtl]"
        role="region"
        tabIndex={0}
      >
        <div
          aria-label={`Contribution heatmap for the last 12 months, one square per day, darker to brighter by activity: ${total} contributions in all`}
          className="flex w-full min-w-max justify-between gap-[3px] [direction:ltr]"
          role="img"
        >
          <div
            aria-hidden="true"
            className="sticky left-0 z-[1] flex shrink-0 flex-col gap-[3px] bg-pine pr-2 font-mono text-[11px] leading-[15px] text-muted"
          >
            <span className="h-4" />
            {WEEKDAYS.map((day, i) => (
              <span className="h-[15px]" key={i}>
                {day}
              </span>
            ))}
          </div>
          {weeks.map(({ days, label }, w) => (
            <div className="flex shrink-0 flex-col gap-[3px]" data-week={w} key={days[0].date}>
              <span className={classNames("h-4 w-[15px] whitespace-nowrap font-mono text-[11px] leading-4 text-muted", w === weeks.length - 1 && "[direction:rtl]")}>
                {label}
              </span>
              {days.map(({ date, count }) => (
                <span
                  className={classNames("h-[15px] w-[15px] rounded-[3px]", LEVELS[level(count)])}
                  data-day={date}
                  key={date}
                  title={dayTitle(date, count)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-xs text-muted">
        <span>Last 12 months on GitHub</span>
        <span aria-hidden="true" className="flex items-center gap-[5px]">
          Less
          {LEVELS.map((cls) => (
            <span className={classNames("h-[13px] w-[13px] rounded-sm", cls)} key={cls} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {repos.map(({ name, href, description, meta }) => (
        <li
          className="flex flex-col gap-2.5 border border-line-pine bg-surface-pine p-[22px]"
          key={name}
        >
          <a
            className="inline-flex min-h-[28px] items-center gap-1.5 font-mono text-[15px] font-semibold text-paper"
            href={href}
            onClick={() => trackEvent("Project Click", { project: name })}
            rel="noopener noreferrer"
            target="_blank"
          >
            {name}
            <ExternalGlyph />
          </a>
          <p className="text-[15px] leading-[1.55] text-paper-2">{description}</p>
          <p className="mt-auto flex gap-[18px] font-mono text-xs text-muted">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </p>
        </li>
      ))}
    </ul>
  </Section>
));

GitHubActivity.displayName = "GitHubActivity";
export default GitHubActivity;
```

- [ ] **Step 15: Contact**

Create `app/src/components/Sections/Contact.tsx`:

```tsx
import { FC, memo, useEffect, useRef, useState } from "react";

import { contact, contactEmail, githubHref, linkedInHref, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, ExternalGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";

const links = [
  { href: linkedInHref, text: "LinkedIn" },
  { href: githubHref, text: "GitHub" },
];

const Contact: FC = memo(() => {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const resetTimer = useRef<number>();
  const [emailUser, emailDomain] = contactEmail.split("@");

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  // When the clipboard is refused, leave the address selected so one
  // keystroke copies it.
  const selectEmail = () => {
    const el = emailRef.current;
    const selection = window.getSelection();
    if (!el || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const copyEmail = async () => {
    trackEvent("Email Click");
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      selectEmail();
    }
  };

  return (
    <Section
      band="pine"
      className="border-t border-line-pine"
      innerClassName="flex flex-wrap items-end justify-between gap-x-[72px] gap-y-10 py-16 md:py-24 xl:py-[120px]"
      sectionId="contact"
    >
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5">
        <h2 className="max-w-[14ch] text-4xl font-[650] leading-none tracking-[-0.035em] [text-wrap:balance] md:text-[56px] xl:text-[70px]">
          {contact.heading}
        </h2>
        <p className="max-w-[48ch] text-lg leading-relaxed text-paper-2 [text-wrap:pretty]">
          {contact.lede}
        </p>
      </div>
      <div className="flex min-w-0 flex-[0_1_420px] flex-col gap-3">
        <a
          className="flex min-h-[56px] items-center justify-between gap-2.5 bg-amber px-[22px] text-[17px] font-bold text-ink"
          download=""
          href={resumeHref}
          onClick={() => trackEvent("Download Click", { file: "Resume" })}
        >
          Download resume
          <DownloadGlyph className="h-[13px] w-[13px]" />
        </a>
        <div className="flex border border-muted">
          <a
            className="flex min-h-[52px] min-w-0 grow items-center px-[18px] py-2.5 font-mono text-sm text-paper"
            href={`mailto:${contactEmail}`}
            onClick={() => trackEvent("Email Click")}
            ref={emailRef}
          >
            <span>{emailUser}@<wbr />{emailDomain}</span>
          </a>
          <button
            aria-label="Copy email address"
            className="min-h-[52px] min-w-[92px] shrink-0 border-l border-muted px-4 font-mono text-[13px] text-paper"
            onClick={copyEmail}
            type="button"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <span className="sr-only" role="status">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
        <ul className="flex gap-3">
          {links.map(({ href, text }) => (
            <li className="flex-1" key={text}>
              <a
                className="flex min-h-[48px] items-center justify-center gap-2 border border-line-pine-mid font-mono text-[13.5px] text-paper"
                href={href}
                onClick={() => trackEvent("Social Click", { platform: text })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {text}
                <ExternalGlyph />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
});

Contact.displayName = "Contact";
export default Contact;
```

- [ ] **Step 16: Footer**

Replace `app/src/components/Sections/Footer.tsx` with:

```tsx
import { FC, memo } from "react";

import { siteRepoHref, stravaHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";

const Footer: FC = memo(() => (
  <footer className="border-t border-line-soot bg-soot text-muted">
    <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-[18px] font-mono text-xs md:px-8 xl:px-12">
      <p>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Will
        Fellhoelter · Denver, Colorado
      </p>
      <ul className="flex gap-6">
        <li>
          <a
            className="flex min-h-[44px] items-center"
            href={stravaHref}
            onClick={() => trackEvent("Social Click", { platform: "Strava" })}
            rel="noopener noreferrer"
            target="_blank"
          >
            Strava
          </a>
        </li>
        <li>
          <a
            className="flex min-h-[44px] items-center"
            href={siteRepoHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Site source
          </a>
        </li>
      </ul>
    </div>
  </footer>
));

Footer.displayName = "Footer";
export default Footer;
```

- [ ] **Step 17: The page and the deletions**

Replace `app/src/pages/index.tsx` with:

```tsx
import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import Contact from "../components/Sections/Contact";
import Footer from "../components/Sections/Footer";
import GitHubActivity from "../components/Sections/GitHubActivity";
import Glance from "../components/Sections/Glance";
import Hero from "../components/Sections/Hero";
import HowIWork from "../components/Sections/HowIWork";
import Nav from "../components/Sections/Nav";
import Positions from "../components/Sections/Positions";
import Roles from "../components/Sections/Roles";
import SelectedWork from "../components/Sections/SelectedWork";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
      <Glance />
      <HowIWork />
      <SelectedWork />
      <Roles />
      <Positions />
      <GitHubActivity />
      <Contact />
    </main>
    <Footer />
  </Page>
));

Home.displayName = "Home";
export default Home;
```

Then delete the files nothing imports any more:

```bash
git rm app/src/components/Sections/About.tsx app/src/components/Icon/Icon.tsx app/src/components/Icon/GithubIcon.tsx app/src/components/Icon/LinkedInIcon.tsx app/src/components/Icon/StravaIcon.tsx
```

- [ ] **Step 18: Compile, lint, validate images**

Run from `app/`:

```bash
yarn compile && yarn lint:check && yarn images:validate
```

Expected: tsc finishes with no errors; eslint prints nothing; the validator reports `Valid references: 1`, `Broken references: 0`, `Orphaned images: 0`, `Validation PASSED`.

- [ ] **Step 19: Build and run the gate**

Run from `app/`:

```bash
yarn build && yarn copy-resume
```

Expected: `github:fetch unchanged …` (or `wrote …` if GitHub's counts moved since Task 2; then `git add app/src/data/github-contributions.json` joins the commit), then `next build` completes with `Route (pages) /`. Then from the repo root:

```bash
npm run site:verify
```

Expected: one line like `height 7xxxpx, 1xxx words in <main>, 1x distinct links, screenshots in app/.screenshots/` then `PASS`. Any `FAIL` line names the gate; fix the component it points at and rerun.

- [ ] **Step 20: Commit**

```bash
git add app/src app/package.json
git commit -m "site: rebuild the page as the dark Field Manual

One page, eight bands: hero with the Currently card, five numbers with
a team caption, how Will works, two featured pieces with a flow diagram
plus four work cards, roles that expand to their bullets, four
positions, the GitHub calendar from the committed snapshot, and
contact. Every sentence lives in data.tsx, transcribed from the design
canvas; Kubernetes reads K8s throughout, and the Accuris role gains the
New Relic and PagerDuty MCP servers, the incident plugin, and the K8s
operator rollout with the platform team.

The old About section and the three social icon components go; every
social link is now text.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 5: README and the full gate run

Executed 2026-09-30 as two commits: `site: close the review follow-ups on the snapshot script and contact` (the script, Contact, stylelint, .gitignore, a snapshot whose only change was `fetchedAt`) and `docs: describe the Field Manual page and its gates` (README and the three docs). Task 2's code block above was re-synced from the repo afterwards and already contains follow-ups (a) to (d) below; a third commit, `site: final review follow-ups`, then applied the whole-branch review's minors (fatal paths log as errors, `describe()` tolerates non-Error values, the heatmap scroll box is a named focusable region, and the README and spec describe all three motions).

**Files:**
- Modify: `README.md`
- Modify: `.gitignore` (add `app/src/data/github-contributions.json.tmp`, the fetch script's atomic-write scratch file, so an interrupted run never leaves an untracked file to commit by accident)
- Modify: `app/src/components/Sections/Contact.tsx` (clear the reset timer right before arming a new one)
- Modify: `app/src/data/github-contributions.json` only if the gate runs refreshed it
- Commit: the three untracked docs (`docs/linkedin-updates-2026-09-29.md`, this plan, the spec)
- Modify: `app/stylelint.config.js`: add `"function-no-unknown": [true, { ignoreFunctions: ["theme"] }]` to `rules`, so Tailwind's build-time `theme()` calls in `globalStyles.scss` stop reading as unknown functions (stylelint is not wired to any gate, but `npx stylelint src/globalStyles.scss` should be clean).
- Modify: `app/scripts/github/fetch-contributions.js`, four small follow-ups from the Task 2 review, each a few lines: (a) in `write()`, wrap the two statements in `try { … } finally { fs.rmSync(tmp, { force: true }); }` so a failed rename never leaves the scratch file; (b) in `warn()`, escape the annotation text for GitHub Actions with `.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A")` before prefixing `::warning title=github:fetch::`; (c) in the `GITHUB_CONTRIBUTIONS_SKIP === "1"` branch, `process.exit(1)` after the warnings when `existing.problems.length` is non-zero, matching the fetch-failure rule that an unusable fallback fails the build; (d) in both failure messages, append the underlying cause when Node provides one: `const reason = error.cause?.code || error.cause?.message; … ${error.message}${reason ? ` (${reason})` : ""}` so `fetch failed` becomes `fetch failed (ENOTFOUND)`. After editing: `yarn lint:check`, `yarn github:fetch --check`, and rerun Task 2's Step 4 commands (404, SKIP=1, SKIP=1 with a corrupted file now exits 1) before committing with the README change.

- [ ] **Step 1: Describe the page and the snapshot**

In `README.md`, replace the `## Features` list with:

```markdown
## Features

- One dark page: hero, numbers, how Will works, selected work, roles that expand to their resume bullets, positions, GitHub activity, contact
- GitHub contribution calendar fetched at build time from the public profile into `app/src/data/github-contributions.json` (`yarn github:fetch`); the committed snapshot is the fallback whenever GitHub is unreachable. The window slides daily, so `yarn build` rewrites that file whenever the calendar moved: commit it to refresh the fallback, or `git checkout -- app/src/data/github-contributions.json` to drop it. The deploy can skip the fetch by passing `build_env: GITHUB_CONTRIBUTIONS_SKIP=1` to the shared workflow
- Resume download (the PDF is produced outside the repo; commit it to both `app/public/` and `app/src/assets/`)
- Static export, responsive; the only motion is a hero fade, smooth anchor scrolling and the roles' plus turning, all off under reduced motion
- Deployed by GitHub Actions on every merge to `main`
```

And replace the two paragraphs under `## Verification` with:

```markdown
From `app/`: `yarn images:validate && yarn github:fetch --check && yarn build && yarn copy-resume`. `yarn build` refreshes the GitHub snapshot first (skip it offline with `GITHUB_CONTRIBUTIONS_SKIP=1`), then type-checks and runs `yarn lint:check` (eslint without `--fix`) before `next build`, so CI's build step is also the lint gate; `yarn lint` is the autofixing variant for local use.
From the repo root: `npm run site:verify` renders `app/out/` in Playwright and checks page height, word count, required links, fonts, contrast, the roles, the GitHub band against the snapshot, dead routes and the resume checksum. Screenshots land in `app/.screenshots/`.
```

- [ ] **Step 2: Run every gate once more, in the order CI does**

Run from `app/`:

```bash
yarn images:validate && yarn github:fetch --check && yarn build && yarn copy-resume
```

Expected: `Validation PASSED`, `PASS 36x days …` (365 to 371 depending on the weekday), a clean `next build`. Then from the repo root:

```bash
npm run site:verify && ls app/.screenshots
```

Expected: `PASS` and `home-1280.png home-390.png`.

- [ ] **Step 3: Look at the screenshots**

Open `app/.screenshots/home-1280.png` and `app/.screenshots/home-390.png` (the Read tool shows images). Check against the artboard: dark ground, amber squares and buttons, the photo card, five numbers in one row at 1280 and two columns at 390, the two flow cards, roles closed, the heatmap starting at the right edge on the phone. Fix anything that differs and rerun Step 2.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: describe the Field Manual page and its gates

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: The pull request

**Files:** none changed.

- [ ] **Step 1: Ask Will before anything leaves the machine**

Report the gate output from Task 5 and ask two things: whether to push and open the PR, and whether he has enabled "Include private contributions on my profile" on GitHub (Settings → Public profile → Contributions & activity). If he has not, the first deploy shows the public count (about 5,000) until the next build after he flips it; that is fine to ship, but he should know. Wait for his answer.

- [ ] **Step 2: Push and open the PR**

Only after a yes:

```bash
git push -u origin claude/personal-website-redesign-8e0916
gh pr create --base main --head claude/personal-website-redesign-8e0916 --title "site: the Field Manual, dark" --body-file - <<'EOF'
## What

willfellhoelter.com becomes the dark "Field Manual" page from `docs/superpowers/specs/2026-09-29-field-manual-redesign.md`: hero with the Currently card, five numbers with a team caption, how Will works, two featured pieces with a flow diagram plus four work cards, roles that expand to their bullets, four positions, the GitHub contribution calendar, and contact.

## Why

The 2026-09-28 page said one thing well and buried the rest: the numbers sat inside one paragraph, GitHub was a footer icon, and nothing on the page argued for anything. This one leads with listening, credits the teams behind the numbers, and shows the New Relic and PagerDuty MCP servers, the incident plugin, and the K8s operator rollout.

## How

- Every sentence lives in `app/src/data/data.tsx`; Kubernetes reads K8s throughout; the copy rules from the content-ownership doc hold and `scripts/verify-site.js` pins them.
- `yarn build` now starts with `yarn github:fetch`, which reads the public calendar into a committed snapshot and keeps the snapshot on any failure, so neither shared workflow changes and no token is needed.
- Tailwind tokens for the dark palette; Archivo and JetBrains Mono replace Inter and Fira Code.

## Verification

`yarn compile`, `yarn lint:check`, `yarn images:validate`, `yarn github:fetch --check`, `yarn build && yarn copy-resume`, `npm run site:verify` all pass locally. Screenshots at 1280 and 390 are in `app/.screenshots/` (drag them into this description on GitHub).

## Follow-ups

- `docs/linkedin-updates-2026-09-29.md`: the three Accuris lines and the K8s wording for LinkedIn and the resume PDF.
- GitHub's "Include private contributions on my profile" setting makes the calendar show the full count on the next build.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
```

- [ ] **Step 3: Watch CI**

Run:

```bash
gh pr checks --watch
```

Expected: `validate-build` and `lint` both pass. The `validate-build` job runs `yarn install`, `yarn images:validate`, `yarn build` on the `will-fell` runner; the build's `github:fetch` step needs outbound HTTPS to github.com from that runner, which the checkout step already proves.
