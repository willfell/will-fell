import { FC, memo, useState } from "react";

import { contactEmail, socialLinks } from "../../data/data";
import { trackEvent } from "../../utils/analytics";

const Footer: FC = memo(() => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    trackEvent("Email Click");
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer className="bg-deep-forest px-4 py-12 text-earth-tan lg:px-8">
      <div className="mx-auto flex max-w-screen-lg flex-wrap items-center justify-between gap-x-8 gap-y-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2 font-mono text-sm">
            <a
              className="select-all hover:underline underline-offset-4"
              href={`mailto:${contactEmail}`}
              onClick={() => trackEvent("Email Click")}
            >
              {contactEmail}
            </a>
            <button
              aria-label="Copy email address"
              className="rounded border border-earth-tan/60 px-2 py-0.5 text-xs transition-colors hover:bg-earth-tan hover:text-deep-forest"
              onClick={copyEmail}
              type="button"
            >
              {copied ? "copied" : "copy"}
            </button>
          </span>
          <ul className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  aria-label={label}
                  className="block transition-colors hover:text-cream"
                  href={href}
                  onClick={() => trackEvent("Social Click", { platform: label })}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-xs text-earth-tan/80">
          <a
            className="hover:underline underline-offset-4"
            href="https://github.com/willfell/will-fell"
            rel="noopener noreferrer"
            target="_blank"
          >
            source
          </a>{" "}
          · © {new Date().getFullYear()} Will Fellhoelter
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
