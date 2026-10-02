import { getImageUrl } from "../utils/imageUrl";
import {
  Education,
  FeaturedWork,
  Hero,
  HeroAction,
  HomepageMeta,
  Intro,
  NavLink,
  Project,
  Repo,
  Role,
  WorkItem,
} from "./dataDef";

export const homePageMeta: HomepageMeta = {
  title: "Will Fellhoelter - Principal Software Engineer",
  image: getImageUrl("/images/og/card.jpg"),
  description:
    "Will Fellhoelter, Principal Software Engineer in Denver. Eight years across the stack, lately agentic AI: MCP servers, plugin libraries, and the knowledge bases agents work from.",
};

export const resumeHref = "/WillFellhoelterResume.pdf";
export const contactEmail = "willfellhoelter@gmail.com";
export const githubHref = "https://github.com/willfell";
export const linkedInHref = "https://linkedin.com/in/will-fellhoelter-1aa17312b";
export const siteRepoHref = "https://github.com/willfell/will-fell";

export const navLinks: NavLink[] = [
  { href: "#experience", text: "Experience" },
  { href: "#work", text: "Work" },
  { href: "#projects", text: "Projects" },
  { href: "#github", text: "GitHub" },
];

export const heroData: Hero = {
  name: "Will Fellhoelter",
  backgroundSrc: getImageUrl("/images/hero/mountains.jpg"),
  lede: "Eight years across the stack: data, application logic, deploys, the K8s underneath, the alerting on top. I usually end up in the gap between what a client needs and what actually ships, and closing it starts with listening, so what gets built is what was needed. Lately that work points at agentic AI: MCP servers, plugin libraries, and the knowledge bases agents work from.",
  imageSrc: getImageUrl("/images/about/profilepic.jpg"),
  imageAlt: "Will Fellhoelter laughing, in sunglasses, against a blue sky",
  currently: [
    {
      lead: "Principal Software Engineer at Accuris.",
      rest: "Agentic AI development, Operations, K8s.",
    },
    {
      lead: "Building Sauce.",
      rest: "An agentic operating loop for Obsidian, open source.",
    },
  ],
};

export const heroLinks: HeroAction[] = [
  { href: githubHref, text: "GitHub", external: true },
  { href: linkedInHref, text: "LinkedIn", external: true },
  { href: `mailto:${contactEmail}`, text: "Email" },
];

export const selectedWorkIntro: Intro = {
  heading: "Work I’d point you to.",
  lede: "Agent tooling for a whole org, observability for hundreds of services, installs on someone else’s hardware. Built with platform, product, and engineering teams along the way.",
};

export const featuredWork: FeaturedWork[] = [
  {
    context: "Accuris · 2025–2026 · With the platform team",
    title: "MCP Mesh",
    description:
      "Governed agent tooling for the whole org. AgentGateway, the open-source gateway for MCP and agent traffic, runs on K8s and federates 250+ tools behind one endpoint, with SSO and central observability. Built the first internal MCP servers and the plugin library, then, with the platform team, the mesh. Our own servers for New Relic and PagerDuty live inside it, written to avoid paying for vendor connectors.",
    link: { href: "https://agentgateway.dev", text: "agentgateway.dev · the open-source project" },
    flowLabel:
      "How the MCP Mesh fits together: every team uses the plugin library, which goes through AgentGateway on K8s to 250+ federated tools, including the org’s own New Relic and PagerDuty servers",
    flow: [
      { title: "Every team", detail: "Engineering, product, cross-functional" },
      { title: "Plugin library", detail: "Repeatable workflows, not one-off prompts" },
      { title: "AgentGateway", detail: "On K8s: one endpoint, SSO, central observability", highlight: true },
      { title: "250+ tools", detail: "Federated MCP servers, including our own New Relic and PagerDuty" },
    ],
  },
  {
    context: "Accuris · 2026 · Runs on the mesh",
    title: "From a page to a documented root cause",
    description:
      "Point the plugin at a PagerDuty alert. It works through the team’s skills and our own MCP servers, traces the likely root cause in New Relic, and files the write-up in the team’s Obsidian vault. Troubleshooting and documentation happen in the same pass.",
    flowLabel:
      "The incident flow: a PagerDuty alert goes to the agentic plugin, which traces the likely root cause in New Relic through the org’s own MCP server and files the write-up in the team’s Obsidian vault",
    flow: [
      { title: "PagerDuty alert", detail: "The page, linked straight from the plugin" },
      { title: "Agentic plugin", detail: "Team skills plus our own MCP servers", highlight: true },
      { title: "Likely root cause", detail: "From New Relic, through our own MCP server" },
      { title: "Obsidian vault", detail: "Write-up filed for the team, same pass" },
    ],
  },
];

export const workItems: WorkItem[] = [
  {
    context: "Accuris · With the platform team",
    title: "The same observability for every service",
    description:
      "Configured the New Relic K8s operator with the platform team so every service deployed across the org, 400+ of them, gets the same APM injection automatically. No manual setup for developers, consistent naming, and one way to troubleshoot across the org.",
    metric: { value: "400+", label: "Services across the org, instrumented the same way" },
  },
  {
    context: "forml · 2024–2025",
    title: "On-prem in four hours",
    description:
      "First engineering hire at an AI startup. Worked with the founders and enterprise clients to understand what they actually needed, then built one-click on-prem deployment so the deals that required customer-hosted installs could close.",
    metric: { before: "3 days", value: "4 hours", label: "Enterprise onboarding time" },
  },
  {
    context: "Cerner · Lendflow · Project Canary",
    title: "Ephemeral environments, three times",
    description:
      "Self-service test environments with data seeding and automatic cleanup, built for three different orgs: an AWX portal at Cerner, ephemeral infrastructure for dev and QA at Lendflow, a UI with branch and data-source selection at Project Canary. The problem I keep getting handed.",
    metric: { value: "−32%", label: "Environment costs at Lendflow" },
  },
];

export const roles: Role[] = [
  {
    dates: "Mar 2026 – Now",
    employer: "Accuris",
    logo: getImageUrl("/images/logos/accuris-logo.png"),
    title: "Principal Software Engineer",
    line: "MCP Mesh, observability, multi-region K8s",
    bullets: [
      "With the platform team, built and launched the MCP Mesh on AgentGateway: one governed entry point to 250+ tools for engineering, product, and cross-functional teams, with SSO and centralized observability",
      "Designed and shipped production MCP servers that give AI agents natural-language access to internal systems, including our own New Relic and PagerDuty servers in place of paid vendor connectors",
      "Built the incident plugin that takes a PagerDuty alert to a root cause in New Relic and documents it in the team’s Obsidian vault in the same pass",
      "Grew the AI plugin library into how teams use AI day to day, turning one-off prompts into repeatable workflows",
      "With the platform team, rolled out the New Relic K8s operator so 400+ deployed services get consistent APM injection with no manual work from developers, standardizing naming and troubleshooting across the org",
      "Operate 100+ microservices on K8s across 6 regions; led the multi-region buildout of compute and data tiers",
      "Help map out and drive the standardization of deployment and CI/CD across 1,000+ repositories with templated K8s",
      "Build and run CDC pipelines from PostgreSQL into Databricks for mission-critical data",
    ],
  },
  {
    dates: "Apr 2025 – Mar 2026",
    employer: "Accuris",
    logo: getImageUrl("/images/logos/accuris-logo.png"),
    title: "Senior Software Engineer",
    line: "GitHub migration, first internal MCP servers",
    bullets: [
      "Led the move of 1,000+ repositories to GitHub and consolidated CI onto GitHub Actions with reusable workflows",
      "Built the first internal MCP servers and the original AI plugin library",
    ],
  },
  {
    dates: "Aug 2024 – Apr 2025",
    employer: "forml",
    logo: getImageUrl("/images/logos/forml-logo.png"),
    logoTone: "white",
    title: "Full Stack Engineer, Senior from Jan 2025",
    line: "First engineering hire, on-prem deploys",
    bullets: [
      "First engineering hire; worked directly with the founders and enterprise clients to scope requirements, set quarterly roadmaps, and ship the platform end to end (Python, Angular, AWS, PostgreSQL)",
      "Built one-click on-prem deployment for enterprise clients, cutting onboarding from 3 days to 4 hours and unblocking deals that required customer-hosted installs",
      "Led the API and architecture work that carried the platform through 2x user growth in 2 months; promoted to Senior",
    ],
  },
  {
    dates: "May 2023 – Aug 2024",
    employer: "Project Canary",
    logo: getImageUrl("/images/logos/project-canary-logo.png"),
    logoTone: "white",
    title: "DevOps Engineer",
    line: "Ephemeral environments, RAG, SOC 2",
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
    logo: getImageUrl("/images/logos/lendflow-logo.png"),
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
    employer: "MCG Health",
    logo: getImageUrl("/images/logos/mcg-logo.png"),
    title: "Cloud / DevOps Engineer",
    line: "On-prem to Azure, Chef to Ansible",
    bullets: [
      "Led the migration from on-prem infrastructure to Azure for 3+ teams",
      "Built modular Terraform components that cut new environment setup from ~2 days to 1 hour",
      "Moved configuration management for 100+ Windows servers from Chef to Ansible, with Datadog monitoring",
    ],
  },
  {
    dates: "Oct 2018 – Mar 2020",
    employer: "Cerner Corporation",
    logo: getImageUrl("/images/logos/cerner-logo.png"),
    title: "System Engineer",
    line: "Ansible automation, AWX portal",
    bullets: [
      "Wrote Ansible playbooks for server configuration and troubleshooting, saving the team 40+ hours a month",
      "Built an AWX-based portal for scheduling data restores and spinning up ephemeral test environments",
      "Taught biweekly Linux fundamentals sessions for new hires through Cerner’s Tech Academy",
    ],
  },
];

export const education: Education = {
  year: "2018",
  school: "Wichita State University",
  logo: getImageUrl("/images/logos/wsu-logo.png"),
  degree: "Management Information Systems",
};

export const experienceHeading = "Eight years, seven roles.";

export const sauce: Project = {
  name: "Sauce",
  context: "Open source · 2026– · MIT",
  logo: getImageUrl("/images/projects/obsidian.svg"),
  description:
    "An agentic operating loop for Obsidian. Notes become node-based work graphs that agents like Claude Code and Codex execute in isolated workers, with scheduling, retries, handoffs between agents, and a persistent task store. Started as a loop-based forward deployment mechanism, rebuilt around graphs. Versioned vault platform shipped via Homebrew, MIT.",
  flowTitle: "How a run works",
  flowLabel:
    "How a Sauce run works: a graph note goes to the dispatcher, which runs Claude Code and Codex workers in their own git worktrees and writes every outcome back into the vault",
  flow: [
    { title: "Graph note", detail: "Agent, judge, shell and human nodes in an Obsidian note" },
    { title: "Dispatcher", detail: "sauce run fires edges, with retry budgets", highlight: true },
    { title: "Workers", detail: "Claude Code and Codex, each in its own git worktree" },
    { title: "Back into the vault", detail: "An append-only ledger and a Runs section in the note" },
  ],
  install: ["brew tap willfell/sauce", "brew install willfell/sauce/sauce"],
  href: "https://github.com/willfell/sauce",
  hrefText: "github.com/willfell/sauce",
  hrefLabel: "github.com/willfell/sauce (Sauce on GitHub)",
  phoneShot: {
    src: getImageUrl("/images/projects/sauce-epic.png"),
    alt: "Obsidian on a phone showing the epic note Delivery Coordinator Rail Repairs: three slice cards, OPS-1, OPS-2b and OPS-3c, each marked done, and a rollup reading 3 deployed",
    caption: "An epic and its slices on a phone. Card status is projected from the coordinator’s ledger, not typed by hand.",
    width: 553,
    height: 1200,
  },
  wideShot: {
    src: getImageUrl("/images/projects/sauce-dependency-graph.png"),
    alt: "A dependency graph in Obsidian with slice cards PERF-9a in progress and PERF-10a done, and a dashed placeholder node standing in for work in another epic",
    caption: "A wider dependency graph. The dashed node stands in for a dependency that lives in another epic.",
    width: 1400,
    height: 645,
  },
};

export const contributionsCaption =
  "Most since May are Sauce: agents do the work in their own git worktrees, and I steer and merge what lands.";

export const repos: Repo[] = [
  {
    name: "willfell/sauce",
    href: "https://github.com/willfell/sauce",
    description:
      "Agentic operating loop for Obsidian: node-based agent execution, versioned vault platform, shipped via Homebrew",
    meta: ["JavaScript", "MIT"],
  },
  {
    name: "willfell/will-fell",
    href: siteRepoHref,
    description:
      "This site. Next.js and Terraform on S3 and CloudFront, deployed by GitHub Actions on every merge.",
    meta: ["TypeScript", "Terraform"],
  },
];
