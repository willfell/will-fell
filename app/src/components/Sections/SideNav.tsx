import { SectionId } from '../../data/data';
import { useNavObserver } from '../../hooks/useNavObserver';
import { FC, memo, useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export const SideNav: FC = memo(() => {
    // Reordered sections: About, Experience, Portfolio (for main page)
    const sections = [
        SectionId.About,
        SectionId.Experience,
        SectionId.Portfolio,
    ];

    const router = useRouter();
    const [currentSection, setCurrentSection] = useState<SectionId | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState('/');

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Set current page
        setCurrentPage(router.pathname);

        // Initial check
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Clean up
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, [router.pathname]);

    useNavObserver(sections.map(section => `#${section}`).join(','), (section) => {
        if (section && currentPage === '/') {
            setCurrentSection(section as SectionId);
        }
    });

    // Force color change for visibility regardless of scroll position
    const handleMouseEnter = (section: SectionId) => {
        if (currentPage === '/') {
            setCurrentSection(section);
        }
    };

    const handleNavClick = () => {
        // Close mobile nav when clicking a link
        if (isMobile) {
            setIsOpen(false);
        }
    };

    // Map section IDs to display names
    const sectionNames = {
        [SectionId.About]: 'About',
        [SectionId.Experience]: 'Experience',
        [SectionId.Portfolio]: 'Projects',
    };

    return (
        <>
            {/* Mobile toggle button */}
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-4 left-4 z-50 bg-white/80 p-2 rounded-full shadow-md text-forest-green"
                    aria-label={isOpen ? "Close navigation" : "Open navigation"}
                >
                    {isOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            )}

            {/* Navigation - different styles for mobile vs desktop */}
            <nav
                className={`
                    ${isMobile ?
                        `fixed left-0 top-0 h-full w-64 bg-white/95 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
                        :
                        'fixed left-0 top-0 h-full hidden md:flex flex-col justify-center w-48 p-6 space-y-8 bg-transparent z-50'
                    }
                `}
            >
                {/* Mobile nav header */}
                {isMobile && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-forest-green">Navigation</h2>
                    </div>
                )}

                {/* Navigation items - adjust for mobile vs desktop */}
                <div className={isMobile ? "flex flex-col p-6 space-y-6" : "flex flex-col space-y-8"}>
                    {/* Section links - only show on home page */}
                    {currentPage === '/' && sections.map(section => (
                        <a
                            key={section}
                            href={`#${section}`}
                            onClick={handleNavClick}
                            onMouseEnter={() => handleMouseEnter(section)}
                            className={`
                                block transition-all duration-300
                                ${isMobile ? 'text-lg p-2' : 'text-xl p-3 font-semibold'}
                                ${currentSection === section
                                    ? `text-black ${isMobile ? 'border-l-4' : 'border-l-4'} border-black pl-2 bg-transparent`
                                    : `text-black/70 hover:text-black hover:${isMobile ? 'border-l-2' : 'border-l-2'} hover:border-black hover:pl-2.5 bg-transparent`
                                }
                            `}
                        >
                            {sectionNames[section] || section}
                        </a>
                    ))}
                </div>
            </nav>

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
});

SideNav.displayName = 'SideNav';
export default SideNav;