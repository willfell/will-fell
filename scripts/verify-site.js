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
  check(
    fs.existsSync(pdf),
    "out/WillFellhoelterResume.pdf missing; run `yarn copy-resume`",
  );
  if (fs.existsSync(pdf)) {
    const sha = crypto
      .createHash("sha256")
      .update(fs.readFileSync(pdf))
      .digest("hex");
    check(sha === PDF_SHA256, `resume sha256 ${sha} is not the supplied PDF`);
  }
  if (failures.length) return;

  const { server, origin } = await serve(OUT);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });
    await page.goto(`${origin}/`, { waitUntil: "networkidle" });

    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    check(height <= MAX_HEIGHT, `page height ${height}px exceeds ${MAX_HEIGHT}px`);

    const words = await page.evaluate(() => {
      const main = document.querySelector("main");
      return main
        ? main.innerText.trim().split(/\s+/).filter(Boolean).length
        : -1;
    });
    check(words >= 0, "no <main> element on the page");
    check(words <= MAX_WORDS, `<main> has ${words} words, limit ${MAX_WORDS}`);

    const animated = await page.evaluate(
      () =>
        document.querySelectorAll('[class*="opacity-0"],[class*="animate-on-"]')
          .length,
    );
    check(
      animated === 0,
      `${animated} elements still carry opacity-0 or animate-on-* classes`,
    );

    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]")).map((a) =>
        a.getAttribute("href"),
      ),
    );
    for (const link of REQUIRED_LINKS) {
      check(
        hrefs.some((h) => h && h.startsWith(link)),
        `missing link ${link}`,
      );
    }

    const monoLoaded = await page.evaluate(() =>
      Array.from(document.fonts).some(
        (f) => f.family.replace(/["']/g, "") === "Fira Code" && f.status === "loaded",
      ),
    );
    check(monoLoaded, "Fira Code never loaded; mono labels are falling back");

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
        "sauce link": document.querySelector('#work a[href*="sauce"]'),
        "footer source line": document.querySelector('footer a[href*="will-fell"]'),
      };
      return Object.entries(targets).map(([name, el]) =>
        el ? { name, ratio: Math.round(ratio(el) * 100) / 100 } : { name, ratio: 0 },
      );
    });
    for (const { name, ratio } of contrast) {
      check(ratio >= 4.5, `${name} contrast ${ratio}:1 is below AA 4.5:1`);
    }

    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({
      path: path.join(SHOTS, "home-1280.png"),
      fullPage: true,
    });

    const phone = await browser.newPage({
      viewport: { width: PHONE_WIDTH, height: 844 },
    });
    await phone.goto(`${origin}/`, { waitUntil: "networkidle" });
    const scrollWidth = await phone.evaluate(
      () => document.documentElement.scrollWidth,
    );
    check(
      scrollWidth <= PHONE_WIDTH,
      `horizontal overflow at ${PHONE_WIDTH}px: scrollWidth ${scrollWidth}`,
    );
    await phone.screenshot({
      path: path.join(SHOTS, "home-390.png"),
      fullPage: true,
    });

    console.log(
      `height ${height}px, ${words} words in <main>, ${hrefs.length} links, screenshots in app/.screenshots/`,
    );
  } finally {
    await browser.close();
    server.close();
  }
}

main()
  .catch((error) =>
    failures.push(String(error && error.stack ? error.stack : error)),
  )
  .finally(() => {
    if (failures.length) {
      for (const f of failures) console.error(`FAIL ${f}`);
      process.exit(1);
    }
    console.log("PASS");
  });
