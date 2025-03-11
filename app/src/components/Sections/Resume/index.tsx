import { FC, memo } from 'react';

import { education, experience, SectionId, skills } from '../../../data/data';
import Section from '../../Layout/Section';
import ResumeSection from './ResumeSection';
import { SkillGroup } from './Skills';
import TimelineItem from './TimelineItem';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

const Resume: FC = memo(() => {
  const sectionRef = useIntersectionObserver(0.05, '-50px 0px -100px 0px');

  return (
    <Section className="bg-earth-tan/50" sectionId={SectionId.Resume}>
      <div ref={sectionRef} className="flex flex-col divide-y-2 divide-sage-green/50">
        <ResumeSection title="Education">
          {education.map((item, index) => (
            <TimelineItem
              item={item}
              key={`${item.title}-${index}`}
              delay={index * 100}
            />
          ))}
        </ResumeSection>
        <ResumeSection title="Work">
          {experience.map((item, index) => (
            <TimelineItem
              item={item}
              key={`${item.title}-${index}`}
              delay={index * 100}
            />
          ))}
        </ResumeSection>
        <ResumeSection title="Skills">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {skills.map((skillgroup, index) => (
              <SkillGroup
                key={`${skillgroup.name}-${index}`}
                skillGroup={skillgroup}
                delay={index * 100}
              />
            ))}
          </div>
        </ResumeSection>
      </div>
    </Section>
  );
});

Resume.displayName = 'Resume';
export default Resume;