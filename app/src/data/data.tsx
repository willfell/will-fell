import GithubIcon from "../components/Icon/GithubIcon";
import LinkedInIcon from "../components/Icon/LinkedInIcon";
import StravaIcon from "../components/Icon/StravaIcon";
import { getImageUrl } from "../utils/imageUrl";
import {
  About,
  Hero,
  HomepageMeta,
  Role,
  SelectedWorkItem,
  Social,
} from "./dataDef";

export const homePageMeta: HomepageMeta = {
  title: "Will Fellhoelter - Principal Software Engineer",
  description:
    "Portfolio for Will Fellhoelter, Principal Software Engineer. Eight years across the stack, lately agentic AI infrastructure, MCP, and Kubernetes at scale.",
};

export const resumeHref = "/WillFellhoelterResume.pdf";

export const contactEmail = "willfellhoelter@gmail.com";

export const heroData: Hero = {
  name: "Will Fellhoelter",
  description:
    "Principal Software Engineer in Denver. Eight years across the stack, from data and application code to the Kubernetes underneath. Lately that points at agentic AI infrastructure at scale.",
  imageSrc: getImageUrl("/images/about/profilepic.jpg"),
  imageAlt: "Will Fellhoelter",
  actions: [
    { href: resumeHref, text: "Resume ↓", primary: true, download: true },
    { href: "https://github.com/willfell", text: "GitHub" },
    {
      href: "https://linkedin.com/in/will-fellhoelter-1aa17312b",
      text: "LinkedIn",
    },
  ],
};

export const aboutData: About = {
  description:
    "I usually end up wherever the gap is between what a client needs and what actually ships: data, application logic, deploys, the Kubernetes underneath, the alerting on top. At Accuris that means the MCP mesh connecting 250+ tools to every team, operations for 100+ microservices across 6 regions, a few services of my own the wider org depends on, and helping map out the work standardizing CI/CD across 1,000+ repos. Before that, first engineering hire at an AI startup, working with founders and enterprise clients. Wichita State, MIS, 2018. Open to forward deployed and platform roles.",
};

export const selectedWork: SelectedWorkItem[] = [
  {
    title: "MCP mesh",
    context: "Accuris · 2025–2026",
    description:
      "Governed agent tooling for the whole org: 250+ tools behind one gateway, SSO, central observability. Built the first internal MCP servers and the plugin library, then the mesh every team uses.",
  },
  {
    title: "Sauce",
    context: "Open source · 2026–",
    description:
      "An agentic operating loop for Obsidian. Notes become node-based work graphs that agents like Claude Code and Codex execute in isolated workers, with scheduling, retries, handoffs between agents, and a persistent task store. Started as a loop-based forward deployment mechanism, rebuilt around graphs. Versioned vault platform shipped via Homebrew, MIT.",
    href: "https://github.com/willfell/sauce",
  },
  {
    title: "Ephemeral environments, three times",
    context: "Cerner · Lendflow · Project Canary",
    description:
      "Self-service test environments with data seeding and automatic cleanup, built for three different orgs: an AWX portal at Cerner, ephemeral infrastructure for dev and QA at Lendflow, a UI with branch and data-source selection at Project Canary. The problem I keep getting handed.",
  },
];

export const roles: Role[] = [
  {
    dates: "Mar 2026 – now",
    employer: "Accuris",
    title: "Principal Software Engineer",
    line: "MCP mesh, multi-region Kubernetes, 70+ AWS accounts",
  },
  {
    dates: "Apr 2025 – Mar 2026",
    employer: "Accuris",
    title: "Senior Software Engineer",
    line: "GitHub migration, first internal MCP servers",
  },
  {
    dates: "Aug 2024 – Apr 2025",
    employer: "Forml",
    title: "Senior Full Stack Engineer",
    line: "first engineering hire, on-prem deploys",
  },
  {
    dates: "May 2023 – Aug 2024",
    employer: "Project Canary",
    title: "DevOps Engineer",
    line: "observability, ephemeral environments, RAG",
  },
  {
    dates: "Aug 2021 – May 2023",
    employer: "Lendflow",
    title: "DevSecOps Engineer",
    line: "SOC 2, on-call, OpenSearch logging",
  },
  {
    dates: "Mar 2020 – Aug 2021",
    employer: "MCG",
    title: "DevOps Engineer",
    line: "on-prem to Azure, Chef to Ansible",
  },
  {
    dates: "Oct 2018 – Mar 2020",
    employer: "Cerner",
    title: "Systems Engineer",
    line: "600+ vSphere hosts, AWX portal",
  },
];

export const socialLinks: Social[] = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/will-fellhoelter-1aa17312b",
    Icon: LinkedInIcon,
  },
  { label: "GitHub", href: "https://github.com/willfell", Icon: GithubIcon },
  {
    label: "Strava",
    href: "https://www.strava.com/athletes/112909908",
    Icon: StravaIcon,
  },
];
