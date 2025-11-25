import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  MapIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import { getImageUrl } from "../utils/imageUrl";
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
  Skills: "skills", // Added Skills section ID
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
  imageSrc: getImageUrl("/images/hero/header-background.jpg"),
};

/**
 * About section
 */
export const aboutData: About = {
  profileImageSrc: getImageUrl("/images/about/aboutmepic.jpg"),
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
        level: 10,
        logo: getImageUrl("/images/skills/aws.svg"),
      },
      {
        name: "Terraform",
        level: 10,
        logo: getImageUrl("/images/skills/terraform.svg"),
      },
      {
        name: "Docker",
        level: 10,
        logo: getImageUrl("/images/skills/docker.svg"),
      },
      {
        name: "Kubernetes",
        level: 10,
        logo: getImageUrl("/images/skills/kubernetes.svg"),
      },
      {
        name: "Azure",
        level: 10,
        logo: getImageUrl("/images/skills/azure.svg"),
      },
      {
        name: "GCP",
        level: 10,
        logo: getImageUrl("/images/skills/gcp.svg"),
      },
      {
        name: "Pulumi",
        level: 10,
        logo: getImageUrl("/images/skills/pulumi.svg"),
      },
      {
        name: "CloudFormation",
        level: 10,
        logo: getImageUrl("/images/skills/cloudformation.svg"),
      },
      {
        name: "Linux",
        level: 10,
        logo: getImageUrl("/images/skills/linux.svg"),
      },
      {
        name: "Vagrant",
        level: 10,
        logo: getImageUrl("/images/skills/vagrant.svg"),
      },
      {
        name: "Packer",
        level: 10,
        logo: getImageUrl("/images/skills/packer.svg"),
      },
    ],
  },
  {
    name: "Programming Languages",
    skills: [
      {
        name: "Python",
        level: 10,
        logo: getImageUrl("/images/skills/python.svg"),
      },
      {
        name: "TypeScript",
        level: 10,
        logo: getImageUrl("/images/skills/typescript.svg"),
      },
      {
        name: "JavaScript",
        level: 10,
        logo: getImageUrl("/images/skills/javascript.svg"),
      },
      {
        name: "Bash",
        level: 10,
        logo: getImageUrl("/images/skills/bash.svg"),
      },
      {
        name: "Java",
        level: 10,
        logo: getImageUrl("/images/skills/java.svg"),
      },
      {
        name: "C#/.NET",
        level: 10,
        logo: getImageUrl("/images/skills/csharp.svg"),
      },
    ],
  },
  {
    name: "Web Frameworks",
    skills: [
      {
        name: "Next.js",
        level: 10,
        logo: getImageUrl("/images/skills/nextjs.svg"),
      },
      {
        name: "Angular",
        level: 10,
        logo: getImageUrl("/images/skills/angular.svg"),
      },
      {
        name: "Flask",
        level: 10,
        logo: getImageUrl("/images/skills/flask.svg"),
      },
      {
        name: "FastAPI",
        level: 10,
        logo: getImageUrl("/images/skills/fastapi.svg"),
      },
      {
        name: "Tailwind CSS",
        level: 10,
        logo: getImageUrl("/images/skills/tailwind.svg"),
      },
    ],
  },
  {
    name: "Observability & Reliability",
    skills: [
      {
        name: "New Relic",
        level: 10,
        logo: getImageUrl("/images/skills/newrelic.svg"),
      },
      {
        name: "Prometheus",
        level: 10,
        logo: getImageUrl("/images/skills/prometheus.svg"),
      },
      {
        name: "Datadog",
        level: 10,
        logo: getImageUrl("/images/skills/datadog.svg"),
      },
      {
        name: "AWS CloudWatch",
        level: 10,
        logo: getImageUrl("/images/skills/cloudwatch.svg"),
      },
      {
        name: "Splunk",
        level: 10,
        logo: getImageUrl("/images/skills/splunk.svg"),
      },
      {
        name: "Grafana",
        level: 10,
        logo: getImageUrl("/images/skills/grafana.svg"),
      },
      {
        name: "Elasticsearch",
        level: 10,
        logo: getImageUrl("/images/skills/elasticsearch.svg"),
      },
      {
        name: "OpenSearch",
        level: 10,
        logo: getImageUrl("/images/skills/opensearch.svg"),
      },
    ],
  },
  {
    name: "Configuration Management",
    skills: [
      {
        name: "Ansible",
        level: 10,
        logo: getImageUrl("/images/skills/ansible.svg"),
      },
      {
        name: "Chef",
        level: 10,
        logo: getImageUrl("/images/skills/chef.svg"),
      },
      {
        name: "Puppet",
        level: 10,
        logo: getImageUrl("/images/skills/puppet.svg"),
      },
    ],
  },
  {
    name: "CI/CD & Developer Enablement",
    skills: [
      {
        name: "GitHub Actions",
        level: 10,
        logo: getImageUrl("/images/skills/github-actions.svg"),
      },
      {
        name: "GitOps",
        level: 10,
        logo: getImageUrl("/images/skills/gitops.svg"),
      },
      {
        name: "ArgoCD",
        level: 10,
        logo: getImageUrl("/images/skills/argocd.svg"),
      },
      {
        name: "Bitbucket Pipelines",
        level: 10,
        logo: getImageUrl("/images/skills/bitbucket.svg"),
      },
      {
        name: "AWS CodePipeline",
        level: 10,
        logo: getImageUrl("/images/skills/codepipeline.svg"),
      },
      {
        name: "Jenkins",
        level: 10,
        logo: getImageUrl("/images/skills/jenkins.svg"),
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
    imageSrc: getImageUrl("/images/logos/wsu-logo.png"),
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
    imageSrc: getImageUrl("/images/logos/forml-logo.png"),
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
    imageSrc: getImageUrl("/images/logos/project-canary-logo.png"),
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
    imageSrc: getImageUrl("/images/logos/lendflow-logo.png"),
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
    imageSrc: getImageUrl("/images/logos/mcg-logo.png"),
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
    imageSrc: getImageUrl("/images/logos/cerner-logo.png"),
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
    logo: getImageUrl("/images/skills/github.svg"),
    href: "https://github.com/willfell?tab=repositories",
  },
  {
    label: "LinkedIn",
    logo: getImageUrl("/images/skills/linkedin.svg"),
    href: "https://linkedin.com/in/will-fellhoelter-1aa17312b",
  },
  {
    label: "Strava",
    logo: getImageUrl("/images/skills/strava.svg"),
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
    image: getImageUrl("/images/passion-projects/balanced-brief.png"),
    why: "I needed an automated way of sending me news I wanted, that wasn't biased",
    how: "Built a Python-based system that fetches news from various sources, processes it with OpenAI to remove bias, and delivers personalized content through email. The system runs on AWS ECS and integrates with Reddit to discover trending topics. The frontend site is still available at balancedbrief.com - but functionality on the daily jobs has been removed for now. I intend on bringing it back in the future with some major infrastructure changes, and utilizing a different email service. SES is difficult and AWS will not allow me to email to anybody who signs up.",
    techStack: [
      "Python",
      "React",
      "HTML",
      "CSS",
      "AWS ECS",
      "AWS Lambda",
      "AWS SNS",
      "AWS SES",
      "AWS RDS",
      "Postgres",
      "AWS CodePipeline",
      "OpenAI",
      "Reddit API",
    ],
    techIcons: [
      getImageUrl("/images/skills/python.svg"),
      getImageUrl("/images/skills/typescript.svg"),
      getImageUrl("/images/skills/aws.svg"),
      getImageUrl("/images/skills/docker.svg"),
      getImageUrl("/images/skills/codepipeline.svg"),
      getImageUrl("/images/skills/s3.svg"),
      getImageUrl("/images/skills/ecs.svg"),
      getImageUrl("/images/skills/reddit.svg"),
    ],
    isPassionProject: true,
  },
  {
    title: "Bezos Watch",
    description: "A one stop shop for providing security based alerts in AWS",
    url: "https://github.com/willfell/bezos-watch",
    githubUrl: "https://github.com/willfell/bezos-watch",
    image: getImageUrl("/images/passion-projects/bezos-watch.webp"),
    why: "I love AWS, but when it comes to security they do a bad job at having too many services for it, and provide little to no support when it comes to managing them. I figured having a one stop shop to get notifications via Slack on suspicious AWS API calls would help me sleep at night.",
    how: "I created a solution for by leveraging a couple of services from AWS. It utilizes Cloudtrail, AWS Event Bridge, Cloudwatch, and Lambda. When you run terraform with the stack, it will set everything up, all you have to do is supply a slack channel and slack api key and when there's an event that occurs, a metric filter on the cloudwatch log group will invoke the lambda containing the event. Lambda then goes through, filters the logs for the event, and submits that information to slack.",
    techStack: [
      "Python",
      "Terraform",
      "AWS Lambda",
      "AWS Cloudtrail",
      "AWS Cloudwatch",
      "AWS CloudFormation",
    ],
    techIcons: [
      getImageUrl("/images/skills/python.svg"),
      getImageUrl("/images/skills/terraform.svg"),
      getImageUrl("/images/skills/aws.svg"),
    ],
    isPassionProject: true,
  },
  {
    title: "This Site",
    description: "Makes me look pretty",
    url: "https://github.com/willfell/will-fell",
    githubUrl: "https://github.com/willfell/will-fell",
    image: getImageUrl("/images/passion-projects/will-and-obi.jpg"),
    why: "It's a little corny to say your passionate about your self, but I'm passionate about my work and the skills that I've learned along the journey. I am oddly passionate about good UI, and I wanted to learn nextjs, so I figured making a site about me and what I've worked on wouldn't be a bad thing to put some time into.",
    how: "I searched around for examples of portfolio websites for inspiration and found a couple that I liked. Decided to go ahead and make a fresh nextjs project. I read a little bit of documentation, but decided to have Claude teach me the majority of it, and utilize it to help me with styling. I've utilized Cloudfront as a frontend deploymeent strategy in the past, so I combined that with Terraform and Github Actions to make a pretty simple deploy process along with it.",
    techStack: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Terraform",
      "AWS S3",
      "AWS CloudFront",
      "GitHub Actions",
    ],
    techIcons: [
      getImageUrl("/images/skills/typescript.svg"),
      getImageUrl("/images/skills/nextjs.svg"),
      getImageUrl("/images/skills/tailwind.svg"),
      getImageUrl("/images/skills/github-actions.svg"),
      getImageUrl("/images/skills/terraform.svg"),
      getImageUrl("/images/skills/aws.svg"),
      getImageUrl("/images/skills/s3.svg"),
    ],
    isPassionProject: true,
  },
  {
    title: "Self-Service Ephemeral Environments",
    description:
      "Created a UI tool for developers and QA to instantly create and manage their own isolated test environments with automated cleanup.",
    url: "https://github.com/willfell?tab=repositories",
    image: getImageUrl("/images/logos/project-canary-logo.png"),
    isPassionProject: false,
    location: "Project Canary",
    date: "2023-2024",
    summary:
      "Built a comprehensive ephemeral environment solution that allowed developers to spin up isolated testing environments on-demand, complete with data seeding and backend services. This significantly improved development velocity and testing accuracy.",
    techStack: [
      "TypeScript",
      "React",
      "Python",
      "Terraform",
      "AWS",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
    ],
    techIcons: [
      getImageUrl("/images/skills/typescript.svg"),
      getImageUrl("/images/skills/python.svg"),
      getImageUrl("/images/skills/terraform.svg"),
      getImageUrl("/images/skills/aws.svg"),
      getImageUrl("/images/skills/github-actions.svg"),
      getImageUrl("/images/skills/docker.svg"),
    ],
    how: "Developed a React frontend that communicates with an AWS Lambda API, which orchestrates the creation of isolated environments using Terraform. Each environment is automatically cleaned up after a set time period to save costs.",
  },

  {
    title: "RAG-Powered Document Search",
    description:
      "AI-enhanced knowledge base using Retrieval Augmented Generation for searching across corporate documents.",
    url: "#",
    image: getImageUrl("/images/logos/project-canary-logo.png"),
    isPassionProject: false,
    location: "Project Canary",
    date: "2023-2024",
    summary:
      "Developed an internal AI tool that allowed employees to search across thousands of corporate documents, policies, and knowledge base articles using natural language. This dramatically improved information accessibility and reduced time spent looking for answers.",
    techStack: [
      "Python",
      "Flask",
      "React",
      "TypeScript",
      "AWS Bedrock",
      "AWS Lambda",
      "Vector Database",
    ],
    techIcons: [
      getImageUrl("/images/skills/python.svg"),
      getImageUrl("/images/skills/flask.svg"),
      getImageUrl("/images/skills/typescript.svg"),
      getImageUrl("/images/skills/aws.svg"),
    ],
    how: "Created a system that ingests documents from various sources, chunks and embeds them using OpenAI, stores them in a vector database, and retrieves relevant information using RAG techniques when users make queries. The interface allows for conversational interaction with company knowledge.",
  },

  {
    title: "AWS CloudWatch to NewRelic Migration",
    description:
      "Enterprise observability platform migration enhancing alerting capabilities and cross-team visibility.",
    url: "#",
    image: getImageUrl("/images/logos/project-canary-logo.png"),
    isPassionProject: false,
    location: "Project Canary",
    date: "2023",
    summary:
      "Led the migration from AWS CloudWatch to NewRelic for monitoring and alerting, implementing enhanced NRQL queries for intelligent alerts. Created customized dashboards for multiple teams that improved communication around performance bottlenecks in shared platform services.",
    techStack: [
      "NewRelic",
      "AWS CloudWatch",
      "Terraform",
      "NRQL",
      "Observability",
    ],
    techIcons: [
      getImageUrl("/images/skills/newrelic.svg"),
      getImageUrl("/images/skills/aws.svg"),
      getImageUrl("/images/skills/terraform.svg"),
      getImageUrl("/images/skills/cloudwatch.svg"),
    ],
    how: "Designed and implemented a comprehensive migration strategy from CloudWatch to NewRelic, focusing on creating advanced NRQL queries that enabled more intelligent alerting. Developed tailored dashboards in Terraform for different teams that visualized critical metrics of shared platform services for all environments, fostering better cross-team communication and quicker resolution of performance bottlenecks.",
  },

  {
    title: "Automated Client Billing",
    description:
      "Python based integration that streamlined the client invoicing process.",
    url: "#",
    image: getImageUrl("/images/logos/lendflow-logo.png"),
    isPassionProject: false,
    location: "Lendflow",
    date: "2022",
    summary:
      "Developed scheduled solution that automated the client billing process, eliminating manual invoicing steps and ensuring accurate, timely billing for all clients. This reduced accounting workload while improving accuracy.",
    techStack: ["Python", "Flask", "AWS Lambda", "MySQL"],
    techIcons: [
      getImageUrl("/images/skills/python.svg"),
      getImageUrl("/images/skills/flask.svg"),
      getImageUrl("/images/skills/aws.svg"),
    ],
    how: "Created a python application that integrated with internal usage tracking systems (MySQL) and external payment processors. The system automatically calculated usage-based billing, generated invoices, and processed payments according to client contract terms.",
  },
  {
    title: "Chef to Ansible Migration",
    description:
      "Enterprise-wide migration of 100+ production servers from Chef to Ansible for improved configuration management.",
    url: "#",
    image: getImageUrl("/images/logos/mcg-logo.png"),
    isPassionProject: false,
    location: "MCG",
    date: "2021",
    summary:
      "Led the migration of over 100 production servers from Chef to Ansible, enabling easier team collaboration through playbooks. This transition facilitated the implementation of Datadog for alerts and critical metrics based on organizational priorities, along with configuring log pipelining to Datadog.",
    techStack: [
      "Ansible",
      "Chef",
      "Datadog",
      "Linux",
      "Windows",
      "Python",
      "Bash",
    ],
    techIcons: [
      getImageUrl("/images/skills/ansible.svg"),
      getImageUrl("/images/skills/chef.svg"),
      getImageUrl("/images/skills/datadog.svg"),
      getImageUrl("/images/skills/linux.svg"),
      getImageUrl("/images/skills/python.svg"),
      getImageUrl("/images/skills/bash.svg"),
    ],
    how: "Architected and executed a phased migration strategy that maintained production stability while transitioning servers from Chef to Ansible. Developed reusable playbooks that simplified configuration management and enabled wider team participation. Integrated Datadog monitoring with custom alert thresholds and implemented log pipelining for enhanced observability.",
  },

  {
    title: "Data Restoration UI Portal",
    description:
      "AWX-powered UI for scheduling data restoration jobs and managing ephemeral environments.",
    url: "#",
    image: getImageUrl("/images/logos/cerner-logo.png"),
    isPassionProject: false,
    location: "Cerner",
    date: "2018-2020",
    summary:
      "Created a self-service portal that enabled teams to manage their own data restoration needs without requiring DevOps intervention. This improved team autonomy while reducing operational overhead.",
    techStack: ["Python", "JavaScript", "AWX", "Ansible", "Jenkins", "vSphere"],
    techIcons: [
      getImageUrl("/images/skills/python.svg"),
      getImageUrl("/images/skills/typescript.svg"),
      getImageUrl("/images/skills/ansible.svg"),
      getImageUrl("/images/skills/jenkins.svg"),
      getImageUrl("/images/skills/bash.svg"),
    ],
    how: "Built a web interface that integrated with AWX to provide a user-friendly way to schedule and manage data restoration jobs. The system automated the complex backend processes while presenting a simple interface to users.",
  },
];
