import { FC, memo, useState } from "react";
import { portfolioItems, SectionId } from "../../data/data";
import { PortfolioItem } from "../../data/dataDef";
import Section from "../Layout/Section";
import PortfolioCard from "./PortfolioCard";
import ProjectDetailModal from "./ProjectDetailModal";

const Portfolio: FC = memo(() => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(
    null,
  );

  // Filter for passion projects
  const passionProjects = portfolioItems.filter(
    (item) => item.isPassionProject,
  );
  const regularProjects = portfolioItems.filter(
    (item) => !item.isPassionProject,
  );

  return (
    <Section
      className="bg-gradient-to-b from-white to-earth-tan/20"
      sectionId={SectionId.Portfolio}
    >
      <div className="flex flex-col gap-y-8">
        {/* Passion Projects Section with enhanced styling */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-forest-green inline-block relative after:hidden">
              Passion Projects
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-coral"></span>
            </h2>
            <p className="text-stone-700 mt-4 max-w-3xl">
              Projects I've built in my free time to solve personal needs or
              explore new technologies.
            </p>
          </div>

          <div className="bg-terracotta/5 rounded-xl p-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {passionProjects.map((item, index) => (
                <div
                  className="animate-on-scroll"
                  key={`${item.title}-${index}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <PortfolioCard
                    item={item}
                    onClick={() => setSelectedProject(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regular Projects Section with similar grid layout (3 columns) */}
        {regularProjects.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-forest-green inline-block relative after:hidden">
                Professional Work
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-slate-blue"></span>
              </h2>
              <p className="text-stone-700 mt-4 max-w-3xl">
                Notable projects I've contributed to in professional settings.
              </p>
            </div>

            <div className="bg-slate-blue/5 rounded-xl p-8 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularProjects.map((item, index) => (
                  <div
                    className="animate-on-scroll"
                    key={`regular-${item.title}-${index}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PortfolioCard
                      item={item}
                      onClick={() => setSelectedProject(item)}
                      isCompact
                      hideDescription={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </Section>
  );
});

Portfolio.displayName = "Portfolio";
export default Portfolio;
