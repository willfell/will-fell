import Image from "next/image";
import { FC, memo } from "react";

import { sauce } from "../../data/data";
import { Screenshot } from "../../data/dataDef";
import { trackEvent } from "../../utils/analytics";
import { ExternalGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";
import { Eyebrow } from "../Layout/SectionHeader";
import Flow from "./Flow";

const Shot: FC<Screenshot & { className?: string }> = memo(
  ({ src, alt, caption, width, height, className }) => (
    <figure className={className}>
      <Image
        alt={alt}
        className="h-auto w-full border border-line-mid"
        height={height}
        src={src}
        width={width}
      />
      <figcaption className="mt-3 font-mono text-xs leading-relaxed text-muted [text-wrap:pretty]">
        {caption}
      </figcaption>
    </figure>
  ),
);

Shot.displayName = "Shot";

const Projects: FC = memo(() => {
  const { name, context, logo, description, flowTitle, flowLabel, flow, install } = sauce;

  return (
    <Section className="border-t border-line" sectionId="projects">
      <div className="flex flex-col gap-10">
        <Eyebrow label="Personal projects" number="03" />
        <article className="grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-7">
            <header className="reveal flex items-center gap-4">
              <Image alt="" className="h-14 w-14 shrink-0" height={56} src={logo} width={56} />
              <div className="flex flex-col gap-1.5">
                <h2 className="text-[34px] font-[750] leading-none tracking-[-0.02em] [font-stretch:115%] md:text-[42px]">
                  {name}
                </h2>
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{context}</p>
              </div>
            </header>
            <p className="reveal max-w-[62ch] text-[17px] leading-relaxed text-paper-2 [text-wrap:pretty]">
              {description}
            </p>
            <div className="flex flex-col gap-3">
              <h3 className="reveal font-mono text-xs uppercase tracking-[0.08em] text-muted">{flowTitle}</h3>
              <div>
                <Flow label={flowLabel} nodes={flow} />
              </div>
            </div>
            <div className="reveal flex flex-wrap items-center gap-x-8 gap-y-4">
              <pre className="flex flex-col overflow-x-auto border border-line bg-soot px-4 py-3.5 font-mono text-[12.5px] leading-[1.8] text-paper">
                {install.map((command) => (
                  <code className="whitespace-nowrap" key={command}>
                    <span className="select-none text-amber">$</span> {command}
                  </code>
                ))}
              </pre>
              <a
                aria-label={sauce.hrefLabel}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-mono text-[13.5px] text-paper underline decoration-1 underline-offset-[5px]"
                href={sauce.href}
                onClick={() => trackEvent("Project Click", { project: name })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {sauce.hrefText}
                <ExternalGlyph />
              </a>
            </div>
          </div>
          <Shot {...sauce.phoneShot} className="reveal w-full max-w-[280px]" />
        </article>
        <Shot {...sauce.wideShot} className="reveal" />
      </div>
    </Section>
  );
});

Projects.displayName = "Projects";
export default Projects;
