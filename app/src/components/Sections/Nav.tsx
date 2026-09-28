import Link from "next/link";
import { FC, memo } from "react";

import { resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";

const linkClass = "hover:underline underline-offset-4";

const Nav: FC = memo(() => (
  <header className="border-b border-stone-300 bg-cream">
    <nav
      aria-label="Site"
      className="mx-auto flex max-w-screen-lg flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 lg:px-8"
    >
      <Link className="text-lg font-semibold text-stone-black" href="/">
        Will Fellhoelter
      </Link>
      <ul className="flex flex-wrap items-center gap-x-6 font-mono text-sm tracking-wide text-forest-green">
        <li>
          <a className={linkClass} href="#work">
            Work
          </a>
        </li>
        <li>
          <a className={linkClass} href="#experience">
            Experience
          </a>
        </li>
        <li>
          <a
            className={linkClass}
            download=""
            href={resumeHref}
            onClick={() => trackEvent("Download Click", { file: "Resume" })}
          >
            Resume ↓
          </a>
        </li>
      </ul>
    </nav>
  </header>
));

Nav.displayName = "Nav";
export default Nav;
