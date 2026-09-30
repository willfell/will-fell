import Link from "next/link";
import { FC, memo } from "react";

import { navLinks, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph } from "../Icon/Glyphs";

const Nav: FC = memo(() => (
  <header className="border-b border-line bg-ink">
    <nav
      aria-label="Site"
      className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-7 px-5 py-2 md:px-8 md:py-3.5 xl:px-12"
    >
      <Link className="flex min-h-[44px] items-center gap-3 text-paper" href="/">
        <span aria-hidden="true" className="h-3 w-3 shrink-0 bg-amber" />
        <span className="text-lg font-[750] tracking-[-0.01em] [font-stretch:115%]">
          Will Fellhoelter
        </span>
      </Link>
      <ul className="order-last flex w-full justify-between font-mono text-[13px] tracking-[0.02em] md:order-none md:ml-auto md:w-auto md:gap-x-7">
        {navLinks.map(({ href, text }) => (
          <li key={href}>
            <a className="flex min-h-[44px] items-center text-paper" href={href}>
              {text}
            </a>
          </li>
        ))}
      </ul>
      <a
        className="flex min-h-[44px] items-center gap-2 bg-amber px-4 font-mono text-[13px] font-bold tracking-[0.02em] text-ink"
        download=""
        href={resumeHref}
        onClick={() => trackEvent("Download Click", { file: "Resume" })}
      >
        Resume
        <DownloadGlyph />
      </a>
    </nav>
  </header>
));

Nav.displayName = "Nav";
export default Nav;
