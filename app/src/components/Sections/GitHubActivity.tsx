import { CSSProperties, FC, memo } from "react";

import { githubHeading, githubHref, repos } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { ExternalGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";

// The year's heatmap and total live in the hero; this band is where the
// public code is.
const GitHubActivity: FC = memo(() => (
  <Section
    innerClassName="flex flex-col gap-10 pb-16 pt-14 md:pb-24 md:pt-20 xl:pb-[120px] xl:pt-[88px]"
    sectionId="github"
  >
    <SectionHeader
      action={
        <a
          className="group inline-flex min-h-[48px] items-center gap-2 border border-paper px-5 font-mono text-sm text-paper transition-colors duration-200 hover:bg-paper hover:text-ink motion-reduce:transition-none"
          href={githubHref}
          onClick={() => trackEvent("Social Click", { platform: "GitHub" })}
          rel="noopener noreferrer"
          target="_blank"
        >
          github.com/willfell
          <ExternalGlyph className="glyph-out" />
        </a>
      }
      heading={githubHeading}
      label="GitHub"
      number="04"
    />
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {repos.map(({ name, href, description, meta }, i) => (
        <li
          className="reveal flex flex-col gap-2.5 border border-line-mid bg-surface p-[22px]"
          key={name}
          style={{ "--i": i } as CSSProperties}
        >
          <a
            className="link group inline-flex min-h-[28px] items-center gap-1.5 self-start font-mono text-[15px] font-semibold text-paper"
            href={href}
            onClick={() => trackEvent("Project Click", { project: name })}
            rel="noopener noreferrer"
            target="_blank"
          >
            {name}
            <ExternalGlyph className="glyph-out" />
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
