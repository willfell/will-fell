import { FC, memo } from "react";

import { positions, positionsIntro } from "../../data/data";
import Section from "../Layout/Section";
import SectionHeader from "../Layout/SectionHeader";

const Positions: FC = memo(() => (
  <Section
    band="pine"
    className="border-t border-line"
    innerClassName="py-16 md:py-24 xl:pb-[88px] xl:pt-[120px]"
    sectionId="positions"
  >
    <div className="flex flex-col gap-10">
      <SectionHeader
        band="pine"
        heading={positionsIntro.heading}
        label="Positions"
        lede={positionsIntro.lede}
        number="04"
      />
      <ol className="grid grid-cols-1 gap-x-14 md:grid-cols-2">
        {positions.map(({ title, body }, i) => (
          <li className="flex gap-5 border-t border-line-pine py-[30px]" key={title}>
            <span className="shrink-0 pt-[9px] font-mono text-[13px] text-amber">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2.5">
              <h3 className="text-2xl font-bold leading-[1.12] tracking-[-0.02em] [font-stretch:112%] [text-wrap:balance] md:text-[28px] xl:text-[32px]">
                {title}
              </h3>
              <p className="text-[16.5px] leading-relaxed text-paper-2 [text-wrap:pretty]">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </Section>
));

Positions.displayName = "Positions";
export default Positions;
