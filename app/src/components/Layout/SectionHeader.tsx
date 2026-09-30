import classNames from "classnames";
import { FC, memo, ReactNode } from "react";

import { Band } from "./Section";

// The numbered mono strip above every band after the hero: square, number,
// label, rule.
export const Eyebrow: FC<{ number: string; label: string; band?: Band }> =
  memo(({ number, label, band = "ink" }) => (
    <p className="flex items-center gap-3.5 font-mono text-xs uppercase tracking-[0.1em] text-muted">
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 bg-amber" />
      <span className="font-bold text-paper">{number}</span>
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={classNames(
          "h-px grow",
          band === "pine" ? "bg-line-pine-mid" : "bg-line-mid",
        )}
      />
    </p>
  ));

Eyebrow.displayName = "Eyebrow";

const SectionHeader: FC<{
  number: string;
  label: string;
  heading: string;
  lede?: string;
  action?: ReactNode;
  band?: Band;
}> = memo(({ number, label, heading, lede, action, band = "ink" }) => (
  <div className="flex flex-col gap-10">
    <Eyebrow band={band} label={label} number={number} />
    <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
      <h2 className="max-w-[16ch] text-[30px] font-[650] leading-[1.04] tracking-[-0.028em] [text-wrap:balance] md:text-[42px] xl:text-[50px]">
        {heading}
      </h2>
      {lede && (
        <p className="max-w-[46ch] text-[17px] leading-relaxed text-paper-2 [text-wrap:pretty]">
          {lede}
        </p>
      )}
      {action}
    </div>
  </div>
));

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
