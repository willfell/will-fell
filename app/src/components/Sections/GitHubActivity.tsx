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
