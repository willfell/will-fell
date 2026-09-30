import classNames from "classnames";
import { FC, memo, PropsWithChildren } from "react";

export type Band = "ink" | "pine";

// One band of the page: the ground colour spans the viewport, the content
// sits in the shared column. Bands with their own vertical rhythm pass
// innerClassName.
const Section: FC<
  PropsWithChildren<{
    sectionId: string;
    band?: Band;
    className?: string;
    innerClassName?: string;
  }>
> = memo(
  ({
    children,
    sectionId,
    band = "ink",
    className,
    innerClassName = "py-16 md:py-24 xl:py-[120px]",
  }) => (
    <section
      className={classNames(band === "pine" ? "bg-pine" : "bg-ink", className)}
      id={sectionId}
    >
      <div
        className={classNames(
          "mx-auto max-w-page px-5 md:px-8 xl:px-12",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  ),
);

Section.displayName = "Section";
export default Section;
