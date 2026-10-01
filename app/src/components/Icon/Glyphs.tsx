import classNames from "classnames";
import { FC, memo } from "react";

type GlyphProps = { className?: string };

// The four line glyphs on the page. Stroke only, so each takes the text
// colour of whatever it sits in.
export const DownloadGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0", className)}
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
  >
    <path
      d="M6 1.5V10M2.5 6.5 6 10l3.5-3.5"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.6"
    />
  </svg>
));
DownloadGlyph.displayName = "DownloadGlyph";

export const ExternalGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0", className)}
    fill="none"
    height="11"
    viewBox="0 0 12 12"
    width="11"
  >
    <path
      d="M3 9l6-6M4 3h5v5"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.5"
    />
  </svg>
));
ExternalGlyph.displayName = "ExternalGlyph";

export const FlowArrowGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0 text-muted", className)}
    fill="none"
    height="12"
    viewBox="0 0 22 12"
    width="22"
  >
    <path d="M0 6h19M14 1.5 19.5 6 14 10.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
));
FlowArrowGlyph.displayName = "FlowArrowGlyph";

export const PlusGlyph: FC<GlyphProps> = memo(({ className }) => (
  <svg
    aria-hidden="true"
    className={classNames("shrink-0", className)}
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
  >
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" />
  </svg>
));
PlusGlyph.displayName = "PlusGlyph";
