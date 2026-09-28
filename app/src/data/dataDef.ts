import { FC } from "react";

import { IconProps } from "../components/Icon/Icon";

export interface HomepageMeta {
  title: string;
  description: string;
}

export interface HeroAction {
  href: string;
  text: string;
  primary?: boolean;
  download?: boolean;
}

export interface Hero {
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  actions: HeroAction[];
}

export interface About {
  description: string;
}

export interface SelectedWorkItem {
  title: string;
  context: string;
  description: string;
  href?: string;
}

export interface Role {
  dates: string;
  employer: string;
  title: string;
  line: string;
  bullets: string[];
}

export interface Social {
  label: string;
  href: string;
  Icon: FC<IconProps>;
}
