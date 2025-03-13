import { FC, memo, PropsWithChildren } from 'react';

const ExperienceSection: FC<PropsWithChildren<{ title: string }>> = memo(({ title, children }) => {
  return (
    <div className="grid grid-cols-1 gap-y-4 py-8 first:pt-0 last:pb-0 md:grid-cols-4 animate-on-scroll">
      <div className="col-span-1 flex justify-center md:justify-start">
        <div className="relative h-max group">
          <h2 className="text-xl font-bold uppercase text-forest-green">{title}</h2>
          <span className="absolute inset-x-0 -bottom-1 border-b-2 border-sage-green transform origin-left transition-transform duration-300 group-hover:scale-x-110" />
        </div>
      </div>
      <div className="col-span-1 flex flex-col md:col-span-3">{children}</div>
    </div>
  );
});

ExperienceSection.displayName = 'ExperienceSection';
export default ExperienceSection;