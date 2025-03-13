import { FC, memo, useState, useRef, useEffect } from "react";
import { TimelineItem } from "../../../data/dataDef";
import Image from "next/image";

interface TimelineItemProps {
  item: TimelineItem;
  delay?: number;
}

const TimelineItemComponent: FC<TimelineItemProps> = memo(
  ({ item, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    // Track if component is in viewport
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        {
          threshold: 0.2, // Trigger when 20% of the element is visible
        },
      );

      if (itemRef.current) {
        observer.observe(itemRef.current);
      }

      return () => {
        if (itemRef.current) {
          observer.unobserve(itemRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={itemRef}
        className={`
        flex flex-col pb-16 text-center last:pb-0 md:text-left
        transition-all duration-700 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 relative">
          {/* Removed the connector line that was here */}

          {/* Left Column - Company info with centered logo */}
          <div className="md:col-span-3 flex flex-col items-center md:sticky md:top-32 md:self-start z-10 bg-transparent">
            {item.imageSrc && (
              <div className="relative h-40 w-40 mx-auto mb-4 transition-all duration-500 overflow-hidden rounded-lg shadow-md border-2 border-sage-green/30">
                <Image
                  alt={item.title}
                  src={item.imageSrc}
                  fill
                  className="object-contain p-2 transition-all"
                  style={{
                    objectPosition: "center", // Centering the logo
                  }}
                />
              </div>
            )}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-sage-green/10 w-full text-center">
              <h3 className="text-xl font-bold text-forest-green">
                {item.title}
              </h3>
              <p className="text-stone-600 font-medium mt-1">{item.location}</p>
              <p className="text-stone-500 text-sm bg-sage-green/20 inline-block px-3 py-1 rounded-full mt-2">
                {item.date}
              </p>
            </div>
          </div>

          {/* Right Column - Content with enhanced styling and more width */}
          <div className="md:col-span-9 timeline-content">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md border border-sage-green/20 hover:shadow-lg transition-all duration-300 hover:border-sage-green/40">
              {item.content}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TimelineItemComponent.displayName = "TimelineItem";
export default TimelineItemComponent;
