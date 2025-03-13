import { FC, memo, useEffect, useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const headerID = 'headerNav';

interface NavItem {
  name: string;
  href: string;
  target?: string;
}

const Header: FC = memo(() => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    // Watch for section changes using IntersectionObserver
    const observeSections = () => {
      // Only observe sections on the main page
      if (currentPath !== '/') return;

      const sections = document.querySelectorAll('section[id]');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { threshold: 0.3 });

      sections.forEach((section) => {
        observer.observe(section);
      });

      return () => {
        sections.forEach((section) => {
          observer.unobserve(section);
        });
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const cleanup = observeSections();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (cleanup) cleanup();
    };
  }, [currentPath]);

  // Generate navigation links based on current page
  const getNavItems = (): NavItem[] => {
    // Base items that appear on all pages - "Life" page removed
    const navItems: NavItem[] = [
      { name: 'Home', href: '/' },
      // "Life" page removed from here
      { name: 'Education', href: '/education' },
      { name: 'Site Info', href: '/site-info' },
      { name: 'Contact', href: '/contact' },
    ];

    // Add resume link to all pages
    const resumeLink: NavItem = { name: 'Resume', href: '/WillFellhoelterResume.pdf', target: '_blank' };
    navItems.push(resumeLink);

    return navItems;
  };

  const navItems = getNavItems();

  // Helper function to check if a nav item should be highlighted
  const isNavItemActive = (itemHref: string): boolean => {
    // Handle home page
    if (itemHref === '/' && currentPath === '/') {
      return true;
    }
    
    // Handle section anchors on home page
    if (currentPath === '/' && activeSection && `#${activeSection}` === itemHref) {
      return true;
    }
    
    // Special case for site-info page (handles both paths)
    if (itemHref === '/site-info' && (currentPath === '/site-info' || currentPath === '/info')) {
      return true;
    }
    
    // Normal page matching
    return currentPath === itemHref;
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-forest-green shadow-lg' : 'bg-transparent'
      }`}
      id={headerID}
    >
      <div className="container flex justify-between items-center h-16 px-4 mx-auto">
        {/* Logo/Name - Hidden on mobile, visible on desktop */}
        <Link href="/" className={`
          text-2xl font-bold hover:text-sage-green transition-colors 
          ${scrolled ? 'text-white' : 'text-black'}
          hidden md:block`}> {/* Hidden on mobile */}
          Will Fellhoelter
        </Link>
        
        {/* Empty div for spacing on mobile */}
        <div className="md:hidden flex-1"></div>

        {/* Navigation Links - properly centered and aligned */}
        <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
          {navItems.map((item) => (
            item.target ? (
              <a
                key={item.name}
                href={item.href}
                target={item.target}
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-2 font-medium transition-colors ${
                  scrolled ? 'text-white hover:text-earth-tan' : 'text-forest-green hover:text-sage-green'
                }`}
              >
                {item.name}
                <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
              </a>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 font-medium transition-colors ${
                  isNavItemActive(item.href)
                    ? scrolled
                      ? 'text-earth-tan border-b-2 border-earth-tan'
                      : 'text-forest-green border-b-2 border-forest-green'
                    : scrolled
                      ? 'text-white hover:text-earth-tan'
                      : 'text-stone-700 hover:text-forest-green'
                }`}
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;