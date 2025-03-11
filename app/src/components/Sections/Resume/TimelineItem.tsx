import { FC, memo } from 'react';
import { type TimelineItem as TimelineItemType } from '../../../data/dataDef';

const TimelineItem: FC<{ item: TimelineItemType; delay?: number }> = memo(({ item, delay = 0 }) => {
  const { title, date, location, content } = item;
  return (
    <div
      className="flex flex-col pb-8 text-center last:pb-0 md:text-left animate-on-scroll opacity-0 transition-all duration-1000 hover:translate-x-1 hover:shadow-sm hover:bg-earth-tan/40 rounded-lg p-3"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col pb-4">
        <h2 className="text-xl font-bold text-forest-green">{title}</h2>
        <div className="flex items-center justify-center gap-x-2 md:justify-start">
          <span className="flex-1 text-sm font-medium italic text-sage-green sm:flex-none">{location}</span>
          <span className="text-sage-green">•</span>
          <span className="flex-1 text-sm text-sage-green sm:flex-none">{date}</span>
        </div>
      </div>
      <div className="prose prose-forest-green text-stone-black max-w-none">
        {content}
      </div>
    </div>
  );
});

TimelineItem.displayName = 'TimelineItem';
export default TimelineItem;