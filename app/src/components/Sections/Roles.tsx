import { FC, Fragment, memo } from "react";

import { roles } from "../../data/data";
import Section from "../Layout/Section";

const Roles: FC = memo(() => (
  <Section className="bg-cream" sectionId="experience">
    <h2 className="mb-8 text-3xl font-bold text-forest-green">Experience</h2>
    <dl className="grid gap-y-4 md:grid-cols-[12rem_1fr] md:gap-x-6 md:gap-y-3">
      {roles.map(({ dates, employer, title, line }) => (
        <Fragment key={`${employer}-${title}`}>
          <dt className="whitespace-nowrap font-mono text-sm tracking-wide text-stone-600">
            {dates}
          </dt>
          <dd className="mb-2 leading-relaxed md:mb-0">
            <span className="font-semibold">{employer}</span> · {title} ·{" "}
            <span className="text-stone-600">{line}</span>
          </dd>
        </Fragment>
      ))}
    </dl>
  </Section>
));

Roles.displayName = "Roles";
export default Roles;
