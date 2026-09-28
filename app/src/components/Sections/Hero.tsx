import classNames from "classnames";
import Image from "next/image";
import { FC, memo } from "react";

import { heroData } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import Section from "../Layout/Section";

const Hero: FC = memo(() => {
  const { name, description, imageSrc, imageAlt, actions } = heroData;

  return (
    <Section className="bg-cream" sectionId="hero">
      <div className="hero-enter flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <Image
          alt={imageAlt}
          className="h-28 w-28 shrink-0 rounded-full object-cover lg:order-last lg:h-72 lg:w-72"
          height={288}
          priority
          src={imageSrc}
          width={288}
        />
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold leading-tight text-forest-green md:text-5xl">
            {name}
          </h1>
          <p className="max-w-prose text-[17px] leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-3">
            {actions.map(({ href, text, primary, download }) => (
              <a
                className={classNames(
                  "rounded-full border-2 px-5 py-2 font-medium transition-colors",
                  primary
                    ? "border-earth-tan bg-earth-tan text-stone-black hover:bg-canyon-tan"
                    : "border-forest-green text-forest-green hover:bg-forest-green hover:text-cream",
                )}
                href={href}
                key={text}
                onClick={() => trackEvent("Hero CTA Click", { button: text })}
                {...(download
                  ? { download: "" }
                  : { rel: "noopener noreferrer", target: "_blank" })}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
});

Hero.displayName = "Hero";
export default Hero;
