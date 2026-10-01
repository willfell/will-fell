import classNames from "classnames";
import { FC, Fragment, memo } from "react";

import { FlowNode } from "../../data/dataDef";
import { FlowArrowGlyph } from "../Icon/Glyphs";

// Four boxes joined by arrows, read as one picture: the label is the whole
// sentence a screen reader gets.
const Flow: FC<{ label: string; nodes: FlowNode[] }> = memo(({ label, nodes }) => (
  <div
    aria-label={label}
    className="flex min-w-0 flex-[1.5_1_540px] flex-col gap-2.5 md:flex-row md:gap-x-2"
    role="img"
  >
    {nodes.map(({ title, detail, highlight }, i) => (
      <Fragment key={title}>
        {i > 0 && <FlowArrowGlyph className="rotate-90 self-center md:rotate-0" />}
        <div
          className={classNames(
            "flex flex-col gap-2 border p-3.5 md:min-h-[124px] md:flex-1",
            highlight ? "border-paper bg-paper text-ink" : "border-line-mid bg-ink",
          )}
        >
          <span className="text-base font-bold [font-stretch:110%]">{title}</span>
          <span
            className={classNames(
              "font-mono text-[11.5px] leading-normal",
              highlight ? "text-ink-2" : "text-muted",
            )}
          >
            {detail}
          </span>
        </div>
      </Fragment>
    ))}
  </div>
));

Flow.displayName = "Flow";
export default Flow;
