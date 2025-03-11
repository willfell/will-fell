import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  MapIcon,
} from '@heroicons/react/24/outline';

import GithubIcon from '../components/Icon/GithubIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
// import heroImage from '../images/header-background.webp';
import heroImage from '../images/header-background.jpg';
import porfolioImage1 from '../images/portfolio/portfolio-1.jpg';
import porfolioImage2 from '../images/portfolio/portfolio-2.jpg';
import porfolioImage3 from '../images/portfolio/portfolio-3.jpg';
import porfolioImage4 from '../images/portfolio/portfolio-4.jpg';
import porfolioImage5 from '../images/portfolio/portfolio-5.jpg';
import porfolioImage6 from '../images/portfolio/portfolio-6.jpg';
import profilepic from '../images/aboutmepic.jpg';
// import testimonialImage from '../images/testimonial.webp';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
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
} from './dataDef';

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
  title: 'Will Fellhoelter - DevOps & Full Stack Engineer',
  description: "Portfolio website for Will Fellhoelter, a DevOps and Full Stack Engineer with over 6 years of experience",
};

/**
 * Section definition
 */
export const SectionId = {
  Hero: 'hero',
  About: 'about',
  Contact: 'contact',
  Portfolio: 'portfolio',
  Resume: 'resume',
  Skills: 'skills',
  Stats: 'stats',
  Testimonials: 'testimonials',
} as const;

export type SectionId = typeof SectionId[keyof typeof SectionId];

/**
 * Hero section
 */
export const heroData: Hero = {
  name: "Will Fellhoelter",
  description: (
    <>
      <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
        I'm a Denver-based <strong className="text-stone-100">DevOps & Full Stack Engineer</strong> with over 6 years
        of experience designing and operating developer-centric infrastructure and automation solutions.
      </p>
    </>
  ),
  actions: [
    {
      href: '/#about',
      text: 'About Me',
      primary: false,
    },
    {
      href: '/WillFellhoelterResume.pdf',
      text: 'Resume',
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
    { label: 'Location', text: 'Denver, CO', Icon: MapIcon },
    { label: 'Age', text: '28', Icon: CalendarIcon },
    { label: 'Study', text: 'Wichita State University', Icon: AcademicCapIcon },
    { label: 'Employment', text: 'Forml, Senior Full Stack Engineer', Icon: BuildingOffice2Icon },
  ],
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = [
  {
    name: 'Infrastructure & Platforms',
    skills: [
      {
        name: 'AWS',
        level: 9,
      },
      {
        name: 'Terraform',
        level: 8,
      },
      {
        name: 'Docker',
        level: 9,
      },
      {
        name: 'Kubernetes',
        level: 7,
      },
      {
        name: 'Azure',
        level: 7,
      },
      {
        name: 'GCP',
        level: 6,
      },
    ],
  },
  {
    name: 'Programming Languages',
    skills: [
      {
        name: 'Python',
        level: 9,
      },
      {
        name: 'TypeScript/JavaScript',
        level: 8,
      },
      {
        name: 'Bash',
        level: 8,
      },
      {
        name: 'Java',
        level: 6,
      },
      {
        name: 'C#/.NET',
        level: 6,
      },
    ],
  },
  {
    name: 'Observability & Reliability',
    skills: [
      {
        name: 'New Relic',
        level: 8,
      },
      {
        name: 'Prometheus',
        level: 7,
      },
      {
        name: 'Datadog',
        level: 7,
      },
      {
        name: 'AWS CloudWatch',
        level: 8,
      },
      {
        name: 'Splunk',
        level: 7,
      },
    ],
  },
  {
    name: 'CI/CD & Developer Enablement',
    skills: [
      {
        name: 'GitHub Actions',
        level: 9,
      },
      {
        name: 'GitOps',
        level: 8,
      },
      {
        name: 'ArgoCD',
        level: 7,
      },
      {
        name: 'Bitbucket Pipelines',
        level: 8,
      },
      {
        name: 'AWS CodePipeline',
        level: 7,
      },
    ],
  },
];

/**
 * Resume section -- TODO: Standardize resume contact format or offer MDX
 */
export const education: TimelineItem[] = [
  {
    date: '2014-2018',
    location: 'Wichita State University',
    title: 'Management Information Systems',
    content: <p>Earned a degree in Management Information Systems at Wichita State University.</p>,
  },
];

export const experience: TimelineItem[] = [
  {
    date: 'July 2024 - Present',
    location: 'Forml (Remote)',
    title: 'Senior Full Stack Engineer',
    content: (
      <ul className="list-disc pl-8">
        <li>Lead end-to-end development of a robust, full-stack platform leveraging Python, Angular, AWS, Redis, and PostgreSQL as the first engineering hire</li>
        <li>Create sophisticated API integrations and system architectures, enabling the platform to support twice the user base within two months</li>
        <li>Collaborate closely with founders and clients to craft quarterly roadmaps, ensuring product vision aligns seamlessly with technical execution</li>
        <li>Design and maintain secure, high-performance external APIs using AWS, Terraform, and Python</li>
        <li>Engineer streamlined, one-click deployment solutions for on-premise clients, reducing onboarding time from 3 days to just 4 hours</li>
      </ul>
    ),
  },
  {
    date: 'May 2023 - July 2024',
    location: 'Project Canary, Denver',
    title: 'DevOps Engineer',
    content: (
      <ul className="list-disc pl-8">
        <li>Orchestrated enterprise-wide observability strategy for 10+ critical services, implementing proactive monitoring that maintained 99.99% uptime</li>
        <li>Built a self-service ephemeral environment tool with a UI for branch selection, data sources, and one-click deployment</li>
        <li>Architected performance optimizations for high-throughput time-series PostgreSQL databases, improving query performance by 23%</li>
        <li>Planned and executed migration of observability infrastructure to New Relic, reducing monitoring costs by 14%</li>
        <li>Created a full-stack retrieval augmented generation application using AWS Bedrock and vector databases, increasing cross-departmental information access efficiency by 80%</li>
      </ul>
    ),
  },
  {
    date: 'August 2021 - May 2023',
    location: 'Lendflow (Remote)',
    title: 'DevSecOps Engineer',
    content: (
      <ul className="list-disc pl-8">
        <li>Built ephemeral infrastructure solutions for developers and QA, eliminating persistent environment costs by 32%</li>
        <li>Enhanced logging and observability by implementing a centralized OpenSearch solution, reducing issue identification time from ~3 hours to under 10 minutes</li>
        <li>Served as on-call engineer, ensuring 99.9999% uptime for 20K+ users by managing incident response</li>
        <li>Developed a Flask-based API integration for automated client billing, reducing manual invoicing efforts by 70%</li>
        <li>Implemented AWS WAF and CloudFront to reduce security incidents by 60% and strengthen application security posture</li>
      </ul>
    ),
  },
  {
    date: 'February 2020 - August 2021',
    location: 'MCG (Remote)',
    title: 'DevOps Engineer',
    content: (
      <ul className="list-disc pl-8">
        <li>Led migration from on-premises infrastructure to Azure Cloud for 3+ teams, achieving 99.9999% annual uptime</li>
        <li>Migrated configuration management from Chef to Ansible for 100+ Windows servers, reducing configuration errors by 82%</li>
        <li>Engineered load testing frameworks using JMeter and Azure Container Instances, validating platform reliability at scale</li>
        <li>Designed modular Terraform components to standardize cloud infrastructure, accelerating new environment setup from approximately 2 days to 1 hour</li>
      </ul>
    ),
  },
  {
    date: 'September 2018 - August 2021',
    location: 'Cerner, Kansas City',
    title: 'Systems Engineer',
    content: (
      <ul className="list-disc pl-8">
        <li>Built an AWX-powered UI for scheduling data restoration jobs and spinning up ephemeral test environments</li>
        <li>Managed patching, upgrades, and support for 600+ hosts in vSphere, ensuring system stability and security</li>
        <li>Utilized tools like Git, Chef, Ansible, Jenkins, Splunk, and AWS to drive automation and continuous delivery</li>
        <li>Created Ansible playbooks to automate server configuration and troubleshooting, saving the team 40+ hours per month</li>
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
      name: 'Achievement: Ephemeral Environment Automation',
      text: 'Built ephemeral environment tools enabling on-demand testing, streamlining workflows across development, QA, and customer success teams.',
      image: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/169.jpg',
    },
    {
      name: 'Achievement: Cross-Department Efficiency with AI',
      text: 'Increased cross-department efficiency by 80% with RAG Application leveraging AWS Bedrock and vector databases for improved knowledge sharing.',
      image: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/14.jpg',
    },
    {
      name: 'Achievement: Security Compliance & Readiness',
      text: 'Drove security initiatives essential to passing SOC 2 Type I and Type II audits through automated controls and proactive compliance measures.',
      image: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/69.jpg',
    },
  ],
};

/**
 * Contact section
 */

export const contact: ContactSection = {
  headerText: 'Get in touch.',
  description: 'Feel free to reach out if you want to collaborate, have questions about my work, or just want to connect.',
  items: [
    {
      type: ContactType.Email,
      text: 'willfellhoelter@gmail.com',
      href: 'mailto:willfellhoelter@gmail.com',
    },
    {
      type: ContactType.Location,
      text: 'Denver, CO',
      href: 'https://maps.google.com/?q=Denver,+CO',
    },
    {
      type: ContactType.LinkedIn,
      text: 'LinkedIn',
      href: 'https://linkedin.com/in/will-fellhoelter-1aa17312b',
    },
    {
      type: ContactType.Github,
      text: 'GitHub',
      href: 'https://github.com/willfell?tab=repositories',
    },
  ],
};

/**
 * Social items
 */
export const socialLinks: Social[] = [
  { label: 'Github', Icon: GithubIcon, href: 'https://github.com/willfell?tab=repositories' },
  { label: 'LinkedIn', Icon: LinkedInIcon, href: 'https://linkedin.com/in/will-fellhoelter-1aa17312b' },
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'Self-Service Ephemeral Environments',
    description: 'Created a UI tool for developers and QA to instantly create and manage their own isolated test environments with automated cleanup.',
    url: 'https://github.com/willfell?tab=repositories',
    image: porfolioImage1,
  },
  {
    title: 'Retrieval Augmented Generation App',
    description: 'Built an internal AI knowledge base using AWS Bedrock and vector databases to improve cross-departmental information sharing.',
    url: 'https://github.com/willfell?tab=repositories',
    image: porfolioImage2,
  },
  {
    title: 'Observability Stack Migration',
    description: 'Led the migration from a legacy monitoring solution to New Relic, improving reliability visibility while reducing costs by 14%.',
    url: 'https://github.com/willfell?tab=repositories',
    image: porfolioImage3,
  },
  {
    title: 'Terraform Infrastructure Modules',
    description: 'Developed reusable Terraform modules for standardized cloud infrastructure deployments across multiple environments.',
    url: 'https://github.com/willfell?tab=repositories',
    image: porfolioImage4,
  },
  {
    title: 'PostgreSQL Performance Optimization',
    description: 'Designed and implemented database optimizations for high-throughput time-series PostgreSQL databases, improving query performance by 23%.',
    url: 'https://github.com/willfell?tab=repositories',
    image: porfolioImage5,
  },
  {
    title: 'CI/CD Pipeline Automation',
    description: 'Built automated CI/CD pipelines with GitHub Actions and AWS, improving deployment success rates and reducing deployment time.',
    url: 'https://github.com/willfell?tab=repositories',
    image: porfolioImage6,
  },
];