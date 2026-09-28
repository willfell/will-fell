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
    bullets: [
      "Built and launched the MCP mesh: one governed entry point to 250+ tools for engineering, product, and cross-functional teams, with SSO and centralized observability",
      "Designed and shipped production MCP servers that give AI agents natural-language access to internal systems",
      "Grew the AI plugin library into how teams use AI day to day, turning one-off prompts into repeatable workflows",
      "Operate 100+ microservices on Kubernetes across 6 regions; led the multi-region buildout of compute and data tiers",
      "Help map out and drive the standardization of deployment and CI/CD across 1,000+ repositories with templated Kubernetes",
      "Own architecture and cost across 70+ AWS accounts, reviewing designs with teams for cost and security",
      "Build and run CDC pipelines from PostgreSQL into Databricks for mission-critical data",
    ],
  },
  {
    dates: "Apr 2025 – Mar 2026",
    employer: "Accuris",
    title: "Senior Software Engineer",
    line: "GitHub migration, first internal MCP servers",
    bullets: [
      "Led the move of 1,000+ repositories to GitHub and consolidated CI onto GitHub Actions with reusable workflows",
      "Built the first internal MCP servers and the original AI plugin library",
    ],
  },
  {
    dates: "Aug 2024 – Apr 2025",
    employer: "Forml",
    title: "Senior Full Stack Engineer",
    line: "first engineering hire, on-prem deploys",
    bullets: [
      "First engineering hire; worked directly with the founders and enterprise clients to scope requirements, set quarterly roadmaps, and ship the platform end to end (Python, Angular, AWS, PostgreSQL)",
      "Built one-click on-prem deployment for enterprise clients, cutting onboarding from 3 days to 4 hours and unblocking deals that required customer-hosted installs",
      "Led the API and architecture work that carried the platform through 2x user growth in 2 months; promoted to Senior",
    ],
  },
  {
    dates: "May 2023 – Aug 2024",
    employer: "Project Canary",
    title: "DevOps Engineer",
    line: "ephemeral environments, RAG, SOC 2",
    bullets: [
      "Built a self-service tool that lets developers and QA deploy an isolated test environment from any branch in one click, with selectable data sources and automatic cleanup",
      "Built a RAG search app on AWS Bedrock and vector databases for querying internal documents across departments",
      "Ran observability for 10+ critical services (99.99% uptime) and moved it to New Relic, cutting monitoring costs 14%",
      "Fixed bottlenecks in high-throughput time-series PostgreSQL databases, improving query performance 23%",
      "Drove the security work behind passing SOC 2 Type I and Type II, automating controls and cutting audit prep ~30%",
    ],
  },
  {
    dates: "Aug 2021 – May 2023",
    employer: "Lendflow",
    title: "DevSecOps Engineer",
    line: "OpenSearch logging, WAF, on-call",
    bullets: [
      "Centralized logging on OpenSearch, cutting the time to pinpoint production issues from ~3 hours to under 10 minutes",
      "Built ephemeral dev and QA environments to replace always-on ones, cutting environment costs 32%",
      "Put AWS WAF and CloudFront in front of the platform, reducing security incidents 60%",
      "On-call engineer for a platform serving 20K+ users; cut average ticket resolution time 25%",
    ],
  },
  {
    dates: "Mar 2020 – Aug 2021",
    employer: "MCG",
    title: "DevOps Engineer",
    line: "on-prem to Azure, Chef to Ansible",
    bullets: [
      "Led the migration from on-prem infrastructure to Azure for 3+ teams",
      "Built modular Terraform components that cut new environment setup from ~2 days to 1 hour",
      "Moved configuration management for 100+ Windows servers from Chef to Ansible, with Datadog monitoring",
    ],
  },
  {
    dates: "Oct 2018 – Mar 2020",
    employer: "Cerner",
    title: "Systems Engineer",
    line: "Ansible automation, AWX portal",
    bullets: [
      "Wrote Ansible playbooks for server configuration and troubleshooting, saving the team 40+ hours a month",
      "Built an AWX-based portal for scheduling data restores and spinning up ephemeral test environments",
      "Taught biweekly Linux fundamentals sessions for new hires through Cerner’s Tech Academy",
    ],
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
