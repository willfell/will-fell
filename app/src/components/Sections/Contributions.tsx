import classNames from "classnames";
import {
  CSSProperties,
  FC,
  KeyboardEvent,
  memo,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { contributionsCaption } from "../../data/data";
import snapshot from "../../data/github-contributions.json";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEVELS = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

// GitHub's own buckets are relative to the year's peak; fixed ones keep the
// picture honest across quiet and busy years.
const level = (count: number) =>
  count === 0 ? 0 : count < 10 ? 1 : count < 30 ? 2 : count < 70 ? 3 : 4;

const utc = (date: string) => new Date(`${date}T00:00:00Z`);

// The snapshot starts on a Sunday, so every seven days is one column. A
// column is labelled when it starts a new month; the first never is.
const weeks = Array.from({ length: Math.ceil(snapshot.days.length / 7) }, (_, w) => {
  const days = snapshot.days.slice(w * 7, w * 7 + 7);
  const m = utc(days[0].date).getUTCMonth();
  const label =
    w > 0 && m !== utc(snapshot.days[(w - 1) * 7].date).getUTCMonth() ? MONTHS[m] : "";
  return { days, label };
});

const LAST = snapshot.days.length - 1;
const indexOf = new Map(snapshot.days.map(({ date }, i) => [date, i]));

export const total = snapshot.total.toLocaleString("en-US");

const describe = (i: number) => {
  const { date, count } = snapshot.days[i];
  const d = utc(date);
  const n = count === 0 ? "No" : count.toLocaleString("en-US");
  return `${n} contribution${count === 1 ? "" : "s"} on ${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

// The total rolls up digit by digit while the year fills in. Each digit is a
// strip of 0-9 twice over, parked on its value in the second run, so every
// digit spins at least once; the plain number is what gets read and copied.
const Odometer: FC<{ value: string }> = memo(({ value }) => (
  <span className="relative inline-flex">
    <span className="sr-only" data-total="">
      {value}
    </span>
    <span aria-hidden="true" className="odometer inline-flex tabular-nums">
      {Array.from(value, (ch, i) =>
        /\d/.test(ch) ? (
          <span className="odometer-digit" key={i} style={{ "--d": Number(ch), "--i": i } as CSSProperties}>
            <span className="odometer-strip">
              {Array.from({ length: 20 }, (_, n) => (
                <span key={n}>{n % 10}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  </span>
));

Odometer.displayName = "Odometer";

// One square per day, one column per week, on one CSS grid: the weekday
// labels and every week are display:contents wrappers, so a label shares its
// row track with that weekday's squares and the squares stay square at any
// width. Memoised apart from the readout so pointing at a day never
// re-renders the 371 squares.
const Grid: FC = memo(() => (
  <div
    aria-label={`Contribution heatmap for the last 12 months, one square per day, darker to brighter by activity: ${total} contributions in all`}
    className="grid w-full min-w-min grid-flow-col grid-rows-[auto_repeat(7,auto)] gap-[3px] [direction:ltr]"
    role="img"
    style={{ gridTemplateColumns: `auto repeat(${weeks.length}, minmax(9px, 1fr))` }}
  >
    {/* Phones start scrolled to the latest weeks and drop the weekday
        labels rather than pin a strip of them over the photo. */}
    <div aria-hidden="true" className="contents font-mono text-[10px] leading-none text-muted">
      <span className="hidden h-4 sm:block" />
      {WEEKDAYS.map((day, i) => (
        <span className="hidden items-center pr-1.5 sm:flex" key={i}>
          {day}
        </span>
      ))}
    </div>
    {weeks.map(({ days, label }, w) => (
      <div className="heat-week contents" data-week={w} key={days[0].date} style={{ "--w": w } as CSSProperties}>
        <span
          className={classNames(
            "h-4 whitespace-nowrap font-mono text-[10px] leading-4 text-muted",
            w === weeks.length - 1 && "[direction:rtl]",
          )}
        >
          {label}
        </span>
        {days.map(({ date, count }) => (
          <span
            className={classNames("heat-cell aspect-square rounded-[2px]", LEVELS[level(count)])}
            data-day={date}
            data-level={level(count)}
            key={date}
          />
        ))}
      </div>
    ))}
  </div>
));

Grid.displayName = "Grid";

// The year on GitHub, under the hero's intro: the total, the heatmap, and
// what most of it is. Pointing at a day (or arrowing through the days once
// the heatmap has focus) swaps the legend for that day's count.
const Contributions: FC<{ className?: string; style?: CSSProperties }> = memo(
  ({ className, style }) => {
    const [active, setActive] = useState<number | null>(null);
    const scroller = useRef<HTMLDivElement>(null);
    const keyed = useRef(false);

    useEffect(() => {
      const root = scroller.current;
      if (!root) return;
      root.querySelector("[data-active]")?.removeAttribute("data-active");
      if (active === null) return;
      const cell = root.querySelector(`[data-day="${snapshot.days[active].date}"]`);
      cell?.setAttribute("data-active", "");
      if (keyed.current) cell?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [active]);

    const point = useCallback((e: PointerEvent<HTMLDivElement>) => {
      const day = (e.target as HTMLElement).getAttribute("data-day");
      if (day === null) return;
      keyed.current = false;
      setActive(indexOf.get(day) ?? null);
    }, []);

    const leave = useCallback(() => {
      if (document.activeElement !== scroller.current) setActive(null);
    }, []);

    const step = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      const by: Record<string, number> = {
        ArrowDown: 1,
        ArrowLeft: -7,
        ArrowRight: 7,
        ArrowUp: -1,
        End: LAST,
        Home: -LAST,
      };
      if (!(e.key in by)) return;
      e.preventDefault();
      keyed.current = true;
      setActive((i) => Math.min(LAST, Math.max(0, (i ?? LAST) + by[e.key])));
    }, []);

    return (
      <figure className={classNames("flex min-w-0 flex-col gap-3", className)} id="activity" style={style}>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <p className="flex flex-wrap items-baseline gap-x-2.5">
            <span className="text-[26px] font-[750] leading-none tracking-[-0.02em] [font-stretch:125%]">
              <Odometer value={total} />
            </span>
            <span className="text-[15px] text-paper-2">contributions in the last year</span>
          </p>
          <p
            aria-live="polite"
            className="flex min-h-[20px] items-center gap-[5px] font-mono text-xs text-muted"
          >
            {active === null ? (
              <>
                <span>Less</span>
                {LEVELS.map((cls) => (
                  <span aria-hidden="true" className={classNames("h-[11px] w-[11px] rounded-[2px]", cls)} key={cls} />
                ))}
                <span>More</span>
              </>
            ) : (
              <span className="text-paper">{describe(active)}</span>
            )}
          </p>
        </div>
        <div
          aria-label="Contribution heatmap. Use the arrow keys to read each day; it scrolls sideways on small screens."
          className="overflow-x-auto pb-1 pr-[3px] [direction:rtl]"
          onBlur={() => setActive(null)}
          onFocus={() => setActive((i) => i ?? LAST)}
          onKeyDown={step}
          onPointerLeave={leave}
          onPointerOver={point}
          ref={scroller}
          role="region"
          tabIndex={0}
        >
          <Grid />
        </div>
        <figcaption className="max-w-[75ch] text-[14px] leading-relaxed text-muted [text-wrap:pretty]">
          {contributionsCaption}
        </figcaption>
      </figure>
    );
  },
);

Contributions.displayName = "Contributions";
export default Contributions;
