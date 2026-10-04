import Image from "next/image";
import { CSSProperties, FC, memo } from "react";

import { heroData, heroLinks, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, ExternalGlyph } from "../Icon/Glyphs";
import Contributions from "./Contributions";

// The one section that is not on the grid: a mountain lake, shaded for
// legibility, settling in on load and drifting slower than the page as it
// scrolls away. Its bottom fades to ink with the grid coming in over it, so
// the first scroll hands off to the grid every section after it sits on.
//
// The page's one load sequence plays here: the name wipes up, the photo card
// opens from its bottom edge, the lede and links follow on --i, then the year
// on GitHub fills in week by week while its total rolls up.
const rise = (i: number) => ({ "--i": i }) as CSSProperties;

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
        {/* From xl the intro sits top left, the year on GitHub bottom left, and
            the photo card spans both on the right, so the heatmap fills what
            used to be open water under the links and ends flush with the card.
            Below xl they stack in source order: intro, photo, heatmap. */}
        <div className="grid grid-cols-1 gap-y-10 xl:grid-cols-[minmax(0,1fr)_380px] xl:grid-rows-[auto_1fr] xl:gap-x-[72px] xl:gap-y-12">
          <div className="flex min-w-0 flex-col gap-7 xl:col-start-1 xl:row-start-1">
            <h1 className="hero-title text-[38px] font-[650] leading-[1.03] tracking-[-0.03em] [text-wrap:balance] md:text-[56px] xl:text-[66px]">
              {name}
            </h1>
            <p
              className="hero-rise max-w-[58ch] text-[17px] leading-[1.55] text-paper-2 [text-wrap:pretty] md:text-lg xl:text-xl"
              data-lede=""
              style={rise(1)}
            >
              {lede}
            </p>
            <div className="hero-rise flex flex-wrap items-center gap-x-7 gap-y-3" style={rise(2)}>
              <a
                className="group inline-flex min-h-[52px] items-center gap-2.5 bg-amber px-6 text-base font-bold text-ink transition-colors duration-200 hover:bg-paper motion-reduce:transition-none"
                download=""
                href={resumeHref}
                onClick={() => trackEvent("Hero CTA Click", { button: "Resume" })}
              >
                Download resume
                <DownloadGlyph className="glyph-down" />
              </a>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-sm">
                {heroLinks.map(({ href, text, external }) => (
                  <li key={text}>
                    <a
                      className="link group inline-flex min-h-[44px] items-center gap-1.5 text-paper"
                      href={href}
                      onClick={() => trackEvent("Hero CTA Click", { button: text })}
                      {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                    >
                      {text}
                      {external && <ExternalGlyph className="glyph-out" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Below desktop width the photo shrinks to a square thumbnail beside the
              Currently lines, so the first screen still holds the intro and the
              card; from xl it is the tall card beside the text. */}
          <figure
            className="hero-card flex min-w-0 max-w-xl flex-row items-stretch border border-line-mid bg-surface xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:max-w-none xl:flex-col"
          >
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
          <Contributions
            className="hero-rise max-w-3xl xl:col-start-1 xl:row-start-2 xl:max-w-none xl:self-end"
            style={rise(3)}
          />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
