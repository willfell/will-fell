import { FC, memo } from "react";

import { siteRepoHref, stravaHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";

const Footer: FC = memo(() => (
  <footer className="border-t border-line-soot bg-soot text-muted">
    <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-[18px] font-mono text-xs md:px-8 xl:px-12">
      <p>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Will
        Fellhoelter · Denver, Colorado
      </p>
      <ul className="flex gap-6">
        <li>
          <a
            className="flex min-h-[44px] items-center"
            href={stravaHref}
            onClick={() => trackEvent("Social Click", { platform: "Strava" })}
            rel="noopener noreferrer"
            target="_blank"
          >
            Strava
          </a>
        </li>
        <li>
          <a
            className="flex min-h-[44px] items-center"
            href={siteRepoHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Site source
          </a>
        </li>
      </ul>
    </div>
  </footer>
));

Footer.displayName = "Footer";
export default Footer;
