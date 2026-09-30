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
  headline: string;
  emphasis: string;
  lede: string;
  imageSrc: string;
  imageAlt: string;
  currently: { lead: string; rest: string }[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface Intro {
  heading: string;
  lede: string;
}

export interface Step {
  title: string;
  body: string;
  example: string;
}

export interface HowIWork extends Intro {
  steps: Step[];
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
  metric?: Metric;
  install?: string[];
  href?: string;
  hrefText?: string;
  hrefLabel?: string;
}

export interface Role {
  dates: string;
  employer: string;
  title: string;
  line: string;
  bullets: string[];
}

export interface Education {
  year: string;
  school: string;
  degree: string;
}

export interface Position {
  title: string;
  body: string;
}

export interface Repo {
  name: string;
  href: string;
  description: string;
  meta: string[];
}
