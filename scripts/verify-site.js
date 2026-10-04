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

const failures = [];
function check(ok, message) {
  if (!ok) failures.push(message);
}

// Maps a request path to a file under OUT, refusing anything that escapes it.
function resolveOut(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  let file = path.resolve(OUT, "." + decoded);
  if (file !== OUT && !file.startsWith(OUT + path.sep)) return null;
  if (decoded.endsWith("/")) file = path.join(file, "index.html");
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return null;
  return file;
}

// Serves OUT over HTTP the way CloudFront does in front of S3: assets by
// path, and any unknown path falls through to index.html with status 200
// (infra/cf.tf maps the bucket's 403 to /index.html).
function serve() {
  const server = http.createServer((req, res) => {
    const file = resolveOut(req.url) || path.join(OUT, "index.html");
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

// Production HTML points image URLs at the live site (NEXT_PUBLIC_IMAGE_BASE_URL);
// answer those from OUT so the gate tests this build, offline.
async function routeSiteOrigin(context, served) {
  await context.route(`${SITE_ORIGIN}/**`, (route) => {
    const urlPath = new URL(route.request().url()).pathname;
    const file = resolveOut(urlPath);
    if (!file) return route.fulfill({ status: 404, body: "" });
    served.add(urlPath);
    return route.fulfill({
      status: 200,
      contentType: MIME[path.extname(file)] || "application/octet-stream",
      body: fs.readFileSync(file),
    });
  });
}

// Returns true when the build is too incomplete for the browser checks to mean anything.
function staticChecks() {
  const indexPresent = fs.existsSync(path.join(OUT, "index.html"));
  check(indexPresent, "app/out/index.html missing; run `yarn build` in app/ first");
  for (const route of DEAD_ROUTES) {
    check(!fs.existsSync(path.join(OUT, route)), `out/${route}/ is still exported`);
  }
  const pdf = path.join(OUT, PDF_PATH);
  const pdfPresent = fs.existsSync(pdf);
  check(pdfPresent, `out${PDF_PATH} missing; run \`yarn copy-resume\``);
  if (pdfPresent) {
    const sha = crypto.createHash("sha256").update(fs.readFileSync(pdf)).digest("hex");
    check(sha === PDF_SHA256, `resume sha256 ${sha} is not the supplied PDF`);
  }
  if (!indexPresent || !pdfPresent) return true;

  const html = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
  check(
    !/opacity-0|animate-on-/.test(html),
    "static HTML still carries opacity-0 or animate-on-* classes",
  );
  check(!/AWS accounts/i.test(html), 'out/index.html mentions "AWS accounts"; Will asked for that figure to be gone');
  const ogImage = (html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"|<meta[^>]*content="([^"]+)"[^>]*property="og:image"/) || []).slice(1).find(Boolean);
  check(
    !!ogImage && ogImage.startsWith(`${SITE_ORIGIN}/`) && resolveOut(new URL(ogImage).pathname) !== null,
    `og:image is ${JSON.stringify(ogImage)}; it must be an absolute ${SITE_ORIGIN} URL to a file in out/`,
  );
  check(
    !/kubernetes/i.test(html),
    'out/index.html says "Kubernetes" (text, an attribute or a <meta>); the site says "K8s"',
  );
  for (const [tag] of html.matchAll(/<link[^>]*>/g)) {
    const rel = (tag.match(/rel="([^"]+)"/) || [])[1];
    const href = (tag.match(/href="([^"]+)"/) || [])[1];
    if (!["icon", "apple-touch-icon", "manifest"].includes(rel) || !href) continue;
    check(resolveOut(href) !== null, `<link rel="${rel}"> points at ${href}, which is not in out/`);
  }
  const manifestFile = path.join(OUT, "site.webmanifest");
  if (fs.existsSync(manifestFile)) {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    for (const icon of manifest.icons || []) {
      check(resolveOut(icon.src) !== null, `site.webmanifest icon ${icon.src} is not in out/`);
    }
    check(
      manifest.name === "Will Fellhoelter",
      `site.webmanifest name is "${manifest.name}", not "Will Fellhoelter"`,
    );
  }
  return false;
}

async function desktopChecks(browser, origin) {
  const served = new Set();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, served);
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  check(height <= MAX_HEIGHT, `page height ${height}px exceeds ${MAX_HEIGHT}px`);

  const words = await page.evaluate(() => {
    const main = document.querySelector("main");
    return main ? main.innerText.trim().split(/\s+/).filter(Boolean).length : -1;
  });
  check(words >= 0, "no <main> element on the page");
  check(words <= MAX_WORDS, `<main> has ${words} words, limit ${MAX_WORDS}`);

  const hrefs = new Set(
    await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")),
    ),
  );
  for (const link of REQUIRED_LINKS) check(hrefs.has(link), `missing link ${link}`);

  const pdfResponse = await page.request.get(`${origin}${PDF_PATH}`);
  check(
    pdfResponse.ok() && pdfResponse.headers()["content-type"] === "application/pdf",
    `${PDF_PATH} did not serve as a PDF (status ${pdfResponse.status()})`,
  );

  const hero = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("#hero img"));
    return imgs.map((img) => ({
      alt: img.getAttribute("alt"),
      src: img.getAttribute("src"),
      visible: img.getClientRects().length > 0 && getComputedStyle(img).visibility !== "hidden",
    }));
  });
  check(hero.length === 1, `hero renders ${hero.length} <img> elements, expected exactly one`);
  check(hero[0] && hero[0].alt && hero[0].alt.trim() !== "", "hero photo has no alt text");
  check(hero[0] && hero[0].visible, "hero photo is not visible at 1280 wide");
  check(
    served.has("/images/about/profilepic.jpg"),
    "hero photo was not served from out/images/about/profilepic.jpg",
  );

  const lede = await page.evaluate(() => {
    const p = document.querySelector("#hero [data-lede]");
    return p ? parseFloat(getComputedStyle(p).fontSize) : null;
  });
  check(lede !== null, "no element matches #hero [data-lede]");
  check(
    lede === null || lede >= MIN_LEDE_PX,
    `hero lede is ${lede}px, spec says at least ${MIN_LEDE_PX}px`,
  );

  const missingFonts = await page.evaluate(async (families) => {
    await document.fonts.ready;
    return families.filter(
      (family) =>
        !Array.from(document.fonts).some(
          (f) => f.family.replace(/["']/g, "") === family && f.status === "loaded",
        ),
    );
  }, FONTS);
  check(missingFonts.length === 0, `fonts never loaded: ${missingFonts.join(", ")}`);

  const clippedSvgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("svg"))
      .map((svg) => {
        const box = svg.getBBox();
        const view = svg.viewBox.baseVal;
        const inside =
          box.x >= view.x - 0.5 &&
          box.y >= view.y - 0.5 &&
          box.x + box.width <= view.x + view.width + 0.5 &&
          box.y + box.height <= view.y + view.height + 0.5;
        const owner = svg.closest("a");
        return inside ? null : (owner && owner.getAttribute("aria-label")) || "unlabelled svg";
      })
      .filter(Boolean),
  );
  check(
    clippedSvgs.length === 0,
    `svg drawing extends past its viewBox (clipped): ${clippedSvgs.join(", ")}`,
  );

  const sauceLabel = await page.evaluate(() => {
    const a = document.querySelector('#projects a[href*="sauce"]');
    return a ? a.getAttribute("aria-label") : null;
  });
  check(
    sauceLabel && /sauce/i.test(sauceLabel) && /github/i.test(sauceLabel),
    `Sauce link aria-label is ${JSON.stringify(sauceLabel)}, expected it to name Sauce and GitHub`,
  );

  const contrast = await page.evaluate(() => {
    const parse = (css) => {
      const m = css.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = "1"] = m[1].split(",").map((v) => v.trim());
      return { r: +r, g: +g, b: +b, a: +a };
    };
    const background = (el) => {
      for (let node = el; node; node = node.parentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) return c;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };
    const luminance = ({ r, g, b }) => {
      const lin = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };
    const ratio = (el) => {
      const fg = parse(getComputedStyle(el).color);
      const bg = background(el);
      const blended = {
        r: fg.a * fg.r + (1 - fg.a) * bg.r,
        g: fg.a * fg.g + (1 - fg.a) * bg.g,
        b: fg.a * fg.b + (1 - fg.a) * bg.b,
      };
      const [hi, lo] = [luminance(blended), luminance(bg)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    const targets = {
      "sauce link": document.querySelector('#projects a[href*="sauce"]'),
      "footer source line": document.querySelector('footer a[href*="will-fell"]'),
      "role date": document.querySelector("#experience summary span"),
      "github strip": document.querySelector("#github p"),
      "project caption": document.querySelector("#projects figcaption"),
    };
    return Object.entries(targets).map(([name, el]) =>
      el ? { name, ratio: Math.round(ratio(el) * 100) / 100 } : { name, ratio: null },
    );
  });
  for (const { name, ratio } of contrast) {
    check(ratio !== null, `no element matches the ${name} contrast target`);
    check(ratio === null || ratio >= 4.5, `${name} contrast ${ratio}:1 is below AA 4.5:1`);
  }

  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, "home-1280.png"), fullPage: true });

  // A removed route falls through to index.html in production; the canonical
  // must still name the home page after hydration.
  await page.goto(`${origin}/education/`, { waitUntil: "networkidle" });
  const canonical = await page.evaluate(() => ({
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    og: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
  }));
  check(
    canonical.canonical === `${SITE_ORIGIN}/` && canonical.og === `${SITE_ORIGIN}/`,
    `on /education/ the canonical is ${canonical.canonical} and og:url is ${canonical.og}; both must be ${SITE_ORIGIN}/`,
  );

  await context.close();
  return { height, words, links: hrefs.size };
}

async function phoneChecks(browser, origin) {
  for (const width of PHONE_WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    await routeSiteOrigin(context, new Set());
    const page = await context.newPage();
    await page.goto(`${origin}/`, { waitUntil: "networkidle" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    check(scrollWidth <= width, `horizontal overflow at ${width}px: scrollWidth ${scrollWidth}`);
    const photoVisible = await page.evaluate(() => {
      const img = document.querySelector("#hero img");
      return !!img && img.getClientRects().length > 0;
    });
    check(photoVisible, `hero photo is not visible at ${width}px`);
    if (width === PHONE_WIDTHS[0]) {
      fs.mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({ path: path.join(SHOTS, `home-${width}.png`), fullPage: true });
    }
    await context.close();
  }
}

// The footer year is rendered at build time; a visitor in a later year must
// not trigger a hydration error (which re-renders the page and replays the fade).
async function laterYearChecks(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, new Set());
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.clock.install({ time: new Date("2027-06-01T12:00:00Z") });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  const hydration = consoleErrors.filter((e) =>
    /hydrat|did not match|does not match|Minified React error #(418|423|425)/i.test(e),
  );
  check(
    hydration.length === 0,
    `hydration error when the clock is in a later year than the build: ${hydration[0]}`,
  );
  await context.close();
}

// Each role is one line at rest and expands to its resume bullets on demand.
async function rolesChecks(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, new Set());
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });

  const rest = await page.evaluate(() => {
    const roles = Array.from(document.querySelectorAll("#experience details"));
    return {
      count: roles.length,
      bullets: roles.map((d) => d.querySelectorAll("li").length),
      openAtRest: roles.filter((d) => d.open).length,
      visibleBullets: Array.from(document.querySelectorAll("#experience details li")).filter(
        (li) => li.checkVisibility(),
      ).length,
    };
  });
  check(rest.count === 7, `experience has ${rest.count} expandable roles, expected 7`);

  // Every role and the school carry their logo, and every logo actually loaded.
  const logos = await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll("#experience img"));
    // The logos are lazy; ask for them now rather than scrolling the page.
    await Promise.all(
      imgs.map((img) => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      }),
    );
    return {
      roles: document.querySelectorAll("#experience summary img").length,
      all: imgs.map((img) => ({
        src: img.getAttribute("src"),
        loaded: img.complete && img.naturalWidth > 0,
      })),
    };
  });
  check(logos.roles === rest.count, `${logos.roles} of ${rest.count} roles show a logo`);
  check(logos.all.length === rest.count + 1, `experience shows ${logos.all.length} logos, expected ${rest.count + 1}`);
  for (const { src, loaded } of logos.all) check(loaded, `logo ${src} did not load`);
  check(
    rest.bullets.length > 0 && rest.bullets.every((n) => n >= 2),
    `every role needs at least two bullets; counts are [${rest.bullets.join(", ")}]`,
  );
  check(
    rest.openAtRest === 0 && rest.visibleBullets === 0,
    `roles must be closed at rest; ${rest.openAtRest} open, ${rest.visibleBullets} bullets visible`,
  );

  if (rest.count > 0) {
    await page.locator("#experience summary").first().click();
    // The role animates open; read it once the transition has settled.
    await page.waitForTimeout(500);
    const opened = await page.evaluate(() => {
      const d = document.querySelector("#experience details");
      return {
        open: d.open,
        visible: Array.from(d.querySelectorAll("li")).filter((li) => li.checkVisibility())
          .length,
      };
    });
    check(
      opened.open && opened.visible === rest.bullets[0],
      `clicking the first role shows ${opened.visible} of ${rest.bullets[0]} bullets`,
    );
  }

  const text = await page.evaluate(() => document.body.textContent);
  check(!/\b(run|ran|running) 100\+/i.test(text), 'page says "run 100+"; the wording is "operate"');
  check(
    !/Entra ID/.test(text),
    "page names Entra ID; the site keeps Accuris identity specifics generic (SSO)",
  );
  check(!/Kubernetes/.test(text), 'page says "Kubernetes"; the site says "K8s"');
  await context.close();

  const phone = await browser.newContext({ viewport: { width: 320, height: 844 } });
  await routeSiteOrigin(phone, new Set());
  const small = await phone.newPage();
  await small.goto(`${origin}/`, { waitUntil: "networkidle" });
  await small.evaluate(() =>
    document.querySelectorAll("#experience details").forEach((d) => (d.open = true)),
  );
  const expandedWidth = await small.evaluate(() => document.documentElement.scrollWidth);
  check(expandedWidth <= 320, `horizontal overflow at 320px with every role open: ${expandedWidth}`);
  await phone.close();
}

// The hero's heatmap (#activity) renders the committed snapshot: one column
// per week, one cell per day, and the total the snapshot carries. Pointing at
// a day, or arrowing through the days, reads that day's count back.
async function githubChecks(browser, origin) {
  const present = fs.existsSync(SNAPSHOT);
  check(present, "app/src/data/github-contributions.json missing; run `yarn github:fetch` in app/");
  if (!present) return;
  let snapshot;
  try {
    snapshot = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
    if (
      !Array.isArray(snapshot.days) ||
      !snapshot.days.length ||
      !Number.isInteger(snapshot.total)
    ) {
      throw new Error("no days or total");
    }
  } catch (error) {
    check(
      false,
      `github-contributions.json is unusable (${error.message}); ` +
        "run `yarn github:fetch --check` in app/",
    );
    return;
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, new Set());
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  const rendered = await page.evaluate(() => ({
    dates: Array.from(document.querySelectorAll("#activity [data-day]"), (el) =>
      el.getAttribute("data-day"),
    ),
    offWeek: Array.from(document.querySelectorAll("#activity [data-week]"))
      .slice(1)
      .map((w) => w.querySelector("[data-day]")?.getAttribute("data-day"))
      .filter((d) => d && new Date(`${d}T00:00:00Z`).getUTCDay() !== 0),
    weeks: document.querySelectorAll("#activity [data-week]").length,
    total: document.querySelector("#activity [data-total]")?.textContent ?? null,
    inHero: !!document.querySelector("#hero #activity"),
    labels: Array.from(
      document.querySelectorAll("#activity [data-week] > span:first-child"),
    ).filter((s) => s.textContent.trim()).length,
    link: !!document.querySelector('#github a[href="https://github.com/willfell"]'),
  }));
  const lead = new Date(`${snapshot.days[0].date}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((lead + snapshot.days.length) / 7);
  const expected = snapshot.days.map((d) => d.date);
  let at = expected.findIndex((date, i) => rendered.dates[i] !== date);
  if (at === -1 && rendered.dates.length !== expected.length) at = expected.length;
  check(
    at === -1,
    `heatmap day ${at} is ${rendered.dates[at] ?? "missing"}, the snapshot's is ` +
      `${expected[at] ?? "missing"} (${rendered.dates.length} rendered, ${expected.length} in ` +
      "the snapshot; rebuild app/out if the snapshot changed)",
  );
  check(
    rendered.offWeek.length === 0,
    `heatmap columns must start on Sunday; ${rendered.offWeek.slice(0, 3).join(", ")} do not`,
  );
  check(rendered.weeks === weeks, `heatmap renders ${rendered.weeks} weeks, expected ${weeks}`);
  check(
    rendered.total === snapshot.total.toLocaleString("en-US"),
    `GitHub total reads ${JSON.stringify(rendered.total)}, snapshot says ${snapshot.total}`,
  );
  check(
    rendered.labels >= 11,
    `heatmap shows ${rendered.labels} month labels, expected at least 11`,
  );
  check(rendered.inHero, "the contribution heatmap (#activity) is not inside the hero");
  check(rendered.link, "GitHub band has no link to github.com/willfell");

  // The readout: the legend at rest, the day's count under the pointer and
  // under the keyboard cursor, the legend again once both have left.
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const says = ({ date, count }) => {
    const d = new Date(`${date}T00:00:00Z`);
    const n = count === 0 ? "No" : count.toLocaleString("en-US");
    return `${n} contribution${count === 1 ? "" : "s"} on ${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  };
  const readout = () => page.locator("#activity [aria-live]").innerText();
  const busiest = snapshot.days.reduce((a, b) => (b.count > a.count ? b : a));
  const latest = snapshot.days[snapshot.days.length - 1];
  check(/Less[\s\S]*More/.test(await readout()), "the heatmap readout does not show the legend at rest");
  await page.hover(`#activity [data-day="${busiest.date}"]`);
  const pointed = await readout();
  check(pointed === says(busiest), `pointing at ${busiest.date} reads "${pointed}", expected "${says(busiest)}"`);
  await page.mouse.move(1, 1);
  await page.focus('#activity [role="region"]');
  const focused = await readout();
  check(focused === says(latest), `focusing the heatmap reads "${focused}", expected the latest day, "${says(latest)}"`);
  await page.keyboard.press("ArrowLeft");
  const weekBack = snapshot.days[snapshot.days.length - 8];
  const stepped = await readout();
  check(stepped === says(weekBack), `ArrowLeft reads "${stepped}", expected a week back, "${says(weekBack)}"`);
  await page.keyboard.press("Tab");
  check(/Less[\s\S]*More/.test(await readout()), "the heatmap readout keeps a day after focus leaves");
  await context.close();

  // A phone visitor must be able to reach the oldest week: the heatmap's own
  // scroller carries the overflow, so the page never does.
  const phone = await browser.newContext({ viewport: { width: 320, height: 844 } });
  await routeSiteOrigin(phone, new Set());
  const small = await phone.newPage();
  await small.goto(`${origin}/`, { waitUntil: "networkidle" });
  const oldestLeft = await small.evaluate(() => {
    const oldest = document.querySelector("#activity [data-day]");
    if (!oldest) return null;
    oldest.scrollIntoView({ behavior: "instant", inline: "start", block: "nearest" });
    return Math.round(oldest.getBoundingClientRect().left);
  });
  check(
    oldestLeft !== null && oldestLeft >= 0,
    `at 320px the oldest heatmap week sits at ${oldestLeft}px and cannot be scrolled into view`,
  );
  await phone.close();
}

// Sections reveal as they scroll in and snap flush near their tops. Content
// must never end up stuck hidden: it starts hidden below the fold, is fully
// shown once scrolled through, the footer stays reachable despite snapping,
// and with reduced motion everything is shown from the start.
async function motionChecks(browser, origin) {
  const readState = () =>
    Array.from(document.querySelectorAll(".reveal")).map((el) => {
      const s = getComputedStyle(el);
      return { opacity: Number(s.opacity), clip: s.clipPath, id: el.closest("[id]")?.id };
    });
  const hidden = (els) =>
    els.filter((e) => e.opacity < 0.99 || (e.clip !== "none" && !/^inset\((\s*0(px|%)?\s*)+\)$/.test(e.clip)));

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, new Set());
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  const atLoad = await page.evaluate(readState);
  check(atLoad.length >= 20, `only ${atLoad.length} elements reveal on scroll`);
  check(
    hidden(atLoad).some((e) => e.id === "github"),
    "the GitHub band is fully shown before it is scrolled to; the scroll reveal is not running",
  );
  const step = await page.evaluate(() => Math.round(window.innerHeight / 3));
  for (let y = 0; ; y += step) {
    const at = await page.evaluate((top) => {
      window.scrollTo({ top, behavior: "instant" });
      return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    }, y);
    await page.waitForTimeout(60);
    if (at) break;
  }
  await page.waitForTimeout(700);
  const after = hidden(await page.evaluate(readState));
  check(
    after.length === 0,
    `${after.length} revealed elements are still hidden after scrolling through, first in #${after[0] && after[0].id}`,
  );
  const footerShown = await page.evaluate(() => {
    const r = document.querySelector("footer").getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom <= window.innerHeight + 1;
  });
  check(footerShown, "the footer cannot be scrolled into view; snapping pulls the page back up");
  await context.close();

  const snapAt = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 } });
    await routeSiteOrigin(ctx, new Set());
    const pg = await ctx.newPage();
    await pg.goto(`${origin}/`, { waitUntil: "networkidle" });
    const value = await pg.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType);
    await ctx.close();
    return value;
  };
  check((await snapAt(390)) === "none", "sections snap on a 390px phone; snapping is for tablet width and up");
  // Chrome serialises "y proximity" as "y": proximity is the default strictness.
  check((await snapAt(1280)).startsWith("y"), "sections do not snap at 1280px");

  const calm = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await routeSiteOrigin(calm, new Set());
  const still = await calm.newPage();
  await still.goto(`${origin}/`, { waitUntil: "networkidle" });
  const calmHidden = hidden(await still.evaluate(readState));
  check(calmHidden.length === 0, `with reduced motion ${calmHidden.length} elements start hidden`);
  const calmHero = await still.evaluate(readHero);
  check(calmHero.running === 0, `with reduced motion ${calmHero.running} hero animations still run`);
  check(calmHero.hidden === 0, `with reduced motion ${calmHero.hidden} hero elements start hidden`);
  check(calmHero.digits === calmHero.parked, "with reduced motion the hero total is not parked on its value");
  await calm.close();
}

// The hero's load sequence: the name, photo card, lede and links, every day
// of the heatmap and each digit of the total animate in, and all of it has
// landed, fully shown, a few seconds after load.
const readHero = () => {
  const els = Array.from(document.querySelectorAll(".hero-title, .hero-card, .hero-rise, .heat-cell"));
  const shown = (el) => {
    const s = getComputedStyle(el);
    return Number(s.opacity) >= 0.99 && (s.clipPath === "none" || !/inset\((?!-|0)/.test(s.clipPath));
  };
  const strips = Array.from(document.querySelectorAll(".odometer-strip"));
  const em = (el) => parseFloat(getComputedStyle(el).fontSize);
  return {
    count: els.length,
    hidden: els.filter((el) => !shown(el)).length,
    running: document.getAnimations().filter((a) => a.playState === "running" && a.animationName && /^(title-wipe|card-wipe|rise|heat-pop|fade-in|odometer-roll)$/.test(a.animationName)).length,
    digits: strips.length,
    parked: strips.filter((el) => {
      const y = parseFloat(getComputedStyle(el).translate.split(" ")[1] || "0");
      const d = Number(el.parentElement.style.getPropertyValue("--d"));
      return Math.abs(y + (10 + d) * em(el)) < 0.5;
    }).length,
  };
};

async function heroMotionChecks(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, new Set());
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "load" });
  const early = await page.evaluate(readHero);
  check(early.count >= 370, `the hero animates only ${early.count} elements; expected the name, card, intro and every day`);
  check(early.running > 0 || early.hidden > 0, "the hero load sequence is not running");
  await page.waitForTimeout(3500);
  const landed = await page.evaluate(readHero);
  check(landed.running === 0, `${landed.running} hero animations are still running 3.5s after load`);
  check(landed.hidden === 0, `${landed.hidden} hero elements are still hidden 3.5s after load`);
  check(landed.digits > 0 && landed.digits === landed.parked, `${landed.digits - landed.parked} digits of the hero total did not land on their value`);
  await context.close();
}

async function noScriptChecks(browser, origin) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: false,
  });
  await routeSiteOrigin(context, new Set());
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: "load" });
  const heroAtRest = await page.evaluate(() => {
    const h1 = document.querySelector("#hero h1");
    if (!h1) return { present: false };
    const style = getComputedStyle(h1);
    return { present: true, opacity: style.opacity, visibility: style.visibility };
  });
  check(heroAtRest.present, "no hero heading with JavaScript disabled");
  check(
    heroAtRest.present && heroAtRest.opacity === "1" && heroAtRest.visibility === "visible",
    `hero heading is not visible at rest without JavaScript (opacity ${heroAtRest.opacity})`,
  );
  await context.close();
}

async function clipboardChecks(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await routeSiteOrigin(context, new Set());
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("clipboard refused")) },
    });
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  const button = page.locator('footer button[aria-label="Copy email address"]');
  const buttons = await button.count();
  check(buttons === 1, `expected one copy button in the footer, found ${buttons}`);
  if (buttons !== 1) {
    await context.close();
    return;
  }
  await button.click();
  await page.waitForTimeout(150);
  const after = await page.evaluate(() => ({
    label: document.querySelector('footer button[aria-label="Copy email address"]')?.textContent,
    selection: String(window.getSelection()),
  }));
  check(pageErrors.length === 0, `copy button threw when the clipboard was refused: ${pageErrors[0]}`);
  check(
    !/copied/i.test(after.label || ""),
    'copy button claims "Copied" although the clipboard was refused',
  );
  check(
    after.selection.includes("@"),
    "when the clipboard is refused the email address is not selected for the visitor",
  );
  await context.close();
}

async function main() {
  if (staticChecks()) return;

  const { server, origin } = await serve();
  const browser = await chromium.launch();
  try {
    const summary = await desktopChecks(browser, origin);
    await phoneChecks(browser, origin);
    await laterYearChecks(browser, origin);
    await rolesChecks(browser, origin);
    await githubChecks(browser, origin);
    await motionChecks(browser, origin);
    await heroMotionChecks(browser, origin);
    await noScriptChecks(browser, origin);
    await clipboardChecks(browser, origin);
    console.log(
      `height ${summary.height}px, ${summary.words} words in <main>, ${summary.links} distinct links, screenshots in app/.screenshots/`,
    );
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
