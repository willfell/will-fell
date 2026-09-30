import { FC, memo } from "react";

import { stats, statsCaption } from "../../data/data";
import Section from "../Layout/Section";

const Glance: FC = memo(() => (
  <Section
    className="border-b border-line"
    innerClassName="flex flex-col gap-4 pb-5"
    sectionId="glance"
  >
    <dl className="grid grid-cols-2 border-r border-line md:grid-cols-3 xl:grid-cols-5">
      {stats.map(({ value, label }) => (
        <div className="flex flex-col gap-3 border-l border-line px-5 pb-[30px] pt-7" key={label}>
          <dt className="order-2 font-mono text-[11.5px] uppercase leading-normal tracking-[0.06em] text-muted">
            {label}
          </dt>
          <dd className="order-1 text-[clamp(28px,8.75vw,34px)] font-bold leading-none tracking-[-0.03em] [font-stretch:125%] md:text-[44px] xl:text-[52px]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
    <p className="font-mono text-xs leading-normal text-muted">{statsCaption}</p>
  </Section>
));

Glance.displayName = "Glance";
export default Glance;
