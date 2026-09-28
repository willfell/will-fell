import { FC, memo } from "react";

import { selectedWork } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import Section from "../Layout/Section";

const SelectedWork: FC = memo(() => (
  <Section className="bg-canyon-tan" sectionId="work">
    <h2 className="mb-8 text-3xl font-bold text-forest-green">Selected work</h2>
    <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
      {selectedWork.map(({ title, context, description, href }) => (
        <li className="flex flex-col gap-2" key={title}>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="font-mono text-sm tracking-wide text-stone-600">
            {context}
          </p>
          <p className="leading-relaxed">{description}</p>
          {href && (
            <a
              aria-label={`${title} on GitHub`}
              className="mt-auto pt-2 font-medium text-deep-forest underline underline-offset-4 hover:text-forest-green"
              href={href}
              onClick={() => trackEvent("Project Click", { project: title })}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub ↗
            </a>
          )}
        </li>
      ))}
    </ul>
  </Section>
));

SelectedWork.displayName = "SelectedWork";
export default SelectedWork;
