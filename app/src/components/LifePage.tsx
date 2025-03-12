import { FC, memo, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { lifePageData } from '../data/lifeData';

// eslint-disable-next-line react-memo/require-memo
const Header = dynamic(() => import('./Sections/Header'), { ssr: false });

// Define TypeScript interfaces aligned with actual data structure
interface GalleryItem {
    id: number;
    image: string | any; // Using 'any' for now to handle StaticImageData
    caption: string;
    categories: string[];
    span?: boolean;
}

interface Category {
    id: string;
    name: string;
}

// Now update all the component code to use proper typing
const LifePage: FC = memo(() => {
    // Refs and state for animations and scrolling
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all');

    // Handle animations on component mount
    useEffect(() => {
        // Add a style tag for animations if it doesn't exist
        if (!document.getElementById('life-page-animations')) {
            const style = document.createElement('style');
            style.id = 'life-page-animations';
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

        .hobby-card {
          transition: all 0.3s ease;
        }

        .hobby-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .gallery-item {
          transition: all 0.3s ease;
        }

        .gallery-item:hover {
          transform: scale(1.02);
        }

        @keyframes masonry-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .masonry-item {
          animation: masonry-fade-in 0.5s ease forwards;
          animation-play-state: paused;
        }

        .masonry-item.animate {
          animation-play-state: running;
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `;
            document.head.appendChild(style);
        }

        // Optimized scroll handler with throttling for better performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);

                    // Handle animations on scroll - using more efficient selectors
                    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animate-fadeIn)');
                    if (animateElements.length > 0) {
                        animateElements.forEach(element => {
                            const elementTop = element.getBoundingClientRect().top;
                            const elementVisible = 150;

                            if (elementTop < window.innerHeight - elementVisible) {
                                element.classList.add('animate-fadeIn');
                            }
                        });
                    }

                    // Handle masonry gallery animations - only process non-animated items
                    const masonryItems = document.querySelectorAll('.masonry-item:not(.animate)');
                    if (masonryItems.length > 0) {
                        masonryItems.forEach((item, index) => {
                            const rect = item.getBoundingClientRect();
                            if (rect.top < window.innerHeight - 100) {
                                // Limit the number of simultaneous animations
                                setTimeout(() => {
                                    item.classList.add('animate');
                                }, Math.min(index, 5) * 80);
                            }
                        });
                    }

                    ticking = false;
                });

                ticking = true;
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Handle load animations
        const handleLoadAnimations = () => {
            const animateElements = document.querySelectorAll('.animate-on-load');
            animateElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-fadeIn');
                }, 100 * index);
            });
        };

        // Run after a slight delay to ensure DOM is fully loaded
        // Use requestAnimationFrame for smoother initial animations
        window.requestAnimationFrame(() => {
            // Trigger animations once the component is mounted
            handleLoadAnimations();

            // Initial check for elements already in viewport
            handleScroll();
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Filter gallery items by category
    const filteredGalleryItems = activeCategory === 'all'
        ? lifePageData.galleryItems
        : lifePageData.galleryItems.filter((item) => item.categories.includes(activeCategory));

    return (
        <div className="overflow-hidden">
            <Header />

            {/* Hero Section with Background Image */}
            <div ref={heroRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
                {/* Background with parallax effect */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        transform: `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.2}px)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    <Image
                        alt="Life Background"
                        className="h-full w-full object-cover"
                        priority
                        src={lifePageData.backgroundImage}
                        fill
                    />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-forest-green/70 via-forest-green/50 to-earth-tan/40 z-0"></div>

                {/* Content container */}
                <div className="z-10 w-full max-w-screen-xl px-4 mx-auto">
                    {/* Content box */}
                    <div className="rounded-xl bg-forest-green/50 p-8 text-left shadow-xl backdrop-blur-sm border border-sage-green/20">
                        <h1 className="animate-on-load text-4xl font-bold text-earth-tan sm:text-5xl lg:text-6xl">{lifePageData.title}</h1>

                        <div className="animate-on-load mt-6 text-stone-100 max-w-3xl">
                            <p className="mb-4">{lifePageData.description}</p>
                        </div>
                    </div>
                </div>

                {/* Scroll down button */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                    <a
                        className="animate-bounce rounded-full bg-earth-tan p-1 ring-sage-green ring-offset-2 ring-offset-forest-green/80 focus:outline-none focus:ring-2 sm:p-2 transition-all duration-300 hover:bg-sage-green shadow-lg"
                        href="#gallery">
                        <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6 text-forest-green" />
                    </a>
                </div>
            </div>

            {/* Main Content with Enhanced Gradient Background */}
            <div
                ref={pageRef}
                className="relative py-16 px-4 md:px-8"
                style={{
                    background: 'linear-gradient(135deg, rgba(219,187,156,0.7) 0%, rgba(125,138,105,0.6) 25%, rgba(94,103,70,0.5) 50%, rgba(125,138,105,0.6) 75%, rgba(219,187,156,0.7) 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientAnimation 15s ease infinite'
                }}
            >
                {/* Add keyframes for the background animation */}
                <style jsx>{`
                    @keyframes gradientAnimation {
                        0% { background-position: 0% 50% }
                        50% { background-position: 100% 50% }
                        100% { background-position: 0% 50% }
                    }
                `}</style>

                <div className="max-w-screen-xl mx-auto">
                    {/* Hobbies Section has been removed */}

                    {/* Photo Gallery Section */}
                    <section id="gallery" className="animate-on-scroll mb-16">
                        <div className="relative h-max group mb-8 text-center">
                            <h2 className="text-3xl font-bold text-forest-green">Photo Gallery</h2>
                            <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-48 border-b-2 border-sage-green transition-transform duration-300 group-hover:scale-x-110" />
                        </div>

                        {/* Gallery category filters */}
                        <div className="flex justify-center flex-wrap gap-2 mb-8">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-4 py-2 rounded-full transition-all duration-300 ${activeCategory === 'all'
                                    ? 'bg-forest-green text-white font-bold'
                                    : 'bg-white/50 text-forest-green hover:bg-white/80'
                                    }`}
                            >
                                All
                            </button>
                            {lifePageData.categories.map((category: Category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2 rounded-full transition-all duration-300 ${activeCategory === category.id
                                        ? 'bg-forest-green text-white font-bold'
                                        : 'bg-white/50 text-forest-green hover:bg-white/80'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Masonry gallery with enhanced animations */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                            {filteredGalleryItems.map((item: GalleryItem, index) => (
                                <div
                                    key={item.id}
                                    className={`masonry-item gallery-item rounded-lg overflow-hidden shadow-md ${item.span ? 'sm:col-span-2' : ''}`}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        transform: `translateY(${20 + (index % 3) * 10}px)`,
                                        opacity: 0
                                    }}
                                >
                                    <div className="relative group h-64">
                                        <Image
                                            src={item.image}
                                            alt={item.caption || 'Gallery Image'}
                                            fill
                                            className="object-cover transition-all duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-forest-green/0 group-hover:bg-forest-green/60 transition-all duration-300 flex items-end">
                                            <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <p className="font-medium">{item.caption}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
});

LifePage.displayName = 'LifePage';
export default LifePage;