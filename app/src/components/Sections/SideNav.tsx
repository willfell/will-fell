import { SectionId } from '../../data/data';
import { useNavObserver } from '../../hooks/useNavObserver';
import { FC, memo, useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon, HomeIcon, AcademicCapIcon, InformationCircleIcon, EnvelopeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NavPage {
  name: string;
  href: string;
  icon: React.ElementType;
  target?: string;
  download?: boolean;
}

export const SideNav: FC = memo(() => {
    // Reordered sections: About, Experience, Portfolio (for main page)
    const sections = [
        SectionId.About,
        SectionId.Experience,
        SectionId.Portfolio,
    ];

    // Main pages for navigation
    const mainPages: NavPage[] = [
      { name: 'Home', href: '/', icon: HomeIcon },
      { name: 'Education', href: '/education', icon: AcademicCapIcon },
      { name: 'Site Info', href: '/site-info', icon: InformationCircleIcon },
      { name: 'Contact', href: '/contact', icon: EnvelopeIcon },
      { name: 'Resume', href: '/WillFellhoelterResume.pdf', icon: ArrowDownTrayIcon, target: '_blank', download: true }
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

    // Helper function to check if a page is active
    const isPageActive = (href: string): boolean => {
      if (href === '/' && currentPage === '/') {
        return true;
      }
      if (href === '/site-info' && (currentPage === '/site-info' || currentPage === '/info')) {
        return true;
      }
      return currentPage === href;
    };

    return (
        <>
            {/* Mobile toggle button - updated positioning for vertical centering */}
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-0 left-4 h-16 flex items-center justify-center z-50"
                    aria-label={isOpen ? "Close navigation" : "Open navigation"}
                >
                    <div className="bg-white/80 p-2 rounded-full shadow-md text-forest-green">
                        {isOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </div>
                </button>
            )}

            {/* Navigation - different styles for mobile vs desktop */}
            <nav
                className={`
                    ${isMobile ?
                        `fixed left-0 top-0 h-full w-64 bg-white/95 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`
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

                {/* Main Pages Navigation for Mobile - always show these links */}
                {isMobile && (
                    <div className="flex flex-col p-6 space-y-4 border-b border-gray-200">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Pages</h3>
                        {mainPages.map((page) => (
                            page.target ? (
                                <a
                                    key={page.name}
                                    href={page.href}
                                    target={page.target}
                                    download={page.download}
                                    onClick={handleNavClick}
                                    className={`flex items-center p-2 transition-colors duration-200 rounded-lg ${
                                        isPageActive(page.href) ? 'bg-forest-green/10 text-forest-green font-semibold' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <page.icon className="w-5 h-5 mr-3" />
                                    <span>{page.name}</span>
                                </a>
                            ) : (
                                <Link
                                    key={page.name}
                                    href={page.href}
                                    onClick={handleNavClick}
                                    className={`flex items-center p-2 transition-colors duration-200 rounded-lg ${
                                        isPageActive(page.href) ? 'bg-forest-green/10 text-forest-green font-semibold' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <page.icon className="w-5 h-5 mr-3" />
                                    <span>{page.name}</span>
                                </Link>
                            )
                        ))}
                    </div>
                )}

                {/* Home page sections navigation */}
                {currentPage === '/' && (
                    <div className={isMobile ? "flex flex-col p-6 space-y-6" : "flex flex-col space-y-8"}>
                        {isMobile && <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Current Page Sections</h3>}
                        {sections.map(section => (
                            <a
                                key={section}
                                href={`#${section}`}
                                onClick={handleNavClick}
                                onMouseEnter={() => handleMouseEnter(section)}
                                className={`
                                    block transition-all duration-300
                                    ${isMobile ? 'text-base p-2 flex items-center rounded-lg' : 'text-xl p-3 font-semibold'}
                                    ${currentSection === section
                                        ? isMobile 
                                            ? 'bg-forest-green/10 text-forest-green font-medium' 
                                            : 'text-black border-l-4 border-black pl-2 bg-transparent'
                                        : isMobile
                                            ? 'text-gray-600 hover:bg-gray-100'
                                            : 'text-black/70 hover:text-black hover:border-l-2 hover:border-black hover:pl-2.5 bg-transparent'
                                    }
                                `}
                            >
                                {sectionNames[section] || section}
                            </a>
                        ))}
                    </div>
                )}
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