import { FC, memo, useEffect } from "react";
import { skills } from "../../../data/data";
import SkillGroup from "./SkillGroup";

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
    <div className="flex flex-col gap-y-8">
      {skills.map((skillGroup, index) => (
        <SkillGroup
          key={`${skillGroup.name}-${index}`}
          skillGroup={skillGroup}
          delay={index * 100}
        />
      ))}
    </div>
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
