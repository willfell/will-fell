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
