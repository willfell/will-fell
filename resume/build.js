#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(__dirname, "index.html");
const EXPECTED_PAGES = 2;

// The site serves app/public/ directly, but the deploy workflow's postbuild
// step (yarn copy-resume) overwrites it with app/src/assets/, so both copies
// must stay in sync.
const OUTPUTS = [
  path.join(ROOT, "app", "public", "WillFellhoelterResume.pdf"),
  path.join(ROOT, "app", "src", "assets", "WillFellhoelterResume.pdf"),
];

function countPages(pdfBuffer) {
  const text = pdfBuffer.toString("latin1");
  const matches = text.match(/\/Type\s*\/Page(?![s\w])/g);
  return matches ? matches.length : 0;
}

async function main() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${SOURCE}`, { waitUntil: "networkidle" });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
    });

    const pages = countPages(pdf);
    if (pages !== EXPECTED_PAGES) {
      console.error(
        `Resume rendered to ${pages} page(s); expected exactly ${EXPECTED_PAGES}. ` +
          "Trim content in resume/index.html or tighten resume/resume.css.",
      );
      process.exit(1);
    }

    for (const out of OUTPUTS) {
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, pdf);
      console.log(`Wrote ${path.relative(ROOT, out)} (${pages} pages)`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
