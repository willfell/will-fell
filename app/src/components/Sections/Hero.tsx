import { ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Image from "next/image";
import { FC, memo, useEffect, useRef, useState } from "react";
import { heroData, SectionId } from "../../data/data";
import Section from "../Layout/Section";
import Socials from "../Socials";
import { getImageUrl } from "../../utils/imageUrl";
import { trackEvent } from "../../utils/analytics";

const Hero: FC = memo(() => {
  const { imageSrc, name, description, actions } = heroData;
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle animations when component mounts
  useEffect(() => {
    // Make sure animation classes are reset and properly applied
    const resetAndAnimateElements = () => {
      // Short delay to ensure DOM is ready
      setTimeout(() => {
        if (heroRef.current) {
          // First mark that we're ready to show the component
          setIsVisible(true);

          // Find all animate-on-load elements
          const animateElements =
            heroRef.current.querySelectorAll(".animate-on-load");

          // Apply animations with staggered delay
          animateElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add("animate-fadeIn");
            }, 100 * index);
          });
        }
      }, 50);
    };

    // Run animation reset and initialization
    resetAndAnimateElements();
  }, []);

  return (
    <Section noPadding sectionId={SectionId.Hero}>
      <div
        ref={heroRef}
        className={`relative flex h-screen w-full items-center justify-center overflow-hidden ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transition: "opacity 0.3s ease-out" }}
      >
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `scale(${1 + scrollY * 0.0005}) translateY(${
              scrollY * 0.2
            }px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Image
            alt={`${name}-image`}
            className="h-full w-full object-cover"
            priority
            src={imageSrc}
            fill
          />
        </div>

        {/* Gradient overlay - Updated to forest green colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-green/70 via-forest-green/50 to-earth-tan/40 z-0"></div>

        {/* Content container - Changed to grid for left/right layout */}
        <div className="z-10 w-full max-w-screen-xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:px-8">
          {/* Left column - Text content */}
          <div className="flex flex-col justify-center">
            <div className="rounded-xl bg-forest-green/50 p-6 text-left shadow-xl backdrop-blur-sm border border-sage-green/20">
              <h1 className="animate-on-load opacity-0 translate-y-4 transition-all duration-700 text-4xl font-bold text-earth-tan sm:text-5xl lg:text-6xl">
                {name}
              </h1>
              <div className="animate-on-load opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-4 text-stone-100">
                {description}
              </div>
              <div className="animate-on-load opacity-0 translate-y-4 transition-all duration-700 delay-200 flex justify-center gap-x-4 text-stone-200 mt-6">
                <Socials />
              </div>
              <div className="animate-on-load opacity-0 translate-y-4 transition-all duration-700 delay-300 flex flex-wrap justify-center mt-6 gap-4">
                {actions.map(
                  ({ href, text, primary, Icon, download }, index) => (
                    <a
                      className={classNames(
                        "flex gap-x-2 rounded-full border-2 bg-none px-4 py-2 text-sm font-medium text-stone-100 ring-offset-forest-green hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-base transition-all duration-300 hover:scale-105",
                        primary
                          ? "border-earth-tan ring-earth-tan hover:bg-sage-green/40"
                          : "border-sage-green ring-sage-green hover:bg-forest-green/70",
                      )}
                      href={href}
                      key={text}
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                      onClick={() => trackEvent("Hero CTA Click", { button: text })}
                      {...(download ? { download: "" } : {})}
                    >
                      {text}
                      {Icon && <Icon className="h-5 w-5" />}
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Right column - Profile Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div
              className="animate-on-load opacity-0 translate-y-4 transition-all duration-700 delay-400 
                        relative w-96 h-96 rounded-full overflow-hidden border-4 border-stone-300 shadow-xl"
            >
              <Image
                alt="Profile picture"
                src={getImageUrl("/images/about/profilepic.jpg")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Scroll down button */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            className="animate-bounce rounded-full bg-earth-tan p-1 ring-sage-green ring-offset-2 ring-offset-forest-green/80 focus:outline-none focus:ring-2 sm:p-2 transition-all duration-300 hover:bg-sage-green shadow-lg"
            href={`/#${SectionId.About}`}
          >
            <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6 text-forest-green" />
          </a>
        </div>
      </div>
    </Section>
  );
});

Hero.displayName = "Hero";
export default Hero;
