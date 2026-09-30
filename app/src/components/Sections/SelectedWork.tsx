import { FC, memo } from "react";

import { featuredWork, selectedWorkIntro, workItems } from "../../data/data";
import { WorkItem } from "../../data/dataDef";
import { trackEvent } from "../../utils/analytics";
import { ExternalGlyph, FlowArrowGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";
import Flow from "./Flow";

const contextClass = "font-mono text-xs uppercase tracking-[0.08em] text-muted";

const WorkCard: FC<WorkItem> = memo(
  ({ context, title, description, metric, install, href, hrefText, hrefLabel }) => (
    <article className="flex h-full flex-col gap-3.5 border border-line-mid p-7">
      <p className={contextClass}>{context}</p>
      <h3 className="text-[26px] font-[750] leading-[1.1] tracking-[-0.02em] [font-stretch:115%] [text-wrap:balance]">
        {title}
      </h3>
      <p className="text-[15.5px] leading-relaxed text-paper-2 [text-wrap:pretty]">
        {description}
      </p>
      {install && (
        <pre className="mt-auto flex flex-col overflow-x-auto border border-line bg-soot px-4 py-3.5 font-mono text-[12.5px] leading-[1.8] text-paper">
          {install.map((command) => (
            <code className="whitespace-nowrap" key={command}>
              <span className="select-none text-amber">$</span> {command}
            </code>
          ))}
        </pre>
      )}
      {metric && (
        <>
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
        </>
      )}
      {href && (
        <a
          aria-label={hrefLabel}
          className="inline-flex min-h-[44px] items-center gap-1.5 font-mono text-[13.5px] text-paper underline decoration-1 underline-offset-[5px]"
          href={href}
          onClick={() => trackEvent("Project Click", { project: title })}
          rel="noopener noreferrer"
          target="_blank"
        >
          {hrefText}
          <ExternalGlyph />
        </a>
      )}
    </article>
  ),
);

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
      {featuredWork.map(({ context, title, description, flowLabel, flow }) => (
        <article
          className="flex flex-wrap items-center gap-x-14 gap-y-8 border border-line-mid bg-surface p-6 md:p-8 xl:p-10"
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
          </div>
          <Flow label={flowLabel} nodes={flow} />
        </article>
      ))}
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {workItems.map((item) => (
          <li key={item.title}>
            <WorkCard {...item} />
          </li>
        ))}
      </ul>
    </div>
  </Section>
));

SelectedWork.displayName = "SelectedWork";
export default SelectedWork;
