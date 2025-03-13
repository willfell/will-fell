import { FC, memo } from "react";
import { experience, SectionId } from "../../../data/data";
import Section from "../../Layout/Section";
import TimelineItem from "./TimelineItem";
import Skills from "./Skills";

const Experience: FC = memo(() => {
  return (
    <Section
      className="bg-gradient-to-b from-earth-tan/40 to-white"
      sectionId={SectionId.Experience}
    >
      <div className="flex flex-col space-y-8">
        {" "}
        {/* Changed from space-y-16 to space-y-8 */}
        {/* Work Experience Section with enhanced visual styling */}
        <div className="bg-slate-blue/5 rounded-xl p-8 shadow-sm border border-slate-blue/10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-forest-green inline-block relative">
              Professional Experience
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-sage-green"></span>
            </h2>
            <p className="text-stone-600 mt-4 max-w-3xl">
              My journey as a professional, highlighting roles where I've made
              significant contributions and developed my expertise.
            </p>
          </div>

          <div className="mt-12">
            {experience.map((item, index) => (
              <TimelineItem
                item={item}
                key={`${item.title}-${index}`}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
        {/* Skills Section with different background color for visual variety */}
        <div className="bg-forest-green/5 rounded-xl p-8 shadow-sm border border-forest-green/10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-forest-green inline-block relative">
              Skills & Expertise
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-sage-green"></span>
            </h2>
            <p className="text-stone-600 mt-4 max-w-3xl">
              Technologies and competencies I've mastered throughout my career.
            </p>
          </div>

          <div className="mt-12">
            <Skills />
          </div>
        </div>
      </div>
    </Section>
  );
});

Experience.displayName = "Experience";
export default Experience;
