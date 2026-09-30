import classNames from "classnames";
import Image from "next/image";
import { FC, memo } from "react";

// An employer's or school's logo in brand colour on the dark ground. forml's
// mark is solid black, so it renders one-tone white instead. The name always
// sits beside it as text, so the image itself is decorative.
const Logo: FC<{ src: string; tone?: "white" }> = memo(({ src, tone }) => (
  <span className="flex h-10 w-[72px] shrink-0 items-center justify-center md:h-12 md:w-[104px]">
    <Image
      alt=""
      className={classNames("h-full w-full object-contain", tone === "white" && "brightness-0 invert")}
      height={96}
      src={src}
      width={208}
    />
  </span>
));

Logo.displayName = "Logo";
export default Logo;
