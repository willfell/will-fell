import Image from "next/image";
import { FC, memo } from "react";

import { heroData, heroLinks, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, ExternalGlyph } from "../Icon/Glyphs";

// The one section that is not on the grid: a mountain lake, shaded for
// legibility, settling in on load and drifting slower than the page as it
// scrolls away. Its bottom fades to ink with the grid coming in over it, so
// the first scroll hands off to the grid every section after it sits on.
const Hero: FC = memo(() => {
  const { name, backgroundSrc, lede, imageSrc, imageAlt, currently } = heroData;

  return (
    <section className="relative isolate snap-start overflow-hidden" id="hero">
      <div
        aria-hidden="true"
        className="hero-photo absolute inset-x-0 -top-[8%] -z-30 h-[116%] bg-cover bg-[50%_62%]"
        style={{ backgroundImage: `url(${backgroundSrc})` }}
      />
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-20" />
      <div aria-hidden="true" className="bg-grid hero-grid-fade absolute inset-x-0 bottom-0 -z-10 h-48" />
      <div className="mx-auto max-w-page px-5 pb-14 pt-36 md:px-8 md:pb-24 md:pt-36 xl:px-12 xl:pb-[120px] xl:pt-[168px]">
        <div className="hero-enter flex flex-wrap items-center gap-x-[72px] gap-y-10 xl:gap-y-12">
          <div className="flex min-w-0 flex-[1_1_540px] flex-col gap-7">
            <h1 className="text-[38px] font-[650] leading-[1.03] tracking-[-0.03em] [text-wrap:balance] md:text-[56px] xl:text-[66px]">
              {name}
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
          {/* Below desktop width the photo shrinks to a square thumbnail beside the
              Currently lines, so the first screen holds the whole hero; from xl it
              is the tall card beside the text. */}
          <figure className="flex min-w-0 max-w-xl flex-[1_1_100%] flex-row items-stretch border border-line-mid bg-surface xl:max-w-none xl:flex-[0_1_380px] xl:flex-col">
            <Image
              alt={imageAlt}
              className="aspect-square w-[104px] shrink-0 border-r border-line-mid object-cover object-[50%_35%] sm:w-[128px] xl:aspect-[4/5] xl:h-auto xl:w-full xl:border-b xl:border-r-0 xl:object-[50%_45%]"
              height={475}
              priority
              src={imageSrc}
              width={380}
            />
            <figcaption className="flex min-w-0 flex-col justify-center gap-2.5 px-4 py-3 xl:gap-3.5 xl:px-5 xl:pb-5 xl:pt-[18px]">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                Currently
              </span>
              {currently.map(({ lead, rest }, i) => (
                <span className="flex gap-3 text-[14px] leading-[1.4] text-paper-2 xl:gap-3.5 xl:text-[15px] xl:leading-[1.45]" key={lead}>
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
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
