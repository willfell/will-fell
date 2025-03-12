import { FC, memo, useMemo } from 'react';
import Image from 'next/image';
import { Skill as SkillType, SkillGroup as SkillGroupType } from '../../../data/dataDef';

export const SkillGroup: FC<{ skillGroup: SkillGroupType; delay?: number }> = memo(
  ({ skillGroup, delay = 0 }) => {
    const { name, skills } = skillGroup;
    return (
      <div
        className="flex flex-col animate-on-scroll skills-section"
        style={{ transitionDelay: `${delay}ms` }}
      >
        <span className="text-center text-xl font-bold text-stone-black mb-4 skill-group-title">{name}</span>
        <div className="flex flex-col gap-y-6">
          {skills.map((skill, index) => (
            <Skill key={`${skill.name}-${index}`} skill={skill} delay={index * 100} />
          ))}
        </div>
      </div>
    );
  },
);

SkillGroup.displayName = 'SkillGroup';

export const Skill: FC<{ skill: SkillType; delay?: number }> = memo(({ skill, delay = 0 }) => {
  const { name, level, max = 10, logo } = skill;
  const percentage = useMemo(() => Math.round((level / max) * 100), [level, max]);

  return (
    <div
      className="flex flex-col animate-on-scroll skill-item"
      style={{ transitionDelay: `${delay + 200}ms` }}
    >
      <div className="flex items-center gap-3 ml-2 mb-2">
        <div className="h-6 w-6 relative flex-shrink-0">
          {logo && (
            <Image 
              src={logo} 
              alt={`${name} logo`} 
              width={24} 
              height={24} 
              className="object-contain"
              unoptimized
            />
          )}
        </div>
        <span className="text-sm font-medium text-stone-black">{name}</span>
      </div>
      <div className="h-6 w-full overflow-hidden rounded-full bg-stone-300">
        <div
          className="h-full rounded-full bg-forest-green skill-progress-bar"
          data-width={`${percentage}%`}
        />
      </div>
    </div>
  );
});

Skill.displayName = 'Skill';