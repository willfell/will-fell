import classNames from "classnames";
import { FC, memo, PropsWithChildren } from "react";

// One section of the page, sitting on the grid that <main> draws and snapping
// flush when a scroll ends near its top. Every other section after the hero is
// lifted a few percent lighter (`lift`), so on a phone, where the page runs
// long, each boundary still reads; the wash is translucent, so the one grid
// runs through all of them. The content sits in the shared column; sections
// with their own vertical rhythm pass innerClassName.
const Section: FC<
  PropsWithChildren<{
    sectionId: string;
    lift?: boolean;
    className?: string;
    innerClassName?: string;
  }>
> = memo(
  ({ children, sectionId, lift, className, innerClassName = "py-16 md:py-24 xl:py-[120px]" }) => (
    <section className={classNames("snap-start", lift && "bg-paper/[0.04]", className)} id={sectionId}>
      <div className={classNames("mx-auto max-w-page px-5 md:px-8 xl:px-12", innerClassName)}>
        {children}
      </div>
    </section>
  ),
);

Section.displayName = "Section";
export default Section;
