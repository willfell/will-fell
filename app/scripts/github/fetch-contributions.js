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
    for (const p of existing.problems) warn(`github:fetch skipped, but the committed snapshot is unusable: ${p}`);
    if (existing.problems.length) process.exit(1);
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
