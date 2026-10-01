import { FC, memo, useEffect, useRef, useState } from "react";

import { contact, contactEmail, githubHref, linkedInHref, resumeHref } from "../../data/data";
import { trackEvent } from "../../utils/analytics";
import { DownloadGlyph, ExternalGlyph } from "../Icon/Glyphs";
import Section from "../Layout/Section";

const links = [
  { href: linkedInHref, text: "LinkedIn" },
  { href: githubHref, text: "GitHub" },
];

const Contact: FC = memo(() => {
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
    <Section
      band="pine"
      className="border-t border-line-pine"
      innerClassName="flex flex-wrap items-end justify-between gap-x-[72px] gap-y-10 py-16 md:py-24 xl:py-[120px]"
      sectionId="contact"
    >
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5">
        <h2 className="max-w-[14ch] text-4xl font-[650] leading-none tracking-[-0.035em] [text-wrap:balance] md:text-[56px] xl:text-[70px]">
          {contact.heading}
        </h2>
        <p className="max-w-[48ch] text-lg leading-relaxed text-paper-2 [text-wrap:pretty]">
          {contact.lede}
        </p>
      </div>
      <div className="flex min-w-0 flex-[0_1_420px] flex-col gap-3">
        <a
          className="flex min-h-[56px] items-center justify-between gap-2.5 bg-amber px-[22px] text-[17px] font-bold text-ink"
          download=""
          href={resumeHref}
          onClick={() => trackEvent("Download Click", { file: "Resume" })}
        >
          Download resume
          <DownloadGlyph className="h-[13px] w-[13px]" />
        </a>
        <div className="flex border border-muted">
          <a
            className="flex min-h-[52px] min-w-0 grow items-center px-[18px] py-2.5 font-mono text-sm text-paper"
            href={`mailto:${contactEmail}`}
            onClick={() => trackEvent("Email Click")}
            ref={emailRef}
          >
            <span>{emailUser}@<wbr />{emailDomain}</span>
          </a>
          <button
            aria-label="Copy email address"
            className="min-h-[52px] min-w-[92px] shrink-0 border-l border-muted px-4 font-mono text-[13px] text-paper"
            onClick={copyEmail}
            type="button"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <span className="sr-only" role="status">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
        <ul className="flex gap-3">
          {links.map(({ href, text }) => (
            <li className="flex-1" key={text}>
              <a
                className="flex min-h-[48px] items-center justify-center gap-2 border border-line-pine-mid font-mono text-[13.5px] text-paper"
                href={href}
                onClick={() => trackEvent("Social Click", { platform: text })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {text}
                <ExternalGlyph />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
});

Contact.displayName = "Contact";
export default Contact;
