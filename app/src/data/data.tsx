import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

import balancedBriefImage from "../images/passion-projects/balanced-brief.png";
import universityLogo from "../images/wsu-logo.png";
import formlLogo from "../images/forml-logo.png";
import projectCanaryLogo from "../images/project-canary-logo.png";
import lendflowLogo from "../images/lendflow-logo.png";
import mcgLogo from "../images/mcg-logo.png";
import cernerLogo from "../images/cerner-logo.png";
import heroImage from "../images/header-background.jpg";
import porfolioImage1 from "../images/portfolio/portfolio-1.jpg";
import profilepic from "../images/aboutmepic.jpg";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import {
  About,
  ContactSection,
  ContactType,
  Hero,
  HomepageMeta,
  PortfolioItem,
  SkillGroup,
  Social,
  TestimonialSection,
  TimelineItem,
} from "./dataDef";

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
  title: "Will Fellhoelter - DevOps & Full Stack Engineer",
  description:
    "Portfolio website for Will Fellhoelter, a DevOps and Full Stack Engineer with over 6 years of experience",
};

/**
 * Section definition
 */
export const SectionId = {
  Hero: "hero",
  About: "about",
  Contact: "contact",
  Portfolio: "portfolio",
  Education: "eduction",
  Experience: "experience",
  Skills: "skills",
  Stats: "stats",
  Testimonials: "testimonials",
} as const;

export type SectionId = (typeof SectionId)[keyof typeof SectionId];

/**
 * Hero section
 */
export const heroData: Hero = {
  name: "Will Fellhoelter",
  description: (
    <>
      <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
        I'm a Denver-based{" "}
        <strong className="text-stone-100">DevOps & Full Stack Engineer</strong>{" "}
        with over 6 years of experience designing and operating
        developer-centric infrastructure and automation solutions.
      </p>
    </>
  ),
  actions: [
    {
      href: "/#about",
      text: "About Me",
      primary: false,
    },
    {
      href: "/WillFellhoelterResume.pdf",
      text: "Resume",
      primary: true,
      download: true,
      Icon: ArrowDownTrayIcon,
    },
  ],
  imageSrc: heroImage,
};

/**
 * About section
 */
export const aboutData: About = {
  profileImageSrc: profilepic,
  description: `DevOps/Full Stack Engineer with 6+ years of experience designing and operating developer-centric 
  infrastructure and automation solutions. Passionate about building self-service platforms, optimizing developer 
  velocity, and enhancing developer workflows. Proficient with containerized solutions, Terraform, CI/CD, and cloud 
  automation at scale, with a strong focus on reliability, security, and observability.`,
  aboutItems: [
    { label: "Location", text: "Denver, CO", Icon: MapIcon },
    { label: "Age", text: "28", Icon: CalendarIcon },
    { label: "Study", text: "Wichita State University", Icon: AcademicCapIcon },
    {
      label: "Employment",
      text: "Forml, Senior Full Stack Engineer",
      Icon: BuildingOffice2Icon,
    },
  ],
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = [
  {
    name: "Infrastructure & Platforms",
    skills: [
      {
        name: "AWS",
        level: 9,
        logo: "/images/icons/aws.svg",
      },
      {
        name: "Terraform",
        level: 8,
        logo: "/images/icons/terraform.svg",
      },
      {
        name: "Docker",
        level: 9,
        logo: "/images/icons/docker.svg",
      },
      {
        name: "Kubernetes",
        level: 7,
        logo: "/images/icons/kubernetes.svg",
      },
      {
        name: "Azure",
        level: 7,
        logo: "/images/icons/azure.svg",
      },
      {
        name: "GCP",
        level: 6,
        logo: "/images/icons/gcp.svg",
      },
    ],
  },
  {
    name: "Programming Languages",
    skills: [
      {
        name: "Python",
        level: 9,
        logo: "/images/icons/python.svg",
      },
      {
        name: "TypeScript/JavaScript",
        level: 8,
        logo: "/images/icons/typescript.svg",
      },
      {
        name: "Bash",
        level: 8,
        logo: "/images/icons/bash.svg",
      },
      {
        name: "Java",
        level: 6,
        logo: "/images/icons/java.svg",
      },
      {
        name: "C#/.NET",
        level: 6,
        logo: "/images/icons/csharp.svg",
      },
    ],
  },
  {
    name: "Observability & Reliability",
    skills: [
      {
        name: "New Relic",
        level: 8,
        logo: "/images/icons/newrelic.svg",
      },
      {
        name: "Prometheus",
        level: 7,
        logo: "/images/icons/prometheus.svg",
      },
      {
        name: "Datadog",
        level: 7,
        logo: "/images/icons/datadog.svg",
      },
      {
        name: "AWS CloudWatch",
        level: 8,
        logo: "/images/icons/cloudwatch.svg",
      },
      {
        name: "Splunk",
        level: 7,
        logo: "/images/icons/splunk.svg",
      },
    ],
  },
  {
    name: "CI/CD & Developer Enablement",
    skills: [
      {
        name: "GitHub Actions",
        level: 9,
        logo: "/images/icons/github-actions.svg",
      },
      {
        name: "GitOps",
        level: 8,
        logo: "/images/icons/gitops.svg",
      },
      {
        name: "ArgoCD",
        level: 7,
        logo: "/images/icons/argocd.svg",
      },
      {
        name: "Bitbucket Pipelines",
        level: 8,
        logo: "/images/icons/bitbucket.svg",
      },
      {
        name: "AWS CodePipeline",
        level: 7,
        logo: "/images/icons/codepipeline.svg",
      },
    ],
  },
];

/**
 * Resume section -- TODO: Standardize resume contact format or offer MDX
 */
export const education: TimelineItem[] = [
  {
    date: "2014-2018",
    location: "Wichita State University",
    title: "Management Information Systems",
    imageSrc: universityLogo,
    content: (
      <p>
        Earned a degree in Management Information Systems at Wichita State
        University.
      </p>
    ),
  },
];

export const experience: TimelineItem[] = [
  {
    date: "July 2024 - Present",
    location: "Forml (Remote)",
    title: "Senior Full Stack Engineer",
    imageSrc: formlLogo,
    content: (
      <ul className="list-disc pl-8">
        <li>
          Lead end-to-end development of a robust, full-stack platform
          leveraging Python, Angular, AWS, Redis, and PostgreSQL as the first
          engineering hire
        </li>
        <li>
          Create sophisticated API integrations and system architectures,
          enabling the platform to support twice the user base within two months
        </li>
        <li>
          Collaborate closely with founders and clients to craft quarterly
          roadmaps, ensuring product vision aligns seamlessly with technical
          execution
        </li>
        <li>
          Design and maintain secure, high-performance external APIs using AWS,
          Terraform, and Python
        </li>
        <li>
          Engineer streamlined, one-click deployment solutions for on-premise
          clients, reducing onboarding time from 3 days to just 4 hours
        </li>
      </ul>
    ),
  },
  {
    date: "May 2023 - July 2024",
    location: "Project Canary, Denver",
    title: "DevOps Engineer",
    imageSrc: projectCanaryLogo,
    content: (
      <ul className="list-disc pl-8">
        <li>
          Orchestrated enterprise-wide observability strategy for 10+ critical
          services, implementing proactive monitoring that maintained 99.99%
          uptime
        </li>
        <li>
          Built a self-service ephemeral environment tool with a UI for branch
          selection, data sources, and one-click deployment
        </li>
        <li>
          Architected performance optimizations for high-throughput time-series
          PostgreSQL databases, improving query performance by 23%
        </li>
        <li>
          Planned and executed migration of observability infrastructure to New
          Relic, reducing monitoring costs by 14%
        </li>
        <li>
          Created a full-stack retrieval augmented generation application using
          AWS Bedrock and vector databases, increasing cross-departmental
          information access efficiency by 80%
        </li>
      </ul>
    ),
  },
  {
    date: "August 2021 - May 2023",
    location: "Lendflow (Remote)",
    title: "DevSecOps Engineer",
    imageSrc: lendflowLogo,
    content: (
      <ul className="list-disc pl-8">
        <li>
          Built ephemeral infrastructure solutions for developers and QA,
          eliminating persistent environment costs by 32%
        </li>
        <li>
          Enhanced logging and observability by implementing a centralized
          OpenSearch solution, reducing issue identification time from ~3 hours
          to under 10 minutes
        </li>
        <li>
          Served as on-call engineer, ensuring 99.9999% uptime for 20K+ users by
          managing incident response
        </li>
        <li>
          Developed a Flask-based API integration for automated client billing,
          reducing manual invoicing efforts by 70%
        </li>
        <li>
          Implemented AWS WAF and CloudFront to reduce security incidents by 60%
          and strengthen application security posture
        </li>
      </ul>
    ),
  },
  {
    date: "February 2020 - August 2021",
    location: "MCG (Remote)",
    title: "DevOps Engineer",
    imageSrc: mcgLogo,
    content: (
      <ul className="list-disc pl-8">
        <li>
          Led migration from on-premises infrastructure to Azure Cloud for 3+
          teams, achieving 99.9999% annual uptime
        </li>
        <li>
          Migrated configuration management from Chef to Ansible for 100+
          Windows servers, reducing configuration errors by 82%
        </li>
        <li>
          Engineered load testing frameworks using JMeter and Azure Container
          Instances, validating platform reliability at scale
        </li>
        <li>
          Designed modular Terraform components to standardize cloud
          infrastructure, accelerating new environment setup from approximately
          2 days to 1 hour
        </li>
      </ul>
    ),
  },
  {
    date: "September 2018 - August 2021",
    location: "Cerner, Kansas City",
    title: "Systems Engineer",
    imageSrc: cernerLogo,
    content: (
      <ul className="list-disc pl-8">
        <li>
          Built an AWX-powered UI for scheduling data restoration jobs and
          spinning up ephemeral test environments
        </li>
        <li>
          Managed patching, upgrades, and support for 600+ hosts in vSphere,
          ensuring system stability and security
        </li>
        <li>
          Utilized tools like Git, Chef, Ansible, Jenkins, Splunk, and AWS to
          drive automation and continuous delivery
        </li>
        <li>
          Created Ansible playbooks to automate server configuration and
          troubleshooting, saving the team 40+ hours per month
        </li>
      </ul>
    ),
  },
];

/**
 * Testimonial section
 */
export const testimonial: TestimonialSection = {
  // imageSrc: testimonialImage,
  testimonials: [
    {
      name: "Achievement: Ephemeral Environment Automation",
      text: "Built ephemeral environment tools enabling on-demand testing, streamlining workflows across development, QA, and customer success teams.",
      image:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/169.jpg",
    },
    {
      name: "Achievement: Cross-Department Efficiency with AI",
      text: "Increased cross-department efficiency by 80% with RAG Application leveraging AWS Bedrock and vector databases for improved knowledge sharing.",
      image:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/14.jpg",
    },
    {
      name: "Achievement: Security Compliance & Readiness",
      text: "Drove security initiatives essential to passing SOC 2 Type I and Type II audits through automated controls and proactive compliance measures.",
      image:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/69.jpg",
    },
  ],
};

/**
 * Contact section
 */

export const contact: ContactSection = {
  headerText: "Get in touch.",
  description:
    "Feel free to reach out if you want to collaborate, have questions about my work, or just want to connect.",
  items: [
    {
      type: ContactType.Email,
      text: "willfellhoelter@gmail.com",
      href: "mailto:willfellhoelter@gmail.com",
    },
    {
      type: ContactType.Location,
      text: "Denver, CO",
      href: "https://maps.google.com/?q=Denver,+CO",
    },
    {
      type: ContactType.LinkedIn,
      text: "LinkedIn",
      href: "https://linkedin.com/in/will-fellhoelter-1aa17312b",
    },
    {
      type: ContactType.Github,
      text: "GitHub",
      href: "https://github.com/willfell?tab=repositories",
    },
  ],
};

/**
 * Social items
 */
export const socialLinks: Social[] = [
  {
    label: "Github",
    logo: "/images/icons/github.svg",
    href: "https://github.com/willfell?tab=repositories",
  },
  {
    label: "LinkedIn",
    logo: "/images/icons/linkedin.svg",
    href: "https://linkedin.com/in/will-fellhoelter-1aa17312b",
  },
  {
    label: "Strava",
    logo: "/images/icons/strava.svg",
    href: "https://www.strava.com/athletes/112909908",
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Balanced Brief",
    description:
      "An automated news aggregator that delivers non-biased content",
    url: "https://github.com/willfell/balanced_brief",
    githubUrl: "https://github.com/willfell/balanced_brief",
    image: balancedBriefImage,
    why: "I needed an automated way of sending me news I wanted, that wasn't biased",
    how: "Built a Python-based system that fetches news from various sources, processes it with OpenAI to remove bias, and delivers personalized content through email. The system runs on AWS ECS and integrates with Reddit to discover trending topics.",
    techStack: ["ECS", "HTML", "CSS", "Python", "SNS", "OpenAI", "Reddit API"],
    techIcons: ["/images/icons/aws.svg", "/images/icons/python.svg"],
    isPassionProject: true,
  },
  {
    title: "Self-Service Ephemeral Environments",
    description:
      "Created a UI tool for developers and QA to instantly create and manage their own isolated test environments with automated cleanup.",
    url: "https://github.com/willfell?tab=repositories",
    image: porfolioImage1,
    isPassionProject: false,
    location: "Project Canary",
    date: "2023-2024",
    summary:
      "Built a comprehensive ephemeral environment solution that allowed developers to spin up isolated testing environments on-demand, complete with data seeding and backend services. This significantly improved development velocity and testing accuracy.",
    techStack: [
      "Terraform",
      "React",
      "AWS",
      "GitHub Actions",
      "PostgreSQL",
      "Docker",
    ],
    how: "Developed a React frontend that communicates with an AWS Lambda API, which orchestrates the creation of isolated environments using Terraform. Each environment is automatically cleaned up after a set time period to save costs.",
  },

  {
    title: "RAG-Powered Document Search",
    description:
      "AI-enhanced knowledge base using Retrieval Augmented Generation for searching across corporate documents.",
    url: "#",
    image: porfolioImage1,
    isPassionProject: false,
    location: "Project Canary",
    date: "2023-2024",
    summary:
      "Developed an internal AI tool that allowed employees to search across thousands of corporate documents, policies, and knowledge base articles using natural language. This dramatically improved information accessibility and reduced time spent looking for answers.",
    techStack: [
      "AWS Bedrock",
      "Python",
      "Flask",
      "Vector Database",
      "React",
      "AWS Lambda",
    ],
    how: "Created a system that ingests documents from various sources, chunks and embeds them using OpenAI, stores them in a vector database, and retrieves relevant information using RAG techniques when users make queries. The interface allows for conversational interaction with company knowledge.",
  },

  {
    title: "Real-time Monitoring Dashboard",
    description:
      "Comprehensive observability solution for tracking system health and performance across the organization.",
    url: "#",
    image: porfolioImage1,
    isPassionProject: false,
    location: "Lendflow",
    date: "2021-2023",
    summary:
      "Orchestrated a complete overhaul of the organization's monitoring infrastructure, implementing a centralized observability platform that provided real-time insights into system health, performance metrics, and business KPIs.",
    techStack: [
      "OpenSearch",
      "AWS CloudWatch",
      "Grafana",
      "Prometheus",
      "Terraform",
      "Python",
    ],
    how: "Integrated data sources from various applications and services into a unified logging and metrics pipeline. Created custom dashboards that provided both technical and business insights, with automated alerting for critical issues.",
  },

  {
    title: "Automated Client Billing API",
    description:
      "Flask-based API integration that streamlined the client invoicing process.",
    url: "#",
    image: porfolioImage1,
    isPassionProject: false,
    location: "Lendflow",
    date: "2022",
    summary:
      "Developed an API solution that automated the client billing process, eliminating manual invoicing steps and ensuring accurate, timely billing for all clients. This reduced accounting workload while improving accuracy.",
    techStack: ["Flask", "Python", "AWS Lambda", "PostgreSQL", "Stripe API"],
    how: "Created a Flask API that integrated with internal usage tracking systems and external payment processors. The system automatically calculated usage-based billing, generated invoices, and processed payments according to client contract terms.",
  },

  {
    title: "Azure Cloud Migration",
    description:
      "Led comprehensive migration from on-premises infrastructure to Azure Cloud for multiple teams.",
    url: "#",
    image: porfolioImage1,
    isPassionProject: false,
    location: "MCG",
    date: "2020-2021",
    summary:
      "Orchestrated a large-scale migration from legacy on-premises infrastructure to Azure Cloud, carefully planning and executing the transition to ensure zero downtime for critical healthcare applications.",
    techStack: [
      "Azure",
      "Terraform",
      "Ansible",
      "PowerShell",
      "Docker",
      "Jenkins",
    ],
    how: "Developed a phased migration strategy that involved infrastructure assessment, application dependency mapping, and carefully orchestrated cutover procedures. Created automation scripts to ensure consistent environment setup and configuration in the cloud.",
  },

  {
    title: "Data Restoration UI Portal",
    description:
      "AWX-powered UI for scheduling data restoration jobs and managing ephemeral environments.",
    url: "#",
    image: porfolioImage1,
    isPassionProject: false,
    location: "Cerner",
    date: "2018-2020",
    summary:
      "Created a self-service portal that enabled teams to manage their own data restoration needs without requiring DevOps intervention. This improved team autonomy while reducing operational overhead.",
    techStack: ["AWX", "Ansible", "Python", "JavaScript", "Jenkins", "vSphere"],
    how: "Built a web interface that integrated with AWX to provide a user-friendly way to schedule and manage data restoration jobs. The system automated the complex backend processes while presenting a simple interface to users.",
  },
];
