import { FC, memo } from "react";

import { roles } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import Section from "../Layout/Section";

const Roles: FC = memo(() => (
  <Section className="bg-cream" sectionId="experience">
    <h2 className="mb-8 text-3xl font-bold text-forest-green">Experience</h2>
    <ul className="space-y-4 md:space-y-3">
      {roles.map(({ dates, employer, title, line, bullets }) => (
        <li key={`${employer}-${title}`}>
          <details
            className="group"
            onToggle={(e) =>
              e.currentTarget.open &&
              trackEvent("Role Expand", { role: `${employer} ${title}` })
            }
          >
            <summary className="grid cursor-pointer list-none gap-y-1 rounded md:grid-cols-[12rem_1fr] md:gap-x-6 [&::-webkit-details-marker]:hidden">
              <span className="whitespace-nowrap font-mono text-sm leading-relaxed tracking-wide text-stone-600">
                {dates}
              </span>
              <span className="leading-relaxed">
                <span className="font-semibold">{employer}</span> · {title} ·{" "}
                <span className="text-stone-600">{line}</span>{" "}
                <svg
                  aria-hidden="true"
                  className="inline-block h-3 w-3 align-baseline text-forest-green transition-transform group-open:rotate-90"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M4 2l5 4-5 4z" />
                </svg>
              </span>
            </summary>
            <ul className="mb-3 mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-stone-700 marker:text-stone-500 md:ml-[13.5rem]">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ul>
  </Section>
));

Roles.displayName = "Roles";
export default Roles;
