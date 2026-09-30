import { getImageUrl } from "../utils/imageUrl";
import {
  Education,
  FeaturedWork,
  Hero,
  HeroAction,
  HomepageMeta,
  HowIWork,
  Intro,
  NavLink,
  Position,
  Repo,
  Role,
  Stat,
  WorkItem,
} from "./dataDef";

export const homePageMeta: HomepageMeta = {
  title: "Will Fellhoelter - Principal Software Engineer",
  description:
    "Will Fellhoelter, Principal Software Engineer in Denver. Eight years across the stack, lately agentic AI: MCP servers, plugin libraries, and the knowledge bases agents work from.",
};

export const resumeHref = "/WillFellhoelterResume.pdf";
export const contactEmail = "willfellhoelter@gmail.com";
export const githubHref = "https://github.com/willfell";
export const linkedInHref = "https://linkedin.com/in/will-fellhoelter-1aa17312b";
export const stravaHref = "https://www.strava.com/athletes/112909908";
export const siteRepoHref = "https://github.com/willfell/will-fell";

export const navLinks: NavLink[] = [
  { href: "#work", text: "Work" },
  { href: "#experience", text: "Experience" },
  { href: "#positions", text: "Positions" },
  { href: "#github", text: "GitHub" },
];

export const heroData: Hero = {
  headline: "I end up wherever the gap is between what a client needs and",
  emphasis: "what actually ships.",
  lede: "Eight years across the stack: data, application logic, deploys, the K8s underneath, the alerting on top. Most of it starts with listening, so what gets built is what was actually needed. Lately that points at agentic AI: MCP servers, plugin libraries, and the knowledge bases agents work from.",
  imageSrc: getImageUrl("/images/about/profilepic.jpg"),
  imageAlt: "Will Fellhoelter laughing, in sunglasses, against a blue sky",
  currently: [
    {
      lead: "Principal Software Engineer at Accuris.",
      rest: "Agentic AI development, operations, K8s. Jack of all trades and master of none.",
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

export const stats: Stat[] = [
  { value: "8", label: "Years across the stack" },
  { value: "250+", label: "Tools behind the org’s MCP gateway" },
  { value: "100+", label: "Microservices in operations, 6 regions" },
  { value: "1,000+", label: "Repositories moved to GitHub" },
  { value: "70+", label: "AWS accounts reviewed for architecture and cost" },
];

export const statsCaption = "Accuris, 2025 to now. All of it with a team.";

export const howIWork: HowIWork = {
  heading: "Defined, communicated, delivered.",
  lede: "It starts with listening: understanding what someone actually needs, then using the engineering to get there without the misunderstandings that derail most projects. Then making it repeatable, so the next team doesn’t start from zero.",
  steps: [
    {
      title: "Defined",
      body: "Sit with the people who need the thing. Listen more than talk. Pin down what done looks like before anyone writes code.",
      example: "forml → first engineering hire, scoping with founders and enterprise clients",
    },
    {
      title: "Communicated",
      body: "Say it back in plain language, argue the approach while it’s still cheap, and keep the decision where everyone can find it.",
      example: "Accuris → design reviews with teams across 70+ AWS accounts",
    },
    {
      title: "Delivered",
      body: "Data, application code, deploys, the K8s underneath, the alerting on top. Whatever layer the outcome needs.",
      example: "forml → one-click on-prem installs, onboarding from 3 days to 4 hours",
    },
    {
      title: "Repeatable",
      body: "Turn the one-off into the pattern: an MCP server, a plugin, a template, a note an agent can read.",
      example: "Accuris → the plugin library and MCP mesh teams use every day",
    },
  ],
};

export const selectedWorkIntro: Intro = {
  heading: "Work I’d point you to.",
  lede: "Agent tooling for a whole org, observability for hundreds of services, installs on someone else’s hardware. Built with platform, product, and engineering teams along the way.",
};

export const featuredWork: FeaturedWork[] = [
  {
    context: "Accuris · 2025–2026 · With the platform team",
    title: "MCP mesh",
    description:
      "Governed agent tooling for the whole org: 250+ tools behind one gateway, SSO, central observability. Built the first internal MCP servers and the plugin library, then, with the platform team, the mesh every team uses. Our own servers for New Relic and PagerDuty live inside it instead of paid vendor connectors.",
    flowLabel:
      "How the mesh fits together: every team uses the plugin library, which goes through the MCP gateway to 250+ tools, including the org’s own New Relic and PagerDuty servers",
    flow: [
      { title: "Every team", detail: "Engineering, product, cross-functional" },
      { title: "Plugin library", detail: "Repeatable workflows, not one-off prompts" },
      { title: "MCP gateway", detail: "SSO and central observability", highlight: true },
      { title: "250+ tools", detail: "Including our own New Relic and PagerDuty servers" },
    ],
  },
  {
    context: "Accuris · 2026 · Runs on the mesh",
    title: "From a page to a documented root cause",
    description:
      "Point the plugin at a PagerDuty alert. It works through the team’s skills and our own context-aware MCP servers, finds the root cause in New Relic, and writes the finding into the team’s Obsidian vault. Troubleshooting and documentation happen in one pass, so the notes are never behind the incident.",
    flowLabel:
      "The incident flow: a PagerDuty alert goes to the agentic plugin, which finds the root cause in New Relic through the org’s own MCP server and documents it in the team’s Obsidian vault",
    flow: [
      { title: "PagerDuty alert", detail: "The page, linked straight from the plugin" },
      { title: "Agentic plugin", detail: "Team skills plus context-aware MCPs", highlight: true },
      { title: "Root cause in New Relic", detail: "Through our own MCP server, not a paid connector" },
      { title: "Obsidian vault", detail: "Documented for the team, same pass" },
    ],
  },
];

export const workItems: WorkItem[] = [
  {
    context: "Accuris · With the platform team",
    title: "The same observability for every service",
    description:
      "Configured the New Relic K8s operator with the platform team so every deployed service gets the same APM injection automatically. No manual setup for developers, consistent naming, and one way to troubleshoot across the org.",
    metric: { value: "400+", label: "Services instrumented the same way, no developer effort" },
  },
  {
    context: "Open source · 2026–",
    title: "Sauce",
    description:
      "An agentic operating loop for Obsidian. Notes become node-based work graphs that agents like Claude Code and Codex execute in isolated workers, with scheduling, retries, handoffs between agents, and a persistent task store. Started as a loop-based forward deployment mechanism, rebuilt around graphs. Versioned vault platform shipped via Homebrew, MIT.",
    install: ["brew tap willfell/sauce", "brew install willfell/sauce/sauce"],
    href: "https://github.com/willfell/sauce",
    hrefText: "github.com/willfell/sauce",
    hrefLabel: "github.com/willfell/sauce (Sauce on GitHub)",
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
    title: "Principal Software Engineer",
    line: "MCP mesh, observability, multi-region K8s, 70+ AWS accounts",
    bullets: [
      "Built and launched the MCP mesh: one governed entry point to 250+ tools for engineering, product, and cross-functional teams, with SSO and centralized observability",
      "Designed and shipped production MCP servers that give AI agents natural-language access to internal systems, including our own New Relic and PagerDuty servers in place of paid vendor connectors",
      "Built the incident plugin that takes a PagerDuty alert to a root cause in New Relic and documents it in the team’s Obsidian vault in the same pass",
      "Grew the AI plugin library into how teams use AI day to day, turning one-off prompts into repeatable workflows",
      "With the platform team, rolled out the New Relic K8s operator so 400+ deployed services get consistent APM injection with no manual work from developers, standardizing naming and troubleshooting across the org",
      "Operate 100+ microservices on K8s across 6 regions; led the multi-region buildout of compute and data tiers",
      "Help map out and drive the standardization of deployment and CI/CD across 1,000+ repositories with templated K8s",
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
    employer: "forml",
    title: "Senior Full Stack Engineer",
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
  degree: "Management Information Systems",
};

export const experienceHeading = "Eight years, seven roles.";

export const positionsIntro: Intro = {
  heading: "Things I’ll argue for.",
  lede: "I like a real discussion about the right way to do things, and I change my mind when the better argument wins. These are the ones I keep coming back to.",
};

export const positions: Position[] = [
  {
    title: "Listen first, argue early, write it down.",
    body: "Most rework comes from a misunderstanding nobody caught early. So I listen more than I talk, push back while it’s still cheap, and put the decision where the next person will look.",
  },
  {
    title: "Plugins over prompts.",
    body: "A prompt helps one person, once. A plugin backed by an MCP server gives a whole team the same tools, the same context, and the same result.",
  },
  {
    title: "The knowledge base comes first.",
    body: "Personal notes, team runbooks, org decisions. If it isn’t somewhere an agent can read it, the agent is guessing. Obsidian, for me and for the teams I work with.",
  },
  {
    title: "Workflows need a schema.",
    body: "Agents are only as consistent as the work they’re handed. Typed notes, templates, and defined handoffs beat clever one-off chains. Sauce is that idea, open-sourced.",
  },
];

export const repos: Repo[] = [
  {
    name: "willfell/sauce",
    href: "https://github.com/willfell/sauce",
    description:
      "Agentic operating loop for Obsidian: node-based agent execution, versioned vault platform, shipped via Homebrew",
    meta: ["JavaScript", "MIT"],
  },
  {
    name: "willfell/homebrew-sauce",
    href: "https://github.com/willfell/homebrew-sauce",
    description: "Brew up the sauce",
    meta: ["Ruby", "Homebrew tap"],
  },
  {
    name: "willfell/will-fell",
    href: siteRepoHref,
    description:
      "This site. Next.js and Terraform on S3 and CloudFront, deployed by GitHub Actions on every merge.",
    meta: ["TypeScript", "Terraform"],
  },
];

export const contact: Intro = {
  heading: "Working on something that needs to ship?",
  lede: "Platform, AI, customer-facing engineering, or a role that doesn’t have a name yet. If the hard part is getting it into people’s hands, I’d like to hear about it.",
};
