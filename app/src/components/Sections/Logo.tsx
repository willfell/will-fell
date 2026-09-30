import classNames from "classnames";
import Image from "next/image";
import { FC, memo } from "react";

// An employer's or school's logo on a paper tile: the marks are drawn for
// white grounds, and several (forml, Lendflow, MCG) vanish on ink. The name
// always sits beside it as text, so the image itself is decorative.
const Logo: FC<{ src: string; className?: string }> = memo(({ src, className }) => (
  <span
    className={classNames(
      "flex h-10 w-[72px] shrink-0 items-center justify-center bg-paper px-2 py-1.5 md:h-12 md:w-[104px] md:px-2.5",
      className,
    )}
  >
    <Image alt="" className="h-full w-full object-contain" height={96} src={src} width={208} />
  </span>
));

Logo.displayName = "Logo";
export default Logo;
