import { FC, memo } from "react";

import { education, experienceHeading, resumeHref, roles } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, PlusGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";
import Logo from "./Logo";

const dateClass = "w-[180px] shrink-0 whitespace-nowrap font-mono text-[13px] text-muted";
const orgClass = "flex min-w-0 flex-[1_1_240px] items-center gap-3 md:gap-4";
const nameClass = "flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3.5 gap-y-0.5";
const employerClass = "text-[21px] font-[750] tracking-[-0.015em] [font-stretch:115%]";

const Roles: FC = memo(() => (
  <Section sectionId="experience">
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
        number="01"
      />
      <ol className="border-t border-paper">
        {roles.map(({ dates, employer, logo, title, line, bullets }) => (
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
                <span className={orgClass}>
                  <Logo src={logo} />
                  <span className={nameClass}>
                    <span className={employerClass}>{employer}</span>
                    <span className="text-[17px]">{title}</span>
                    <span className="basis-full text-[15px] leading-normal text-muted">
                      {line}
                    </span>
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
        <li className="flex flex-wrap items-center gap-x-6 gap-y-2 py-[22px]">
          <span className={dateClass}>{education.year}</span>
          <span className={orgClass}>
            <Logo src={education.logo} />
            <span className={nameClass}>
              <span className={employerClass}>{education.school}</span>
              <span className="text-[17px]">{education.degree}</span>
            </span>
          </span>
        </li>
      </ol>
    </div>
  </Section>
));

Roles.displayName = "Roles";
export default Roles;
