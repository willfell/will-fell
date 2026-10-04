import { FC, memo, useEffect, useRef, useState } from "react";

import { contactEmail, githubHref, linkedInHref, siteRepoHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";

const links = [
  { href: linkedInHref, text: "LinkedIn" },
  { href: githubHref, text: "GitHub" },
  { href: siteRepoHref, text: "Site source" },
];

const Footer: FC = memo(() => {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const resetTimer = useRef<number>();
  const [emailUser, emailDomain] = contactEmail.split("@");

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  // When the clipboard is refused, leave the address selected so one
  // keystroke copies it.
  const selectEmail = () => {
    const el = emailRef.current;
    const selection = window.getSelection();
    if (!el || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const copyEmail = async () => {
    trackEvent("Email Click");
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      selectEmail();
    }
  };

  return (
    <footer className="snap-end border-t border-line-soot bg-soot text-muted">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 font-mono text-xs md:px-8 xl:px-12">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Will
          Fellhoelter · Denver, Colorado
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <li className="flex items-center gap-2.5">
            <a
              className="flex min-h-[44px] items-center text-paper"
              href={`mailto:${contactEmail}`}
              onClick={() => trackEvent("Email Click")}
              ref={emailRef}
            >
              <span>{emailUser}@<wbr />{emailDomain}</span>
            </a>
            <button
              aria-label="Copy email address"
              className="min-h-[44px] min-w-[64px] border border-line-mid px-3 text-paper transition-colors duration-200 hover:border-paper motion-reduce:transition-none"
              onClick={copyEmail}
              type="button"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <span className="sr-only" role="status">
              {copied ? "Email address copied" : ""}
            </span>
          </li>
          {links.map(({ href, text }) => (
            <li key={text}>
              <a
                className="flex min-h-[44px] items-center transition-colors duration-200 hover:text-paper motion-reduce:transition-none"
                href={href}
                onClick={() => trackEvent("Social Click", { platform: text })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
