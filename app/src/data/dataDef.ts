export interface HomepageMeta {
  title: string;
  description: string;
}

export interface NavLink {
  href: string;
  text: string;
}

export interface HeroAction {
  href: string;
  text: string;
  external?: boolean;
}

export interface Hero {
  name: string;
  lede: string;
  imageSrc: string;
  imageAlt: string;
  currently: { lead: string; rest: string }[];
}

export interface Intro {
  heading: string;
  lede: string;
}

export interface FlowNode {
  title: string;
  detail: string;
  highlight?: boolean;
}

export interface FeaturedWork {
  context: string;
  title: string;
  description: string;
  link?: { href: string; text: string };
  flowLabel: string;
  flow: FlowNode[];
}

export interface Metric {
  value: string;
  label: string;
  before?: string;
}

export interface WorkItem {
  context: string;
  title: string;
  description: string;
  metric: Metric;
}

export interface Role {
  dates: string;
  employer: string;
  logo: string;
  title: string;
  line: string;
  bullets: string[];
}

export interface Education {
  year: string;
  school: string;
  logo: string;
  degree: string;
}

export interface Screenshot {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface Project {
  name: string;
  context: string;
  logo: string;
  description: string;
  flowTitle: string;
  flowLabel: string;
  flow: FlowNode[];
  install: string[];
  href: string;
  hrefText: string;
  hrefLabel: string;
  phoneShot: Screenshot;
  wideShot: Screenshot;
}

export interface Repo {
  name: string;
  href: string;
  description: string;
  meta: string[];
}
