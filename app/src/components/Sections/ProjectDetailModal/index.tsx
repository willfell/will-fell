import { FC, memo, useRef, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import classNames from "classnames";
import { PortfolioItem } from "../../../data/dataDef";
import useDetectOutsideClick from "../../../hooks/useDetectOutsideClick";

interface ProjectDetailModalProps {
  project: PortfolioItem;
  onClose: () => void;
}

const ProjectDetailModal: FC<ProjectDetailModalProps> = memo(
  ({ project, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useDetectOutsideClick(modalRef, onClose);

    const {
      title,
      description,
      image,
      why,
      how,
      techStack,
      techIcons,
      githubUrl,
      isPassionProject,
      location, // For workplace info
      summary, // Added for additional info
      date, // Added for date info
    } = project;

    // GitHub project data
    const [githubData, setGithubData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Animation states
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      // Trigger animation after component mounts
      setTimeout(() => setIsVisible(true), 50);

      // Prevent body scrolling
      document.body.style.overflow = "hidden";

      // Force all content to be visible immediately
      const modalContent =
        modalRef.current?.querySelectorAll(".animate-on-scroll");
      modalContent?.forEach((el) => {
        el.classList.add("animate-fadeIn");
      });

      // Fetch GitHub data if URL is available
      if (githubUrl) {
        fetchGithubData();
      }

      return () => {
        document.body.style.overflow = "auto";
      };
    }, [githubUrl]);

    const fetchGithubData = async () => {
      if (!githubUrl) return;

      setIsLoading(true);
      try {
        // Extract repo details from GitHub URL
        const urlParts = githubUrl.split("/");
        const repoName = urlParts[urlParts.length - 1];
        const userName = urlParts[urlParts.length - 2];

        // Only fetch data if we have both username and repo
        if (userName && repoName) {
          const response = await fetch(
            `https://api.github.com/repos/${userName}/${repoName}`,
          );
          if (response.ok) {
            const data = await response.json();
            setGithubData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div
          className={classNames(
            "relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transition-all duration-300 overflow-hidden",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          )}
          ref={modalRef}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-forest-green hover:bg-white transition-colors duration-200"
            onClick={handleClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Modal Content Container with Scrolling */}
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Header with image - restructured for better image display */}
            <div className="bg-forest-green/90 p-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-6">
                  {description}
                </p>

                {/* Workplace and date info for "Other Work" items */}
                {!isPassionProject && location && (
                  <div className="flex gap-2 items-center mb-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                      {location}
                    </span>
                    {date && (
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                        {date}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Project Image in its own section with proper sizing */}
            <div className="bg-slate-100 p-6">
              <div className="max-w-6xl mx-auto">
                <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
              {/* Left column: Why or Summary */}
              <div className="md:col-span-1 space-y-6 animate-fadeIn">
                {why ? (
                  <div className="bg-sage-green/10 p-5 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-forest-green mb-3">
                      Why I Built This
                    </h3>
                    <p className="text-stone-700">{why}</p>
                  </div>
                ) : summary ? (
                  <div className="bg-sage-green/10 p-5 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-forest-green mb-3">
                      Summary
                    </h3>
                    <p className="text-stone-700">{summary}</p>
                  </div>
                ) : null}

                {/* GitHub stats if available */}
                {githubUrl && (
                  <div className="bg-sage-green/10 p-5 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-forest-green mb-3">
                      GitHub
                    </h3>

                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest-green"></div>
                      </div>
                    ) : githubData ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-700">Stars</span>
                          <span className="font-semibold">
                            {githubData.stargazers_count}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-700">Watchers</span>
                          <span className="font-semibold">
                            {githubData.watchers_count}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-700">Forks</span>
                          <span className="font-semibold">
                            {githubData.forks_count}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-700">Last Updated</span>
                          <span className="font-semibold">
                            {new Date(
                              githubData.updated_at,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="pt-2">
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full px-4 py-2 bg-forest-green text-white rounded-md hover:bg-deep-forest transition-colors duration-200"
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            View on GitHub
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-forest-green text-white rounded-md hover:bg-deep-forest transition-colors duration-200"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          View on GitHub
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Middle column: How */}
              <div className="md:col-span-1 animate-fadeIn">
                {how && (
                  <div className="bg-sage-green/10 p-5 rounded-lg h-full shadow-sm">
                    <h3 className="text-xl font-semibold text-forest-green mb-3">
                      How It Works
                    </h3>
                    <p className="text-stone-700">{how}</p>
                  </div>
                )}
              </div>

              {/* Right column: Tech stack */}
              <div className="md:col-span-1 animate-fadeIn">
                {techStack && techStack.length > 0 && (
                  <div className="bg-sage-green/10 p-5 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-forest-green mb-3">
                      Tech Stack
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {techStack.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-sage-green/20 text-forest-green rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Tech Icons */}
                    {techIcons && techIcons.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {techIcons.map((icon: string, index: number) => (
                          <img
                            key={index}
                            src={icon}
                            alt="Technology icon"
                            className="h-8 w-8 object-contain opacity-80 hover:opacity-100 transition-opacity"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProjectDetailModal.displayName = "ProjectDetailModal";
export default ProjectDetailModal;
