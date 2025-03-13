import { FC, memo, useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Image from "next/image";
import { PortfolioItem } from "../../../data/dataDef";

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: () => void;
  isCompact?: boolean;
  hideDescription?: boolean;
}

const PortfolioCard: FC<PortfolioCardProps> = memo(
  ({ item, onClick, isCompact = false, hideDescription = false }) => {
    const { title, description, image, date, location, techStack } = item;
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={classNames(
          "relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 cursor-pointer transform",
          isCompact ? "h-64" : "h-72", // Increased height for compact cards to fit more info
          isHovered ? "scale-[1.02]" : "scale-100",
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image with zoom effect */}
        <div className="relative overflow-hidden h-full">
          <div
            className={classNames(
              "relative transition-all duration-500 ease-in-out h-full",
              isHovered ? "scale-110" : "scale-100",
            )}
          >
            <Image
              alt={title}
              src={image}
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Gradient overlay */}
          <div
            className={classNames(
              "absolute inset-0 bg-gradient-to-t from-forest-green via-forest-green/80 to-transparent transition-opacity duration-300",
              isHovered ? "opacity-90" : "opacity-75",
            )}
          ></div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-2">{title}</h3>

          {/* For work projects, show workplace and date */}
          {!hideDescription && (isCompact || location) && (
            <div className="flex flex-wrap gap-2 mb-2">
              {location && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {location}
                </span>
              )}
              {date && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {date}
                </span>
              )}
            </div>
          )}

          {!hideDescription && (
            <p
              className={classNames(
                "text-sm text-white/90 transition-all duration-300 line-clamp-2",
                isHovered ? "opacity-100" : "opacity-80",
              )}
            >
              {description}
            </p>
          )}

          {/* Tech tags for regular cards - limited to 3 to avoid clutter */}
          {isCompact && techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {techStack.slice(0, 3).map((tech: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-earth-tan/30 px-2 py-0.5 rounded-full text-white"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 3 && (
                <span className="text-xs text-white/70">
                  +{techStack.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* View Details button */}
          <div
            className={classNames(
              "mt-2 inline-flex items-center text-earth-tan font-semibold transition-all duration-300",
              isHovered ? "translate-x-1" : "translate-x-0",
            )}
          >
            View Details
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
    );
  },
);

PortfolioCard.displayName = "PortfolioCard";
export default PortfolioCard;
