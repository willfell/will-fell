import { FC, memo } from "react";

import { aboutData } from "../../data/data";
import Section from "../Layout/Section";

const About: FC = memo(() => (
  <Section
    className="bg-cream px-4 pb-16 md:pb-20 lg:px-8"
    noPadding
    sectionId="about"
  >
    <div className="mx-auto max-w-screen-lg">
      <h2 className="sr-only">About</h2>
      <p className="max-w-prose text-[17px] leading-relaxed">
        {aboutData.description}
      </p>
    </div>
  </Section>
));

About.displayName = "About";
export default About;
