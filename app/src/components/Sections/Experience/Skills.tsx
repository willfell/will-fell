import { FC, memo, useEffect } from "react";
import { skills, SectionId } from "../../../data/data";
import SkillGroup from "./SkillGroup";
import Section from "../../Layout/Section";

const Skills: FC = memo(() => {
  useEffect(() => {
    // Try to trigger skill animations when component mounts
    if (typeof window !== "undefined") {
      // Force a refresh of skills animation after component is fully rendered
      const timer = setTimeout(() => {
        if (window.runSkillsAnimation) {
          window.runSkillsAnimation();
        } else {
          // Fallback if the global function isn't available
          import("../../../utils/skillAnimations").then((module) => {
            if (module.default) module.default();
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }

    // Return a no-op function for paths where window is undefined
    return () => {};
  }, []);

  return (
    <Section className="bg-earth-tan/10" sectionId={SectionId.Skills}>
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
          <div className="flex flex-col gap-y-8">
            {skills.map((skillGroup, index) => (
              <SkillGroup
                key={`${skillGroup.name}-${index}`}
                skillGroup={skillGroup}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
});

// Add this to make window.runSkillsAnimation available for TypeScript
declare global {
  interface Window {
    runSkillsAnimation?: () => void;
  }
}

Skills.displayName = "Skills";
export default Skills;
