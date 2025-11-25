import { FC, memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  SiReact,
  SiNextdotjs,
  SiGithubactions,
  SiAmazon,
  SiTerraform,
} from "react-icons/si";
import {
  CodeBracketIcon,
  ServerIcon,
  CloudIcon,
  CogIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "../utils/imageUrl";

const backgroundPic = getImageUrl("/images/info/background.jpg");
const personalPicTwo = getImageUrl("/images/info/personal-2.jpg");

const InfoPage: FC = memo(() => {
  // Add CSS for animations directly in the component
  useEffect(() => {
    // Add a style tag for animations if it doesn't exist
    if (!document.getElementById("meta-page-animations")) {
      const style = document.createElement("style");
      style.id = "meta-page-animations";
      style.innerHTML = `
        .animate-on-load, .animate-on-scroll {
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-fadeIn {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Handle scroll for parallax and animations
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Handle animations on scroll
      const animateElements = document.querySelectorAll(".animate-on-scroll");
      animateElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("animate-fadeIn");
        }
      });
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle load animations
    const handleLoadAnimations = () => {
      const animateElements = document.querySelectorAll(".animate-on-load");
      animateElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("animate-fadeIn");
        }, 100 * index);
      });
    };

    // Run after a slight delay to ensure DOM is fully loaded
    setTimeout(() => {
      // Trigger animations once the component is mounted
      handleLoadAnimations();

      // Initial check for elements already in viewport
      handleScroll();
    }, 10);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Redesigned Hero Section with Background Image and Integrated Tech Stack */}
      <div
        ref={heroRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `scale(${1 + scrollY * 0.0005}) translateY(${
              scrollY * 0.2
            }px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Image
            alt="Project Background"
            className="h-full w-full object-cover"
            priority
            src={backgroundPic}
            fill
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-green/70 via-forest-green/50 to-earth-tan/40 z-0"></div>

        {/* Content container */}
        <div className="z-10 w-full max-w-screen-xl px-4 mx-auto">
          {/* Full-width content box */}
          <div className="rounded-xl bg-forest-green/50 p-8 text-left shadow-xl backdrop-blur-sm border border-sage-green/20">
            <h1 className="animate-on-load text-4xl font-bold text-earth-tan sm:text-5xl lg:text-6xl">
              About This Project
            </h1>

            <div className="animate-on-load mt-6 text-stone-100 max-w-3xl">
              <p className="mb-4">
                I built this website for fun as a way to learn Next.js! It gave
                me a chance to experiment with modern web technologies while
                creating a simple portfolio to showcase some of my work and
                background.
              </p>
              <p>
                The project turned out to be a great playground for trying out
                different React patterns and styling approaches. I had a blast
                putting it together!
              </p>
            </div>

            {/* Compact Tech Stack */}
            <div className="animate-on-load mt-8">
              <h3 className="text-xl font-semibold text-earth-tan mb-4">
                Built With
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-sage-green/30 transition-all duration-300 hover:bg-white/20">
                  <SiReact className="text-blue-500 mr-2" />
                  <span className="text-stone-100 text-sm">React</span>
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-sage-green/30 transition-all duration-300 hover:bg-white/20">
                  <SiNextdotjs className="text-stone-100 mr-2" />
                  <span className="text-stone-100 text-sm">Next.js</span>
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-sage-green/30 transition-all duration-300 hover:bg-white/20">
                  <SiGithubactions className="text-purple-400 mr-2" />
                  <span className="text-stone-100 text-sm">GitHub Actions</span>
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-sage-green/30 transition-all duration-300 hover:bg-white/20">
                  <SiAmazon className="text-orange-400 mr-2" />
                  <span className="text-stone-100 text-sm">AWS</span>
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-sage-green/30 transition-all duration-300 hover:bg-white/20">
                  <SiTerraform className="text-purple-300 mr-2" />
                  <span className="text-stone-100 text-sm">Terraform</span>
                </div>
              </div>
            </div>

            <div className="animate-on-load mt-8">
              <a
                href="https://github.com/willfell/will-fell"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-full border-2 border-earth-tan bg-none text-stone-100 hover:bg-sage-green/40 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.891 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.481C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  ></path>
                </svg>
                View GitHub Repository
              </a>
            </div>
          </div>
        </div>

        {/* Scroll down button */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            className="animate-bounce rounded-full bg-earth-tan p-1 ring-sage-green ring-offset-2 ring-offset-forest-green/80 focus:outline-none focus:ring-2 sm:p-2 transition-all duration-300 hover:bg-sage-green shadow-lg"
            href="#project-overview"
          >
            <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6 text-forest-green" />
          </a>
        </div>
      </div>

      {/* Main Content with Enhanced Gradient Background */}
      <div
        ref={pageRef}
        className="relative py-16 px-4 md:px-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(219,187,156,0.7) 0%, rgba(125,138,105,0.6) 25%, rgba(94,103,70,0.5) 50%, rgba(125,138,105,0.6) 75%, rgba(219,187,156,0.7) 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 15s ease infinite",
        }}
      >
        {/* Add keyframes for the background animation */}
        <style jsx>{`
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>

        <div className="max-w-screen-xl mx-auto">
          {/* Project Overview Section with Image */}
          <section
            id="project-overview"
            className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div
              className="animate-on-scroll flex items-center"
              style={{ transitionDelay: "0ms" }}
            >
              <div
                className="relative rounded-xl overflow-hidden shadow-xl h-80 w-full group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                style={{
                  transform: `translateY(${scrollY * 0.03}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <Image
                  src={personalPicTwo}
                  alt="Will Fellhoelter"
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                  style={{
                    transform: `scale(${1 + scrollY * 0.0003})`,
                    transition: "transform 0.1s ease-out",
                  }}
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-green/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div
              className="animate-on-scroll flex flex-col justify-center"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative h-max group mb-4">
                <h2 className="text-2xl font-bold text-forest-green">
                  Personal Portfolio Website
                </h2>
                <span className="absolute inset-x-0 -bottom-1 border-b-2 border-sage-green transform origin-left transition-transform duration-300 group-hover:scale-x-110" />
              </div>
              <p className="text-stone-black mb-4">
                This website serves as my digital portfolio and a fun project to
                learn Next.js. I wanted a place to showcase some of my work and
                learn something at the same time.
              </p>
              <p className="text-stone-black mb-6">
                I also haven't deployed to AWS Cloudfront in some time so that
                was nice. If there any issues with the site please do let me
                know, or make an issue on the repo linked below
              </p>

              {/* GitHub Repository Button - Replacing the deployment status widget */}
              <a
                href="https://github.com/willfell/will-fell"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-forest-green text-white rounded-lg shadow-md transition-all duration-300 hover:bg-deep-forest hover:shadow-lg transform hover:-translate-y-1 group"
              >
                <svg
                  className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.891 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.481C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  ></path>
                </svg>
                <span className="font-medium">View GitHub Repository</span>
                <span className="ml-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  →
                </span>
              </a>
            </div>
          </section>

          {/* Enhanced Behind the Scenes Section with Icons and Better Visual Appeal */}
          <section
            className="animate-on-scroll"
            style={{ transitionDelay: "0ms" }}
          >
            <div className="relative h-max group mb-8">
              <h2 className="text-2xl font-bold text-forest-green text-center">
                Behind the Scenes
              </h2>
              <span className="absolute inset-x-0 -bottom-1 border-b-2 border-sage-green transform origin-center transition-transform duration-300 group-hover:scale-x-110" />
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-sage-green/30 shadow-lg">
              <h3 className="text-xl font-semibold text-forest-green mb-6 flex items-center">
                <CogIcon className="h-6 w-6 mr-2 text-forest-green" />
                Development & Deployment Workflow
              </h3>

              {/* Workflow steps with enhanced design */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-forest-green via-sage-green to-earth-tan rounded-full hidden md:block"></div>

                <div className="space-y-8 relative">
                  {/* Step 1 */}
                  <div
                    className="animate-on-scroll flex flex-col md:flex-row gap-4 relative"
                    style={{ transitionDelay: "100ms" }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-forest-green flex items-center justify-center shadow-lg z-10">
                      <CodeBracketIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-0 md:ml-6 bg-forest-green/10 rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-forest-green/20 flex-1">
                      <h4 className="font-semibold text-forest-green mb-2">
                        Development
                      </h4>
                      <p className="text-sm text-stone-black">
                        Code changes are made locally using React and Next.js,
                        then pushed to GitHub for review and collaboration. The
                        modular component structure allows for rapid iteration
                        and experimentation.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className="animate-on-scroll flex flex-col md:flex-row gap-4 relative"
                    style={{ transitionDelay: "200ms" }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage-green flex items-center justify-center shadow-lg z-10">
                      <ArrowPathIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-0 md:ml-6 bg-forest-green/10 rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-forest-green/20 flex-1">
                      <h4 className="font-semibold text-forest-green mb-2">
                        Continuous Integration
                      </h4>
                      <p className="text-sm text-stone-black">
                        GitHub Actions automatically builds, tests, and packages
                        the application. Pull requests trigger preview
                        deployments so changes can be verified before merging to
                        the main branch.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className="animate-on-scroll flex flex-col md:flex-row gap-4 relative"
                    style={{ transitionDelay: "300ms" }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-earth-tan flex items-center justify-center shadow-lg z-10">
                      <CloudIcon className="h-6 w-6 text-forest-green" />
                    </div>
                    <div className="ml-0 md:ml-6 bg-forest-green/10 rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-forest-green/20 flex-1">
                      <h4 className="font-semibold text-forest-green mb-2">
                        Infrastructure as Code
                      </h4>
                      <p className="text-sm text-stone-black">
                        All AWS infrastructure is defined and managed using
                        Terraform, making it reproducible and maintainable. This
                        includes S3 buckets, CloudFront distribution, IAM
                        policies, and route configurations.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div
                    className="animate-on-scroll flex flex-col md:flex-row gap-4 relative"
                    style={{ transitionDelay: "400ms" }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-blue flex items-center justify-center shadow-lg z-10">
                      <ServerIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-0 md:ml-6 bg-forest-green/10 rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-forest-green/20 flex-1">
                      <h4 className="font-semibold text-forest-green mb-2">
                        Deployment & Monitoring
                      </h4>
                      <p className="text-sm text-stone-black">
                        Upon successful testing, the site is deployed to AWS S3
                        and distributed via CloudFront CDN. Monitoring is in
                        place to track performance metrics and automatically
                        detect any issues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final notes with decorative element */}
              <div
                className="animate-on-scroll mt-10 p-6 border-l-4 border-earth-tan bg-earth-tan/10 rounded-r-lg relative"
                style={{ transitionDelay: "500ms" }}
              >
                {/* Decorative quote mark */}
                <div className="absolute -top-4 -left-4 text-6xl text-earth-tan opacity-20">
                  "
                </div>

                <p className="text-stone-black relative">
                  Learning Next.js by building this portfolio has been an
                  exciting journey. I've enjoyed experimenting with React
                  components, styling approaches, and exploring the capabilities
                  of this framework.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});

InfoPage.displayName = "InfoPage";
export default InfoPage;
