import classNames from "classnames";
import { FC, memo, PropsWithChildren } from "react";

const Section: FC<
  PropsWithChildren<{
    sectionId: string;
    noPadding?: boolean;
    className?: string;
  }>
> = memo(({ children, sectionId, noPadding = false, className }) => {
  return (
    <section
      className={classNames(className, {
        "px-4 py-16 md:py-20 lg:px-8": !noPadding,
      })}
      id={sectionId}
    >
      <div className={classNames({ "mx-auto max-w-screen-lg": !noPadding })}>
        {children}
      </div>
    </section>
  );
});

Section.displayName = "Section";
export default Section;
