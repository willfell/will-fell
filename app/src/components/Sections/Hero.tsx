import Image from "next/image";
import { FC, memo } from "react";

import { heroData, heroLinks, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, ExternalGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";

const Hero: FC = memo(() => {
  const { headline, emphasis, lede, imageSrc, imageAlt, currently } = heroData;

  return (
    <Section
      className="bg-grid border-b border-line"
      innerClassName="py-12 md:py-20 xl:py-[104px]"
      sectionId="hero"
    >
      <div className="hero-enter flex flex-wrap items-center gap-x-[72px] gap-y-12">
        <div className="flex min-w-0 flex-[1_1_540px] flex-col gap-7">
          <h1 className="text-[38px] font-[650] leading-[1.03] tracking-[-0.03em] [text-wrap:balance] md:text-[56px] xl:text-[66px]">
            {`${headline} `}
            <span className="underline decoration-amber decoration-[0.14em] underline-offset-[0.12em]">
              {emphasis}
            </span>
          </h1>
          <p
            className="max-w-[58ch] text-[17px] leading-[1.55] text-paper-2 [text-wrap:pretty] md:text-lg xl:text-xl"
            data-lede=""
          >
            {lede}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <a
              className="inline-flex min-h-[52px] items-center gap-2.5 bg-amber px-6 text-base font-bold text-ink"
              download=""
              href={resumeHref}
              onClick={() => trackEvent("Hero CTA Click", { button: "Resume" })}
            >
              Download resume
              <DownloadGlyph />
            </a>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-sm">
              {heroLinks.map(({ href, text, external }) => (
                <li key={text}>
                  <a
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-paper underline decoration-1 underline-offset-[5px]"
                    href={href}
                    onClick={() => trackEvent("Hero CTA Click", { button: text })}
                    {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                  >
                    {text}
                    {external && <ExternalGlyph />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure className="flex min-w-0 flex-[0_1_380px] flex-col border border-line-mid bg-surface">
          <Image
            alt={imageAlt}
            className="aspect-[4/5] h-auto w-full border-b border-line-mid object-cover object-[50%_45%]"
            height={475}
            priority
            src={imageSrc}
            width={380}
          />
          <figcaption className="flex flex-col gap-3.5 px-5 pb-5 pt-[18px]">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Currently
            </span>
            {currently.map(({ lead, rest }, i) => (
              <span className="flex gap-3.5 text-[15px] leading-[1.45] text-paper-2" key={lead}>
                <span className="shrink-0 font-mono text-xs leading-[21px] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <b className="font-bold text-paper">{lead}</b> {rest}
                </span>
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
});

Hero.displayName = "Hero";
export default Hero;
