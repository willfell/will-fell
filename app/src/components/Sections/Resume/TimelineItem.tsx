import { FC, memo } from 'react';
import { TimelineItem } from '../../../data/dataDef';
import Image from 'next/image';

const TimelineItemComponent: FC<{ item: TimelineItem; delay?: number }> = memo(({ item, delay = 0 }) => {
  const { title, location, content, date, imageSrc } = item;
  return (
    <div
      className="flex flex-col pb-8 text-center last:pb-0 md:text-left animate-on-scroll"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col pb-4">
        <div className="flex items-center justify-center gap-x-2 md:justify-start">
          <span className="flex-1 text-sm font-medium italic text-stone-black sm:flex-none">{location}</span>
          <span className="flex-1 text-sm text-stone-black sm:flex-none">•</span>
          <span className="flex-1 text-sm text-stone-black sm:flex-none">{date}</span>
        </div>
        <div className="flex items-center justify-center gap-x-4 md:justify-start">
          <h3 className="text-lg font-bold text-stone-black">{title}</h3>
          {imageSrc && (
            <div className="flex justify-end flex-grow">
              <div className="relative h-20 w-40">
                <Image
                  alt={`${location} logo`}
                  className="object-contain"
                  layout="fill"
                  src={imageSrc}
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="timeline-content">
        {content}
      </div>
    </div>
  );
});

TimelineItemComponent.displayName = 'TimelineItem';
export default TimelineItemComponent;