# Site Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five-page portfolio with one page of about three screens (hero, About, three selected works, one line per role, footer as contact), delete everything else, and keep the resume PDF Will supplied as the served download.

**Architecture:** Next.js 14 static export (`output: "export"`) with `data.tsx` as the only content file. The home page is `Page > Nav, main(Hero, About, SelectedWork, Roles), Footer`, six small components under `src/components/Sections/`. A Playwright script at the repo root renders `app/out/` and asserts the spec's gates (height, words, links, no scroll-animation classes, dead routes gone, PDF checksum); it is the failing test at the start and the passing test at the end.

**Tech Stack:** Next.js 14, React 18, TypeScript 5.3, Tailwind 3, Sass, Yarn 1 (invoke as `npx yarn@1` — there is no `yarn` on PATH), Node 26, Playwright (root devDependency, browsers already cached).

**Spec:** `docs/superpowers/specs/2026-09-28-site-simplify-design.md`

## Global Constraints

- Every `yarn` command runs from `app/` as `npx -y yarn@1 <script>`. The root `package.json` has its own scripts (`site:verify`) run with `npm run` from the repo root.
- In this worktree session the `rtk` shell hook wraps `git` and the worktree guard refuses the wrapped form. If `git …` is refused, run the identical command as `/usr/bin/git …` from the worktree root `/Users/willfell/Documents/GitHub/will-fell/.claude/worktrees/site-simplify`.
- `app/src/data/data.tsx` is the only content file. No copy lives in a component.
- Copy is verbatim from the spec. Two wording rules never bend: "operations for 100+ microservices" (never "run"), "helping map out … CI/CD across 1,000+ repos" (never a solo claim). The Sauce description is the existing `portfolioItems[0].description` text, unchanged.
- Colour tokens: `cream #F7F4EE` (new), `stone-black #2A2A2A`, `forest-green #5E6746`, `sage-green #7D8A69`, `earth-tan #DBBB9C`, `canyon-tan #E4D5B7`, `deep-forest #3A4428`. No gradients, overlays, shadows, `hover:scale`, or underline-bar decorations.
- Motion budget: one CSS fade-and-rise on the hero at load (500ms), disabled under `prefers-reduced-motion`. No `opacity-0`, `animate-on-scroll`, `animate-on-load`, `framer-motion`.
- Gates (all must pass before the PR opens): `yarn compile`, `yarn lint`, `yarn images:validate`, `yarn build`, `npm run site:verify` (height ≤ 2,600px at 1280 wide, `<main>` ≤ 400 words, six required links, no dead routes in `out/`, no animation classes, no horizontal overflow at 390px, PDF sha256 `ee0c9243f632798e01287555ce940188ed21459eebd4c26bd81eb6a45fb144ef`).
- Commit messages end with the attribution block from the session (`Co-Authored-By` and `Claude-Session` lines). No comments in YAML/JSON/HCL config files.
- One deliberate deviation from the spec's token table, for contrast: muted text on cream and on canyon-tan uses Tailwind `stone-600` instead of `sage-green` (`#7D8A69` on `#F7F4EE` is 3.3:1, below AA for small text). `sage-green` is not used for text anywhere. Footer secondary text is `earth-tan/80` on `deep-forest` for the same reason.

## Review Focus

1. **A visitor with a narrow phone (320–390px).** No band may scroll sideways; the nav wraps to two lines rather than overflowing. Pinned by the `scrollWidth ≤ 390` assertion in `scripts/verify-site.js` (Task 1) and by the phone screenshot.
2. **A visitor who has `prefers-reduced-motion` on, or JavaScript off.** The hero must be fully visible at rest. Pinned by the `.hero-enter` reduced-motion rule (Task 3) and the "no `opacity-0`" assertion (Task 1), which runs against the static HTML before hydration.
3. **A visitor whose browser refuses `navigator.clipboard`** (older desktop apps, some in-app browsers). The copy button must not throw or show "copied"; the address must remain a selectable `mailto:` link. Pinned by the try/catch in `Footer.tsx` (Task 6) and the `select-all` class on the address.
4. **The deploy's postbuild step overwriting the PDF.** `yarn copy-resume` copies `src/assets/` over `public/`; if only one copy were updated the live PDF would silently be the old one. Pinned by the checksum assertion in `verify-site.js`, which runs after `yarn build && yarn copy-resume` (Task 1, Task 9).
5. **Someone running `npm run resume:build` later and clobbering the supplied PDF with the stale HTML render.** Pinned by deleting `resume/` and the script (Task 8); `npm run resume:build` then fails with "missing script".

---

### Task 1: Verification script (the failing test)

**Files:**
- Create: `scripts/verify-site.js`
- Modify: `package.json` (root)
- Modify: `.gitignore` (root, add `app/.screenshots/`)

**Interfaces:**
- Produces: `npm run site:verify`, exit 0 on pass, exit 1 with `FAIL …` lines on stderr otherwise. Writes `app/.screenshots/home-1280.png` and `home-390.png`.

- [ ] **Step 1: Write the script**

Create `scripts/verify-site.js`:

```js
#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "app", "out");
const SHOTS = path.join(ROOT, "app", ".screenshots");
const MAX_HEIGHT = 2600;
const MAX_WORDS = 400;
const PHONE_WIDTH = 390;
const PDF_SHA256 =
  "ee0c9243f632798e01287555ce940188ed21459eebd4c26bd81eb6a45fb144ef";
const REQUIRED_LINKS = [
  "/WillFellhoelterResume.pdf",
  "https://github.com/willfell",
  "https://linkedin.com/in/will-fellhoelter-1aa17312b",
  "https://www.strava.com/athletes/112909908",
  "https://github.com/willfell/sauce",
  "https://github.com/willfell/will-fell",
];
const DEAD_ROUTES = ["education", "site-info", "info", "contact"];
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

const failures = [];
function check(ok, message) {
  if (!ok) failures.push(message);
}

// Serves app/out over HTTP so /_next/* asset paths resolve the way they do on S3.
function serve(dir) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(dir, url);
    if (url.endsWith("/")) file = path.join(file, "index.html");
    if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () =>
      resolve({ server, origin: `http://127.0.0.1:${server.address().port}` }),
    );
  });
}

async function main() {
  check(
    fs.existsSync(path.join(OUT, "index.html")),
    "app/out/index.html missing; run `yarn build` in app/ first",
  );
  for (const route of DEAD_ROUTES) {
    check(
      !fs.existsSync(path.join(OUT, route)),
      `out/${route}/ is still exported`,
    );
  }
  const pdf = path.join(OUT, "WillFellhoelterResume.pdf");
  check(fs.existsSync(pdf), "out/WillFellhoelterResume.pdf missing; run `yarn copy-resume`");
  if (fs.existsSync(pdf)) {
    const sha = crypto.createHash("sha256").update(fs.readFileSync(pdf)).digest("hex");
    check(sha === PDF_SHA256, `resume sha256 ${sha} is not the supplied PDF`);
  }
  if (failures.length) return;

  const { server, origin } = await serve(OUT);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${origin}/`, { waitUntil: "networkidle" });

    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    check(height <= MAX_HEIGHT, `page height ${height}px exceeds ${MAX_HEIGHT}px`);

    const words = await page.evaluate(() => {
      const main = document.querySelector("main");
      return main ? main.innerText.trim().split(/\s+/).filter(Boolean).length : -1;
    });
    check(words >= 0, "no <main> element on the page");
    check(words <= MAX_WORDS, `<main> has ${words} words, limit ${MAX_WORDS}`);

    const animated = await page.evaluate(
      () => document.querySelectorAll('[class*="opacity-0"],[class*="animate-on-"]').length,
    );
    check(animated === 0, `${animated} elements still carry opacity-0 or animate-on-* classes`);

    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")),
    );
    for (const link of REQUIRED_LINKS) {
      check(hrefs.some((h) => h && h.startsWith(link)), `missing link ${link}`);
    }

    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, "home-1280.png"), fullPage: true });

    const phone = await browser.newPage({ viewport: { width: PHONE_WIDTH, height: 844 } });
    await phone.goto(`${origin}/`, { waitUntil: "networkidle" });
    const scrollWidth = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(scrollWidth <= PHONE_WIDTH, `horizontal overflow at ${PHONE_WIDTH}px: scrollWidth ${scrollWidth}`);
    await phone.screenshot({ path: path.join(SHOTS, "home-390.png"), fullPage: true });

    console.log(`height ${height}px, ${words} words in <main>, ${hrefs.length} links, screenshots in app/.screenshots/`);
  } finally {
    await browser.close();
    server.close();
  }
}

main()
  .catch((error) => failures.push(String(error && error.stack ? error.stack : error)))
  .finally(() => {
    if (failures.length) {
      for (const f of failures) console.error(`FAIL ${f}`);
      process.exit(1);
    }
    console.log("PASS");
  });
```

- [ ] **Step 2: Wire the script and ignore the screenshots**

Replace root `package.json` with:

```json
{
  "name": "will-fell",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "site:verify": "node scripts/verify-site.js"
  },
  "devDependencies": {
    "playwright": "^1.55.0"
  }
}
```

(`resume:build` is removed here; the `resume/` directory itself goes in Task 8.)

Append to root `.gitignore`, after the `app/public/images/_archive/` line:

```
app/.screenshots/
```

Run: `npm install` (root) so `node_modules/playwright` exists. Playwright browsers are already cached under `~/Library/Caches/ms-playwright`; if `chromium.launch()` complains, run `npx playwright install chromium`.

- [ ] **Step 3: Run it against the current site to verify it fails**

Run from `app/`: `npx -y yarn@1 build && npx -y yarn@1 copy-resume`
Run from root: `npm run site:verify`
Expected: exit 1 with at least `FAIL out/education/ is still exported`, `FAIL out/site-info/ is still exported`, `FAIL out/info/ is still exported`, `FAIL out/contact/ is still exported`. (Because those fail before the browser launches, the height failure is not reached yet; that is fine.)

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-site.js package.json package-lock.json .gitignore
git commit -m "test: add the site verification gate from the simplification spec"
```

---

### Task 2: Delete the extra pages and everything only they used

**Files:**
- Delete: `app/src/pages/education.tsx`, `app/src/pages/site-info.tsx`, `app/src/pages/info.tsx`, `app/src/pages/contact.tsx`, `app/src/pages/api/.gitkeep`
- Delete: `app/src/components/EducationPage.tsx`, `InfoPage.tsx`, `ContactPage.tsx`, `MePage.tsx`, `ImageGallery.tsx`, `.gitkeep`
- Delete: `app/src/components/Sections/Contact/ContactForm.tsx`, `Sections/Contact/index.tsx`, `Sections/Testimonials.tsx`
- Delete: `app/src/components/Icon/DribbbleIcon.tsx`, `FacebookIcon.tsx`, `TwitterIcon.tsx`, `InstagramIcon.tsx`, `StackOverflowIcon.tsx`, `QuoteIcon.tsx`, `HobbyIcon.tsx`, `HobbyIcons.tsx`
- Delete: `app/src/data/lifeData.tsx`, `app/src/hooks/useInterval.ts`, `useWindow.ts`, `app/src/utils/fileUtils.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a tree where `index.tsx` is the only page and `yarn compile` still passes.

- [ ] **Step 1: Delete the files**

From `app/`:

```bash
git rm -q src/pages/education.tsx src/pages/site-info.tsx src/pages/info.tsx src/pages/contact.tsx src/pages/api/.gitkeep \
  src/components/EducationPage.tsx src/components/InfoPage.tsx src/components/ContactPage.tsx src/components/MePage.tsx src/components/ImageGallery.tsx src/components/.gitkeep \
  src/components/Sections/Contact/ContactForm.tsx src/components/Sections/Contact/index.tsx src/components/Sections/Testimonials.tsx \
  src/components/Icon/DribbbleIcon.tsx src/components/Icon/FacebookIcon.tsx src/components/Icon/TwitterIcon.tsx src/components/Icon/InstagramIcon.tsx src/components/Icon/StackOverflowIcon.tsx src/components/Icon/QuoteIcon.tsx src/components/Icon/HobbyIcon.tsx src/components/Icon/HobbyIcons.tsx \
  src/data/lifeData.tsx src/hooks/useInterval.ts src/hooks/useWindow.ts src/utils/fileUtils.ts
```

`useDetectOutsideClick.ts` stays for now: `ProjectDetailModal` still imports it, and both go in Task 3.

- [ ] **Step 2: Confirm nothing else imported them**

Run from `app/`: `grep -rn "EducationPage\|InfoPage\|ContactPage\|MePage\|ImageGallery\|lifeData\|Testimonials\|HobbyIcon\|QuoteIcon\|useInterval\|useWindow\|fileUtils\|Sections/Contact" src`
Expected: no output.

- [ ] **Step 3: Type-check**

Run from `app/`: `npx -y yarn@1 compile`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git commit -m "site: remove the education, site-info, contact and me pages"
```

---

### Task 3: Reset the foundation: data shape, styles, app shell, dependencies

This task tears out the old sections and leaves a page that builds but renders only the `<head>` and an empty `<main>`. Tasks 4–6 fill it.

**Files:**
- Rewrite: `app/src/data/dataDef.ts`, `app/src/data/data.tsx`
- Rewrite: `app/src/pages/index.tsx`, `app/src/pages/_app.tsx`, `app/src/globalStyles.scss`, `app/tailwind.config.js`
- Modify: `app/src/components/Layout/Section.tsx`, `app/src/components/Icon/Icon.tsx`, `app/src/components/Icon/StravaIcon.tsx`, `app/src/pages/_document.tsx`, `app/package.json`
- Delete: `app/src/components/Sections/Hero.tsx`, `About.tsx`, `Header.tsx`, `SideNav.tsx`, `Footer.tsx`, `Portfolio.tsx`, `PortfolioCard/index.tsx`, `ProjectDetailModal/index.tsx`, `Experience/ExperienceSection.tsx`, `Experience/SkillGroup.tsx`, `Experience/Skills.tsx`, `Experience/TimelineItem.tsx`, `Experience/index.tsx`, `app/src/components/Socials.tsx`, `app/src/hooks/useIntersectionObserver.ts`, `app/src/hooks/useNavObserver.tsx`, `app/src/utils/animationUtils.ts`, `app/src/utils/skillAnimations.js`

**Interfaces:**
- Produces, from `src/data/data.tsx`: `homePageMeta: HomepageMeta`, `resumeHref: string`, `heroData: Hero`, `aboutData: About`, `selectedWork: SelectedWorkItem[]`, `roles: Role[]`, `socialLinks: Social[]`, `contactEmail: string`.
- Produces, from `src/data/dataDef.ts`: the interfaces below.
- Produces: `Section` now takes `sectionId: string`.
- Produces: Tailwind colour `cream`; CSS class `hero-enter`.

- [ ] **Step 1: Delete the old sections and their helpers**

From `app/`:

```bash
git rm -q -r src/components/Sections/Hero.tsx src/components/Sections/About.tsx src/components/Sections/Header.tsx src/components/Sections/SideNav.tsx src/components/Sections/Footer.tsx src/components/Sections/Portfolio.tsx src/components/Sections/PortfolioCard src/components/Sections/ProjectDetailModal src/components/Sections/Experience src/components/Socials.tsx src/hooks/useIntersectionObserver.ts src/hooks/useNavObserver.tsx src/utils/animationUtils.ts src/utils/skillAnimations.js
git rm -q src/hooks/useDetectOutsideClick.ts
```

- [ ] **Step 2: Write `src/data/dataDef.ts`**

```ts
import { FC } from "react";

import { IconProps } from "../components/Icon/Icon";

export interface HomepageMeta {
  title: string;
  description: string;
}

export interface HeroAction {
  href: string;
  text: string;
  primary?: boolean;
  download?: boolean;
}

export interface Hero {
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  actions: HeroAction[];
}

export interface About {
  description: string;
}

export interface SelectedWorkItem {
  title: string;
  context: string;
  description: string;
  href?: string;
}

export interface Role {
  dates: string;
  employer: string;
  title: string;
  line: string;
}

export interface Social {
  label: string;
  href: string;
  Icon: FC<IconProps>;
}
```

- [ ] **Step 3: Write `src/data/data.tsx`**

```tsx
import GithubIcon from "../components/Icon/GithubIcon";
import LinkedInIcon from "../components/Icon/LinkedInIcon";
import StravaIcon from "../components/Icon/StravaIcon";
import { getImageUrl } from "../utils/imageUrl";
import {
  About,
  Hero,
  HomepageMeta,
  Role,
  SelectedWorkItem,
  Social,
} from "./dataDef";

export const homePageMeta: HomepageMeta = {
  title: "Will Fellhoelter - Principal Software Engineer",
  description:
    "Portfolio for Will Fellhoelter, Principal Software Engineer. Eight years across the stack, lately agentic AI infrastructure, MCP, and Kubernetes at scale.",
};

export const resumeHref = "/WillFellhoelterResume.pdf";

export const contactEmail = "willfellhoelter@gmail.com";

export const heroData: Hero = {
  name: "Will Fellhoelter",
  description:
    "Principal Software Engineer in Denver. Eight years across the stack, from data and application code to the Kubernetes underneath. Lately that points at agentic AI infrastructure at scale.",
  imageSrc: getImageUrl("/images/about/profilepic.jpg"),
  imageAlt: "Will Fellhoelter",
  actions: [
    { href: resumeHref, text: "Resume ↓", primary: true, download: true },
    { href: "https://github.com/willfell", text: "GitHub" },
    { href: "https://linkedin.com/in/will-fellhoelter-1aa17312b", text: "LinkedIn" },
  ],
};

export const aboutData: About = {
  description:
    "I usually end up wherever the gap is between what a client needs and what actually ships: data, application logic, deploys, the Kubernetes underneath, the alerting on top. At Accuris that means the MCP mesh connecting 250+ tools to every team, operations for 100+ microservices across 6 regions, a few services of my own the wider org depends on, and helping map out the work standardizing CI/CD across 1,000+ repos. Before that, first engineering hire at an AI startup, working with founders and enterprise clients. Wichita State, MIS, 2018. Open to forward deployed and platform roles.",
};

export const selectedWork: SelectedWorkItem[] = [
  {
    title: "MCP mesh",
    context: "Accuris · 2025–2026",
    description:
      "Governed agent tooling for the whole org: 250+ tools behind one gateway, SSO, central observability. Built the first internal MCP servers and the plugin library, then the mesh every team uses.",
  },
  {
    title: "Sauce",
    context: "Open source · 2026–",
    description:
      "An agentic operating loop for Obsidian. Notes become node-based work graphs that agents like Claude Code and Codex execute in isolated workers, with scheduling, retries, handoffs between agents, and a persistent task store. Started as a loop-based forward deployment mechanism, rebuilt around graphs. Versioned vault platform shipped via Homebrew, MIT.",
    href: "https://github.com/willfell/sauce",
  },
  {
    title: "Ephemeral environments, three times",
    context: "Cerner · Lendflow · Project Canary",
    description:
      "Self-service test environments with data seeding and automatic cleanup, built for three different orgs: an AWX portal at Cerner, ephemeral infrastructure for dev and QA at Lendflow, a UI with branch and data-source selection at Project Canary. The problem I keep getting handed.",
  },
];

export const roles: Role[] = [
  {
    dates: "Mar 2026 – now",
    employer: "Accuris",
    title: "Principal Software Engineer",
    line: "MCP mesh, multi-region Kubernetes",
  },
  {
    dates: "Apr 2025 – Mar 2026",
    employer: "Accuris",
    title: "Senior Software Engineer",
    line: "GitHub migration, first internal MCP servers",
  },
  {
    dates: "Aug 2024 – Apr 2025",
    employer: "Forml",
    title: "Senior Full Stack Engineer",
    line: "first engineering hire, on-prem deploys",
  },
  {
    dates: "May 2023 – Aug 2024",
    employer: "Project Canary",
    title: "DevOps Engineer",
    line: "observability, ephemeral environments, RAG",
  },
  {
    dates: "Aug 2021 – May 2023",
    employer: "Lendflow",
    title: "DevSecOps Engineer",
    line: "SOC 2, on-call, OpenSearch logging",
  },
  {
    dates: "Mar 2020 – Aug 2021",
    employer: "MCG",
    title: "DevOps Engineer",
    line: "on-prem to Azure, Chef to Ansible",
  },
  {
    dates: "Oct 2018 – Mar 2020",
    employer: "Cerner",
    title: "Systems Engineer",
    line: "600+ vSphere hosts, AWX portal",
  },
];

export const socialLinks: Social[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/will-fellhoelter-1aa17312b", Icon: LinkedInIcon },
  { label: "GitHub", href: "https://github.com/willfell", Icon: GithubIcon },
  { label: "Strava", href: "https://www.strava.com/athletes/112909908", Icon: StravaIcon },
];
```

- [ ] **Step 4: Loosen `Section` and fix the Strava icon's viewBox**

Replace `src/components/Layout/Section.tsx`:

```tsx
import classNames from "classnames";
import { FC, memo, PropsWithChildren } from "react";

const Section: FC<
  PropsWithChildren<{
    sectionId: string;
    noPadding?: boolean;
    className?: string;
  }>
> = memo(({ children, sectionId, noPadding = false, className }) => {
  return (
    <section
      className={classNames(className, {
        "px-4 py-16 md:py-20 lg:px-8": !noPadding,
      })}
      id={sectionId}
    >
      <div className={classNames({ "mx-auto max-w-screen-lg": !noPadding })}>
        {children}
      </div>
    </section>
  );
});

Section.displayName = "Section";
export default Section;
```

`StravaIcon`'s path is drawn on a ~330×330 canvas but `Icon` sets `viewBox="0 0 128 128"`, so the glyph is clipped. `Icon` spreads `props` after its own `viewBox`, so a caller can override it, but `IconProps` extends `HTMLAttributes`, which has no `viewBox`. In `src/components/Icon/Icon.tsx` change the interface to:

```ts
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  svgRef?: React.Ref<SVGSVGElement>;
}
```

(`SVGAttributes` already declares `transform`, so the separate `transform?: string;` line goes.) The component body is unchanged. Then replace `src/components/Icon/StravaIcon.tsx`:

```tsx
import { FC, memo } from "react";

import Icon, { IconProps } from "./Icon";

const StravaIcon: FC<IconProps> = memo((props) => (
  <Icon viewBox="0 0 330 330" {...props}>
    <path d="M158.4 0L7 292h89.2l62.2-116.1L220.1 292h88.5zm150.2 292l-43.9 88.2-44.6-88.2h-67.6l112.2 220 111.5-220z" />
  </Icon>
));

StravaIcon.displayName = "StravaIcon";
export default StravaIcon;
```

- [ ] **Step 5: Reduce `_app.tsx` and write the page shell**

Replace `src/pages/_app.tsx`:

```tsx
import "tailwindcss/tailwind.css";
import "../globalStyles.scss";

import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

Replace `src/pages/index.tsx` with the shell (sections arrive in Tasks 4–6):

```tsx
import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <main />
  </Page>
));

Home.displayName = "Home";
export default Home;
```

- [ ] **Step 6: Styles foundation**

Replace `src/globalStyles.scss`:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap");

html {
  -webkit-tap-highlight-color: transparent;
  scroll-behavior: smooth;
}

body {
  @apply bg-cream text-stone-black antialiased;
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

Replace `tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css,scss}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "monospace"],
      },
      colors: {
        cream: "#F7F4EE",
        "earth-tan": "#DBBB9C",
        "canyon-tan": "#E4D5B7",
        "forest-green": "#5E6746",
        "sage-green": "#7D8A69",
        "deep-forest": "#3A4428",
        "stone-black": "#2A2A2A",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

In `src/pages/_document.tsx`, change `<body className="bg-stone-50">` to `<body>` so the page ground comes from `globalStyles.scss`. Leave the rest of the file alone.

- [ ] **Step 7: Drop the dependencies nothing imports anymore**

In `app/package.json` remove these four lines from `dependencies`: `"@headlessui/react"`, `"framer-motion"`, `"react-icons"`, `"ts-pattern"`. Then from `app/`:

```bash
npx -y yarn@1 install
grep -rn "framer-motion\|react-icons\|ts-pattern\|@headlessui" src
```

Expected: `yarn.lock` shrinks; the grep prints nothing.

- [ ] **Step 8: Type-check and build**

Run from `app/`: `npx -y yarn@1 compile && npx -y yarn@1 build`
Expected: both exit 0. `out/` contains `index.html` and no `education/`, `site-info/`, `info/`, `contact/`.

- [ ] **Step 9: Commit**

```bash
git add -A app/src app/tailwind.config.js app/package.json app/yarn.lock
git commit -m "site: reset data, styles and app shell for the one-page layout"
```

---

### Task 4: Nav and Hero

**Files:**
- Create: `app/src/components/Sections/Nav.tsx`, `app/src/components/Sections/Hero.tsx`
- Modify: `app/src/pages/index.tsx`

**Interfaces:**
- Consumes: `heroData`, `resumeHref` from `data.tsx`; `trackEvent` from `utils/analytics.ts`; `Section`.
- Produces: default exports `Nav: FC`, `Hero: FC`.

- [ ] **Step 1: Write `Nav.tsx`**

```tsx
import Link from "next/link";
import { FC, memo } from "react";

import { resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";

const linkClass = "hover:underline underline-offset-4";

const Nav: FC = memo(() => (
  <header className="border-b border-stone-300 bg-cream">
    <nav
      aria-label="Site"
      className="mx-auto flex max-w-screen-lg flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 lg:px-8"
    >
      <Link className="text-lg font-semibold text-stone-black" href="/">
        Will Fellhoelter
      </Link>
      <ul className="flex flex-wrap items-center gap-x-6 font-mono text-sm tracking-wide text-forest-green">
        <li>
          <a className={linkClass} href="#work">
            Work
          </a>
        </li>
        <li>
          <a className={linkClass} href="#experience">
            Experience
          </a>
        </li>
        <li>
          <a
            className={linkClass}
            download=""
            href={resumeHref}
            onClick={() => trackEvent("Download Click", { file: "Resume" })}
          >
            Resume ↓
          </a>
        </li>
      </ul>
    </nav>
  </header>
));

Nav.displayName = "Nav";
export default Nav;
```

- [ ] **Step 2: Write `Hero.tsx`**

One `Image` element: small and above the name on phones, 288px and to the right from `lg:`.

```tsx
import classNames from "classnames";
import Image from "next/image";
import { FC, memo } from "react";

import { heroData } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import Section from "../Layout/Section";

const Hero: FC = memo(() => {
  const { name, description, imageSrc, imageAlt, actions } = heroData;

  return (
    <Section className="bg-cream" sectionId="hero">
      <div className="hero-enter flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-6">
          <Image
            alt={imageAlt}
            className="h-28 w-28 rounded-full object-cover lg:hidden"
            height={288}
            priority
            src={imageSrc}
            width={288}
          />
          <h1 className="text-4xl font-bold leading-tight text-forest-green md:text-5xl">
            {name}
          </h1>
          <p className="max-w-prose text-lg leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-3">
            {actions.map(({ href, text, primary, download }) => (
              <a
                className={classNames(
                  "rounded-full border-2 px-5 py-2 font-medium transition-colors",
                  primary
                    ? "border-earth-tan bg-earth-tan text-stone-black hover:bg-canyon-tan"
                    : "border-forest-green text-forest-green hover:bg-forest-green hover:text-cream",
                )}
                href={href}
                key={text}
                onClick={() => trackEvent("Hero CTA Click", { button: text })}
                {...(download
                  ? { download: "" }
                  : { rel: "noopener noreferrer", target: "_blank" })}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
        <Image
          alt=""
          aria-hidden="true"
          className="hidden h-72 w-72 shrink-0 rounded-full object-cover lg:block"
          height={288}
          src={imageSrc}
          width={288}
        />
      </div>
    </Section>
  );
});

Hero.displayName = "Hero";
export default Hero;
```

(Two `Image` elements point at the same file; the browser fetches it once. The desktop copy is `aria-hidden` so screen readers hear the name once.)

- [ ] **Step 3: Mount them**

Replace `src/pages/index.tsx`:

```tsx
import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import Hero from "../components/Sections/Hero";
import Nav from "../components/Sections/Nav";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
    </main>
  </Page>
));

Home.displayName = "Home";
export default Home;
```

- [ ] **Step 4: Build and check the rendered HTML**

Run from `app/`: `npx -y yarn@1 compile && npx -y yarn@1 build && grep -c "Principal Software Engineer in Denver" out/index.html && grep -c 'href="/WillFellhoelterResume.pdf"' out/index.html`
Expected: compile and build exit 0; the first grep prints `1`; the second prints `2` (nav and hero).

- [ ] **Step 5: Commit**

```bash
git add app/src/components/Sections/Nav.tsx app/src/components/Sections/Hero.tsx app/src/pages/index.tsx
git commit -m "site: add the static nav and the compact hero"
```

---

### Task 5: About and Selected work

**Files:**
- Create: `app/src/components/Sections/About.tsx`, `app/src/components/Sections/SelectedWork.tsx`
- Modify: `app/src/pages/index.tsx`

**Interfaces:**
- Consumes: `aboutData`, `selectedWork` from `data.tsx`; `Section`; `trackEvent`.
- Produces: default exports `About: FC`, `SelectedWork: FC`. `SelectedWork` renders `<section id="work">`.

- [ ] **Step 1: Write `About.tsx`**

The hero already carries the top padding, so About uses `noPadding` and pads only the bottom.

```tsx
import { FC, memo } from "react";

import { aboutData } from "../../data/data";
import Section from "../Layout/Section";

const About: FC = memo(() => (
  <Section className="bg-cream px-4 pb-16 md:pb-20 lg:px-8" noPadding sectionId="about">
    <div className="mx-auto max-w-screen-lg">
      <h2 className="sr-only">About</h2>
      <p className="max-w-prose text-lg leading-relaxed">{aboutData.description}</p>
    </div>
  </Section>
));

About.displayName = "About";
export default About;
```

- [ ] **Step 2: Write `SelectedWork.tsx`**

```tsx
import { FC, memo } from "react";

import { selectedWork } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import Section from "../Layout/Section";

const SelectedWork: FC = memo(() => (
  <Section className="bg-canyon-tan" sectionId="work">
    <h2 className="mb-8 text-3xl font-bold text-forest-green">Selected work</h2>
    <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
      {selectedWork.map(({ title, context, description, href }) => (
        <li className="flex flex-col gap-2" key={title}>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="font-mono text-sm tracking-wide text-stone-600">{context}</p>
          <p className="leading-relaxed">{description}</p>
          {href && (
            <a
              className="mt-auto pt-2 font-medium text-forest-green hover:underline underline-offset-4"
              href={href}
              onClick={() => trackEvent("Project Click", { project: title })}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub ↗
            </a>
          )}
        </li>
      ))}
    </ul>
  </Section>
));

SelectedWork.displayName = "SelectedWork";
export default SelectedWork;
```

- [ ] **Step 3: Mount them**

In `src/pages/index.tsx`, add the two imports (keep imports alphabetised by path: `About`, `Hero`, `Nav`, `SelectedWork`) and render inside `<main>`:

```tsx
    <main>
      <Hero />
      <About />
      <SelectedWork />
    </main>
```

- [ ] **Step 4: Build and check the rendered HTML**

Run from `app/`: `npx -y yarn@1 compile && npx -y yarn@1 build && grep -c "operations for 100+ microservices" out/index.html && grep -c "Ephemeral environments, three times" out/index.html && grep -c 'href="https://github.com/willfell/sauce"' out/index.html && grep -c 'id="work"' out/index.html`
Expected: compile and build exit 0; every grep prints `1`. If the first prints `0`, the About copy drifted from the spec: fix `data.tsx`, not the grep.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/Sections/About.tsx app/src/components/Sections/SelectedWork.tsx app/src/pages/index.tsx
git commit -m "site: add the about paragraph and the three selected works"
```

---

### Task 6: Roles and Footer

**Files:**
- Create: `app/src/components/Sections/Roles.tsx`, `app/src/components/Sections/Footer.tsx`
- Modify: `app/src/pages/index.tsx`

**Interfaces:**
- Consumes: `roles`, `socialLinks`, `contactEmail` from `data.tsx`; `Section`; `trackEvent`.
- Produces: default exports `Roles: FC` (renders `<section id="experience">`), `Footer: FC` (renders `<footer>`, outside `<main>`).

- [ ] **Step 1: Write `Roles.tsx`**

A definition list: date column fixed at 10rem (160px) from `md:`; on phones each date sits on its own line above the role.

```tsx
import { FC, Fragment, memo } from "react";

import { roles } from "../../data/data";
import Section from "../Layout/Section";

const Roles: FC = memo(() => (
  <Section className="bg-cream" sectionId="experience">
    <h2 className="mb-8 text-3xl font-bold text-forest-green">Experience</h2>
    <dl className="grid gap-y-4 md:grid-cols-[10rem_1fr] md:gap-x-6 md:gap-y-3">
      {roles.map(({ dates, employer, title, line }) => (
        <Fragment key={`${employer}-${title}`}>
          <dt className="font-mono text-sm tracking-wide text-stone-600">{dates}</dt>
          <dd className="mb-2 leading-relaxed md:mb-0">
            <span className="font-semibold">{employer}</span> · {title} ·{" "}
            <span className="text-stone-600">{line}</span>
          </dd>
        </Fragment>
      ))}
    </dl>
  </Section>
));

Roles.displayName = "Roles";
export default Roles;
```

- [ ] **Step 2: Write `Footer.tsx`**

The email is a `mailto:` link with `select-all` so it can be selected in one click even where clipboard access is refused; the copy button swallows a clipboard rejection and simply does not flip to "copied".

```tsx
import { FC, memo, useState } from "react";

import { contactEmail, socialLinks } from "../../data/data";
import { trackEvent } from "../../utils/analytics";

const Footer: FC = memo(() => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    trackEvent("Email Click");
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer className="bg-deep-forest px-4 py-12 text-earth-tan lg:px-8">
      <div className="mx-auto flex max-w-screen-lg flex-wrap items-center justify-between gap-x-8 gap-y-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2 font-mono text-sm">
            <a
              className="select-all hover:underline underline-offset-4"
              href={`mailto:${contactEmail}`}
              onClick={() => trackEvent("Email Click")}
            >
              {contactEmail}
            </a>
            <button
              aria-label="Copy email address"
              className="rounded border border-earth-tan/60 px-2 py-0.5 text-xs transition-colors hover:bg-earth-tan hover:text-deep-forest"
              onClick={copyEmail}
              type="button"
            >
              {copied ? "copied" : "copy"}
            </button>
          </span>
          <ul className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  aria-label={label}
                  className="block transition-colors hover:text-cream"
                  href={href}
                  onClick={() => trackEvent("Social Click", { platform: label })}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-xs text-earth-tan/80">
          <a
            className="hover:underline underline-offset-4"
            href="https://github.com/willfell/will-fell"
            rel="noopener noreferrer"
            target="_blank"
          >
            source
          </a>{" "}
          · © {new Date().getFullYear()} Will Fellhoelter
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
```

- [ ] **Step 3: Mount them**

Final `src/pages/index.tsx`:

```tsx
import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import About from "../components/Sections/About";
import Footer from "../components/Sections/Footer";
import Hero from "../components/Sections/Hero";
import Nav from "../components/Sections/Nav";
import Roles from "../components/Sections/Roles";
import SelectedWork from "../components/Sections/SelectedWork";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
      <About />
      <SelectedWork />
      <Roles />
    </main>
    <Footer />
  </Page>
));

Home.displayName = "Home";
export default Home;
```

- [ ] **Step 4: Build and check the rendered HTML**

Run from `app/`: `npx -y yarn@1 compile && npx -y yarn@1 build && grep -c "Oct 2018 – Mar 2020" out/index.html && grep -c "willfellhoelter@gmail.com" out/index.html && grep -c 'href="https://www.strava.com/athletes/112909908"' out/index.html && grep -c 'id="experience"' out/index.html`
Expected: compile and build exit 0; greps print `1`, `2` (link text and `mailto:` href), `1`, `1`.

- [ ] **Step 5: Run the verification gate**

Run from `app/`: `npx -y yarn@1 copy-resume`
Run from root: `npm run site:verify`
Expected: `PASS`, with the printed height under 2,600px and words under 400. If height is over, the first thing to check is that `Section` padding is `py-16 md:py-20` and the hero image is 288px, not larger. Open `app/.screenshots/home-1280.png` and `home-390.png` and look at them once; fix anything visibly wrong (overlap, clipped text, a band with no gap) and rerun.

- [ ] **Step 6: Commit**

```bash
git add app/src/components/Sections/Roles.tsx app/src/components/Sections/Footer.tsx app/src/pages/index.tsx
git commit -m "site: add the one-line roles and the footer that is the contact page"
```

---

### Task 7: Images down to one

**Files:**
- Delete: everything under `app/public/images/` except `about/profilepic.jpg`
- Delete: `app/resume-screenshot.jpg` is NOT touched (out of scope)

**Interfaces:**
- Consumes: `data.tsx` referencing exactly one image path.
- Produces: `yarn images:validate` clean.

- [ ] **Step 1: See what the validator thinks is orphaned**

Run from `app/`: `npx -y yarn@1 images:validate`
Expected: 0 broken references, 64 orphans (everything except `about/profilepic.jpg`).

- [ ] **Step 2: Archive the raster orphans, then delete every orphan from the tree**

`images:archive` only moves raster files (it skips `.svg`), and the `_archive/` folder is git-ignored, so the move already shows up as deletions. Remove the SVGs and the emptied directories directly.

From `app/`:

```bash
npx -y yarn@1 images:archive
git rm -q -r public/images/skills public/images/logos
find public/images -type d -empty -not -path "*/_archive*" -delete
ls -R public/images | grep -v _archive
```

Expected: the listing shows only `about/` containing `profilepic.jpg`.

- [ ] **Step 3: Validate**

Run from `app/`: `npx -y yarn@1 images:validate`
Expected: 0 broken references, 0 orphans.

- [ ] **Step 4: Build and verify**

Run from `app/`: `npx -y yarn@1 build && npx -y yarn@1 copy-resume`
Run from root: `npm run site:verify`
Expected: `PASS`. `ls app/out/images/about` shows `profilepic.jpg` only.

- [ ] **Step 5: Commit**

```bash
git add -A app/public/images
git commit -m "site: keep one image and drop the gallery, logos and skill icons"
```

Confirm with `git show --stat HEAD | tail -3` that `_archive/` does not appear (it is ignored) and that the commit only deletes.

---

### Task 8: Retire the resume HTML build

**Files:**
- Delete: `resume/build.js`, `resume/index.html`, `resume/resume.css`

**Interfaces:**
- Produces: nothing in the repo can overwrite `app/public/WillFellhoelterResume.pdf` or `app/src/assets/WillFellhoelterResume.pdf`.

- [ ] **Step 1: Delete the directory**

From the repo root:

```bash
git rm -q -r resume
npm run resume:build
```

Expected: `npm ERR! Missing script: "resume:build"`.

- [ ] **Step 2: Confirm the served PDF is still the supplied one**

```bash
shasum -a 256 app/public/WillFellhoelterResume.pdf app/src/assets/WillFellhoelterResume.pdf
```

Expected: both lines start with `ee0c9243f632798e01287555ce940188ed21459eebd4c26bd81eb6a45fb144ef`.

- [ ] **Step 3: Commit**

```bash
git commit -m "resume: retire the HTML build now the PDF is produced outside the repo"
```

---

### Task 9: Lint, docs, final gate, PR

**Files:**
- Modify: `README.md`
- Modify: `app/scripts/images/validate.js` and `archive-orphans.js` only if the lint run demands it (it should not)

**Interfaces:**
- Consumes: everything above.
- Produces: a PR against `main` from `worktree-site-simplify`.

- [ ] **Step 1: Lint**

Run from `app/`: `npx -y yarn@1 lint`
Expected: exits 0. `lint` runs `eslint . --fix`; if it reorders imports, that is fine. If it reports `react/no-unescaped-entities`, an apostrophe or quote in JSX text needs to move into a string in `data.tsx` (there should be none; all copy is in strings). Then `npx -y yarn@1 compile` must still pass.

- [ ] **Step 2: Update the README's Features list**

In `README.md` replace the `## Features` bullet list with:

```markdown
- One page: who Will is, three selected works, one line per role, contact in the footer
- Resume download (the PDF is produced outside the repo; commit it to both `app/public/` and `app/src/assets/`)
- Static export, responsive, no scroll-triggered animation
- Deployed by GitHub Actions on every merge to `main`
```

Add a `## Verification` section after `## Features`:

```markdown
## Verification

From `app/`: `yarn compile && yarn lint && yarn images:validate && yarn build && yarn copy-resume`.
From the repo root: `npm run site:verify` renders `app/out/` in Playwright and checks page height, word count, required links, dead routes and the resume checksum. Screenshots land in `app/.screenshots/`.
```

- [ ] **Step 3: Run every gate from a clean build**

From `app/`:

```bash
rm -rf .next out
npx -y yarn@1 compile && npx -y yarn@1 lint && npx -y yarn@1 images:validate && npx -y yarn@1 build && npx -y yarn@1 copy-resume
grep -rn "opacity-0\|animate-on-scroll\|animate-on-load" src || echo "no animation classes"
ls public/images/about
```

From root: `npm run site:verify`
Expected: every command exits 0; `no animation classes`; `profilepic.jpg`; `PASS`.

- [ ] **Step 4: Commit and push**

```bash
git add README.md app/src
git commit -m "docs: describe the one-page site and its verification gate"
git push -u origin worktree-site-simplify
```

- [ ] **Step 5: Open the PR**

```bash
gh pr create --base main --head worktree-site-simplify --title "site: one page, three screens" --body-file - <<'EOF'
## What

Replaces the five-page portfolio with one page: hero, one About paragraph, three selected works, one line per role, footer as the contact page. Deletes Education, Site Info, Contact, the side nav, the project cards and modal, the skills bars, 64 of 65 images, and the resume HTML build. Serves the resume PDF Will supplied on 2026-09-28.

Spec: `docs/superpowers/specs/2026-09-28-site-simplify-design.md`. Plan: `docs/superpowers/plans/2026-09-28-site-simplify.md`.

## Why

A hiring manager with four minutes should leave with one sentence, the resume and one project. The old site took fifteen screens and two navigation systems to say that and repeated the same three claims four times.

## Verification

- `yarn compile`, `yarn lint`, `yarn images:validate`, `yarn build` pass.
- `npm run site:verify`: page height <height>px at 1280 wide (limit 2,600), <words> words in `<main>` (limit 400), all six required links present, no dead routes exported, no animation classes, no horizontal overflow at 390px, resume sha256 matches the supplied PDF.
- Screenshots at 1280 and 390 attached below.

## Not in this PR

- `/sauce` page (phase 2, after the Sauce rework).
- Repo hygiene: GPS EXIF in history and the two public `docs/` files.
- Redirects for the removed routes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_012x2V7hKKWgL81v8SiBUXYn
EOF
```

Fill `<height>` and `<words>` from the `site:verify` output before running. Then send the two screenshots to Will with `SendUserFile` and note the PR number.

- [ ] **Step 6: Watch CI**

Run: `gh pr checks --watch`
Expected: `validate-build` and `lint` both pass. `validate-build` runs `yarn install`, `yarn images:validate`, `yarn build` from `app/` on the `will-fell` runner pool.

Do not merge. Will reviews anything outward-facing before it merges.
