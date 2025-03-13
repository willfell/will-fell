import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { FC, memo } from "react";

import { SectionId } from "../../data/data";
import Socials from "../Socials";

const currentYear = new Date().getFullYear();

const Footer: FC = memo(() => (
  <div className="relative bg-deep-forest px-4 pb-6 pt-12 sm:px-8 sm:pb-8 sm:pt-14">
    <div className="absolute inset-x-0 -top-4 flex justify-center sm:-top-6">
      <a
        className="rounded-full bg-earth-tan p-1 ring-sage-green ring-offset-2 ring-offset-forest-green/80 focus:outline-none focus:ring-2 sm:p-2 transition-all duration-300 hover:bg-sage-green hover:scale-110 shadow-lg"
        href={`/#${SectionId.Hero}`}
      >
        <ChevronUpIcon className="h-6 w-6 bg-transparent sm:h-8 sm:w-8 text-forest-green" />
      </a>
    </div>
    <div className="flex flex-col items-center gap-y-6">
      <div className="flex gap-x-4 text-earth-tan">
        <Socials />
      </div>
      <span className="text-sm text-sage-green">
        © Copyright {currentYear} Will Fellhoelter
      </span>
    </div>
  </div>
));

Footer.displayName = "Footer";
export default Footer;
