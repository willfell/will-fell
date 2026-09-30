import classNames from "classnames";
import { FC, memo, PropsWithChildren } from "react";

// One section of the page: transparent over the grid that <main> draws,
// snapping flush when a scroll ends near its top. The content sits in the
// shared column; sections with their own vertical rhythm pass innerClassName.
const Section: FC<
  PropsWithChildren<{
    sectionId: string;
    className?: string;
    innerClassName?: string;
  }>
> = memo(
  ({ children, sectionId, className, innerClassName = "py-16 md:py-24 xl:py-[120px]" }) => (
    <section className={classNames("snap-start", className)} id={sectionId}>
      <div className={classNames("mx-auto max-w-page px-5 md:px-8 xl:px-12", innerClassName)}>
        {children}
      </div>
    </section>
  ),
);

Section.displayName = "Section";
export default Section;
