import { CSSProperties, FC, memo } from "react";

import { featuredWork, selectedWorkIntro, workItems } from "../../data/data";
import { WorkItem } from "../../data/dataDef";
import { trackEvent } from "../../utils/analytics";
import { ExternalGlyph, FlowArrowGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";
import Flow from "./Flow";

const contextClass = "font-mono text-xs uppercase tracking-[0.08em] text-muted";

const WorkCard: FC<WorkItem> = memo(({ context, title, description, metric }) => (
    <article className="flex h-full flex-col gap-3.5 border border-line-mid bg-ink p-7">
      <p className={contextClass}>{context}</p>
      <h3 className="text-[26px] font-[750] leading-[1.1] tracking-[-0.02em] [font-stretch:115%] [text-wrap:balance]">
        {title}
      </h3>
      <p className="text-[15.5px] leading-relaxed text-paper-2 [text-wrap:pretty]">
        {description}
      </p>
      <p className="mt-auto flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-t border-line pt-[18px] text-[30px] font-bold leading-[1.1] tracking-[-0.02em] [font-stretch:120%]">
        {metric.before && (
          <>
            <span className="text-muted line-through decoration-2">{metric.before}</span>
            <span className="sr-only">to</span>
            <FlowArrowGlyph className="self-center" />
          </>
        )}
        <span>{metric.value}</span>
      </p>
      <p className="font-mono text-xs text-muted">{metric.label}</p>
    </article>
));

WorkCard.displayName = "WorkCard";

const SelectedWork: FC = memo(() => (
  <Section className="border-t border-line" sectionId="work">
    <div className="flex flex-col gap-10">
      <SectionHeader
        heading={selectedWorkIntro.heading}
        label="Selected work"
        lede={selectedWorkIntro.lede}
        number="02"
      />
      {featuredWork.map(({ context, title, description, link, flowLabel, flow }) => (
        <article
          className="reveal flex flex-wrap items-center gap-x-14 gap-y-8 border border-line-mid bg-surface p-6 md:p-8 xl:p-10"
          key={title}
        >
          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5">
            <p className={contextClass}>{context}</p>
            <h3 className="text-[28px] font-[750] leading-[1.05] tracking-[-0.02em] [font-stretch:115%] [text-wrap:balance] md:text-[34px] xl:text-[38px]">
              {title}
            </h3>
            <p className="max-w-[52ch] text-[17px] leading-relaxed text-paper-2 [text-wrap:pretty]">
              {description}
            </p>
            {link && (
              <a
                className="link group inline-flex min-h-[44px] items-center gap-1.5 self-start font-mono text-[13.5px] text-paper"
                href={link.href}
                onClick={() => trackEvent("Project Click", { project: link.text })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.text}
                <ExternalGlyph className="glyph-out" />
              </a>
            )}
          </div>
          <Flow label={flowLabel} nodes={flow} />
        </article>
      ))}
      <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {workItems.map((item, i) => (
          <li className="reveal" key={item.title} style={{ "--i": i } as CSSProperties}>
            <WorkCard {...item} />
          </li>
        ))}
      </ul>
    </div>
  </Section>
));

SelectedWork.displayName = "SelectedWork";
export default SelectedWork;
