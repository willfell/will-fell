import { FC, memo } from "react";

import { howIWork } from "../../data/data";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";

const HowIWork: FC = memo(() => (
  <Section sectionId="how">
    <div className="flex flex-col gap-10">
      <SectionHeader
        heading={howIWork.heading}
        label="How I work"
        lede={howIWork.lede}
        number="01"
      />
      <ol className="grid grid-cols-1 border-r border-t border-r-line border-t-paper md:grid-cols-2 xl:grid-cols-4">
        {howIWork.steps.map(({ title, body, example }, i) => (
          <li className="flex flex-col gap-3.5 border-l border-line py-6 pl-5 pr-6" key={title}>
            <span className="font-mono text-xs text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl font-bold leading-[1.1] tracking-[-0.015em] [font-stretch:115%]">
              {title}
            </h3>
            <p className="text-base leading-relaxed text-paper-2 [text-wrap:pretty]">{body}</p>
            <p className="mt-auto border-t border-dashed border-line-mid pt-3 font-mono text-xs leading-relaxed text-muted">
              {example}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </Section>
));

HowIWork.displayName = "HowIWork";
export default HowIWork;
