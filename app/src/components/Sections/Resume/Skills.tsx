import { FC, memo, PropsWithChildren, useMemo } from 'react';

import { Skill as SkillType, SkillGroup as SkillGroupType } from '../../../data/dataDef';

export const SkillGroup: FC<PropsWithChildren<{ skillGroup: SkillGroupType; delay?: number }>> = memo(
  ({ skillGroup, delay = 0 }) => {
    const { name, skills } = skillGroup;
    return (
      <div
        className="flex flex-col animate-on-scroll opacity-0 transition-all duration-1000"
        style={{ transitionDelay: `${delay}ms` }}
      >
        <span className="text-center text-lg font-bold text-stone-black">{name}</span>
        <div className="flex flex-col gap-y-2">
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
  const { name, level, max = 10 } = skill;
  const percentage = useMemo(() => Math.round((level / max) * 100), [level, max]);

  return (
    <div
      className="flex flex-col animate-on-scroll opacity-0 transition-all duration-700"
      style={{ transitionDelay: `${delay + 200}ms` }}
    >
      <span className="ml-2 text-sm font-medium text-stone-black">{name}</span>
      <div className="h-5 w-full overflow-hidden rounded-full bg-stone-300">
        <div
          className="h-full rounded-full bg-forest-green transition-all duration-1000 ease-out skill-progress-bar"
          style={{ width: `0%` }}
          data-width={`${percentage}%`}
        />
      </div>
    </div>
  );
});

Skill.displayName = 'Skill';