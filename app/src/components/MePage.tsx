import { FC, memo, useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Page from "./Layout/Page";
import Footer from "./Sections/Footer";
import { SideNav } from "./Sections/SideNav";

// Import Header dynamically to ensure it works properly
const Header = dynamic(() => import("./Sections/Header"), { ssr: false });

const backgroundImage = "/images/life/hobbies/background.jpg";

interface MePageProps {
  galleryImages?: string[];
}

const MePage: FC<MePageProps> = memo(({ galleryImages = [] }) => {
  // Refs and state for animations and scrolling
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Use fallback images if none provided
  const images =
    galleryImages.length > 0
      ? galleryImages
      : Array.from(
          { length: 6 },
          (_, i) => `/images/life/gallery/${i + 1}.jpg`,
        );

  // Preload images for faster rendering
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      // Preload the first 12 images
      const preloadCount = Math.min(12, images.length);

      images.slice(0, preloadCount).forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    }
  }, [images]);

  // Handle animations on component mount
  useEffect(() => {
    // Add a style tag for animations if it doesn't exist
    if (!document.getElementById("me-page-animations")) {
      const style = document.createElement("style");
      style.id = "me-page-animations";
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

        .gallery-item {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .gallery-item:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* Explicitly set cursor to pointer for better click indication */
        .gallery-item, .gallery-item * {
          cursor: pointer;
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
          animation: masonry-fade-in 0.4s ease-out forwards; /* Faster animation */
          animation-play-state: paused;
          will-change: opacity, transform; /* Performance optimization */
        }

        .masonry-item.animate {
          animation-play-state: running;
        }
        
        /* Add this class to items that should appear immediately */
        .instant-appear {
          opacity: 1 !important;
          transform: translateY(0) !important;
          animation: none !important;
        }
        
        .lightbox-overlay {
          animation: fadeIn 0.3s ease-out;
        }
        
        .lightbox-content {
          animation: zoomIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
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

          // Handle animations on scroll with larger buffer zone for earlier animation
          const animateElements = document.querySelectorAll(
            ".animate-on-scroll:not(.animate-fadeIn)",
          );
          if (animateElements.length > 0) {
            animateElements.forEach((element) => {
              const elementTop = element.getBoundingClientRect().top;
              // Increased the visible buffer to animate elements before they're in view
              const elementVisible = window.innerHeight / 1.5; // Larger buffer

              if (elementTop < window.innerHeight + elementVisible) {
                element.classList.add("animate-fadeIn");
              }
            });
          }

          // Handle masonry gallery animations - only process non-animated items
          // Use a larger detection area to make items appear sooner while scrolling
          const masonryItems = document.querySelectorAll(
            ".masonry-item:not(.animate)",
          );
          if (masonryItems.length > 0) {
            masonryItems.forEach((item, index) => {
              const rect = item.getBoundingClientRect();
              // Check if item is within a much larger threshold of the viewport
              if (rect.top < window.innerHeight + 400) {
                // Faster animations with reduced delay
                setTimeout(
                  () => {
                    item.classList.add("animate");
                  },
                  Math.min(index, 3) * 50, // Faster animation with less delay
                );
              }
            });
          }

          ticking = false;
        });

        ticking = true;
      }
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
    window.requestAnimationFrame(() => {
      // Trigger animations once the component is mounted
      handleLoadAnimations();

      // Initial check for elements already in viewport
      handleScroll();
    });

    // Disable body scroll when lightbox is open
    if (lightboxImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  // Function to open lightbox
  const openLightbox = (imagePath: string) => {
    setLightboxImage(imagePath);
  };

  // Function to close lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Close lightbox when clicking outside of the image
  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  // Close lightbox when pressing Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxImage) {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [lightboxImage]);

  return (
    <Page
      description="Learn more about Will Fellhoelter's interests and personal life"
      title="About Me | Will Fellhoelter"
    >
      <Header />
      <SideNav />

      <div className="overflow-hidden">
        {/* Hero Section with Background Image */}
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
              alt="Background"
              className="h-full w-full object-cover"
              priority
              src={backgroundImage}
              fill
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-green/70 via-forest-green/50 to-earth-tan/40 z-0"></div>

          {/* Content container */}
          <div className="z-10 w-full max-w-screen-xl px-4 mx-auto">
            {/* Content box */}
            <div className="rounded-xl bg-forest-green/50 p-8 text-left shadow-xl backdrop-blur-sm border border-sage-green/20">
              <h1 className="animate-on-load text-4xl font-bold text-earth-tan sm:text-5xl lg:text-6xl">
                About Me
              </h1>

              <div className="animate-on-load mt-6 text-stone-100 max-w-3xl">
                <p className="mb-4">
                  I'm not going to lie I do love to work, however I do think
                  that taking some time aside to prioritize getting outdoors and
                  hanging out with family and friends is what this is all about.
                </p>
              </div>
            </div>
          </div>

          {/* Scroll down button */}
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <a
              className="animate-bounce rounded-full bg-earth-tan p-1 ring-sage-green ring-offset-2 ring-offset-forest-green/80 focus:outline-none focus:ring-2 sm:p-2 transition-all duration-300 hover:bg-sage-green shadow-lg"
              href="#gallery"
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
            {/* Photo Gallery Section */}
            <section id="gallery" className="animate-on-scroll mb-16">
              <div className="relative h-max group mb-8 text-center">
                <h2 className="text-3xl font-bold text-forest-green">
                  Photo Gallery
                </h2>
                <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-48 border-b-2 border-sage-green transition-transform duration-300 group-hover:scale-x-110" />
              </div>

              {/* Simple but effective gallery layout that won't cut off images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((imagePath, index) => {
                  // Determine if image should be featured (larger)
                  const isWide = index % 5 === 0;

                  return (
                    <div
                      key={index}
                      className={`masonry-item gallery-item rounded-xl overflow-hidden shadow-md hover:shadow-xl ${
                        isWide ? "sm:col-span-2" : ""
                      }`}
                      style={{
                        animationDelay: `${Math.min(index, 6) * 60}ms`, // Faster animations for quicker display
                        opacity: 0,
                        willChange: "opacity, transform", // Optimize for performance
                      }}
                      onClick={() => openLightbox(imagePath)}
                    >
                      {/* Fixed height container to maintain grid consistency */}
                      <div
                        className="overflow-hidden"
                        style={{ paddingBottom: "100%" }}
                      >
                        {/* Absolute positioning with proper object-fit */}
                        <div className="absolute inset-0">
                          <Image
                            src={imagePath}
                            alt={`Gallery Image ${index + 1}`}
                            fill
                            loading={index < 9 ? "eager" : "lazy"}
                            priority={index < 6}
                            className="object-cover transition-all duration-500 hover:scale-105"
                            sizes={
                              isWide
                                ? "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 66vw"
                                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            }
                          />
                          {/* Hover overlay with zoom indicator */}
                          <div className="absolute inset-0 bg-forest-green/0 hover:bg-forest-green/30 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white/80 rounded-full p-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-forest-green"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Lightbox for viewing full-size images */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 lightbox-overlay"
            onClick={handleLightboxClick}
          >
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] lightbox-content">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors duration-200"
                aria-label="Close lightbox"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <div className="w-full h-full relative flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={lightboxImage}
                    alt="Expanded view"
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Page>
  );
});

MePage.displayName = "MePage";
export default MePage;
