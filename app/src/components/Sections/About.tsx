import { FC, memo } from "react";
import Image from "next/image";
import { aboutData, SectionId } from "../../data/data";
import Section from "../Layout/Section";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const About: FC = memo(() => {
  const { profileImageSrc, description, aboutItems } = aboutData;

  const sectionRef = useIntersectionObserver(0.15, "0px 0px -50px 0px");

  return (
    <Section className="bg-earth-tan" sectionId={SectionId.About}>
      <div
        ref={sectionRef}
        className="flex flex-col items-start gap-16 md:flex-row md:items-center md:justify-between"
      >
        {/* LEFT COLUMN – IMAGE */}
        {profileImageSrc && (
          <div className="mt-4 flex w-full items-center justify-center md:mt-0 md:w-1/2 md:justify-center">
            <div className="group relative h-96 w-96 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image
                alt="about-me"
                src={profileImageSrc}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        )}

        {/* RIGHT COLUMN */}
        <div className="flex flex-col md:w-1/2 md:pl-10">
          <h2 className="mb-4 text-3xl font-bold text-stone-black">About Me</h2>
          <p className="mb-6 text-stone-black">{description}</p>

          {/* ABOUT ITEMS – single column */}
          <ul className="space-y-4">
            {aboutItems.map(({ label, text, Icon }, idx) => (
              <li
                key={idx}
                className="flex flex-row items-center gap-2 animate-on-scroll opacity-0 transition-all duration-700"
                style={{ transitionDelay: `${idx * 100 + 200}ms` }}
              >
                {Icon && <Icon className="h-5 w-5 text-forest-green" />}
                <span className="font-bold text-stone-black">{label}:</span>
                <span className="text-stone-black">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
});

About.displayName = "About";
export default About;
