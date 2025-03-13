import { FC, memo } from 'react';
import { SkillGroup as SkillGroupType } from '../../../data/dataDef';

interface SkillGroupProps {
  skillGroup: SkillGroupType;
  delay?: number;
}

const SkillGroup: FC<SkillGroupProps> = memo(({ skillGroup, delay = 0 }) => {
  return (
    <div
      className="skills-section animate-on-scroll"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative inline-block">
        <h3 className="text-xl font-bold mb-4">{skillGroup.name}</h3>
        {/* Fixed underline that doesn't extend beyond container */}
        <span className="absolute inset-x-0 -bottom-1 border-b-2 border-sage-green"></span>
      </div>
      
      <div className="space-y-4 mt-6">
        {skillGroup.skills.map((skill, skillIndex) => (
          <div className="skill-item" key={`${skill.name}-${skillIndex}`}>
            <div className="flex justify-between mb-1">
              {skill.logo && (
                <div className="flex items-center gap-x-2">
                  <img src={skill.logo} alt={skill.name} className="h-6 w-6" />
                  <span className="font-medium">{skill.name}</span>
                </div>
              )}
              {!skill.logo && <span className="font-medium">{skill.name}</span>}
              <span className="text-sm">{skill.level}/10</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="skill-progress-bar h-2 bg-forest-green rounded-full"
                data-width={`${(skill.level / (skill.max || 10)) * 100}%`}
                style={{width: '0%'}}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SkillGroup.displayName = 'SkillGroup';
export default SkillGroup;