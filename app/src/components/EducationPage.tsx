import { FC, memo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Page from './Layout/Page';
import Footer from './Sections/Footer';
import { SideNav } from './Sections/SideNav';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Header = dynamic(() => import('./Sections/Header'), { ssr: false });

const campusImage = '/images/education/header-background.png';

const EducationPage: FC = memo(() => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set the page as loaded after mount to ensure content renders
    setIsLoaded(true);

    // Force animations to run
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll, .animate-on-load');
      elements.forEach(el => {
        el.classList.add('animate-fadeIn');
      });
    }, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Page
      description="My educational background and qualifications"
      title="Education | Will Fellhoelter"
    >
      <Header />
      <SideNav />

      {/* Hero Section with Background Image */}
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.2}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <Image
            alt="Wichita State University Campus"
            className="h-full w-full object-cover"
            priority
            src={campusImage}
            fill
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-green/70 via-forest-green/50 to-earth-tan/40 z-0"></div>

        {/* Content container */}
        <div className="z-10 w-full max-w-screen-xl px-4 mx-auto">
          <div className="rounded-xl bg-forest-green/50 p-8 text-left shadow-xl backdrop-blur-sm border border-sage-green/20 max-w-3xl">
            <h1 className="animate-fadeIn text-4xl font-bold text-earth-tan sm:text-5xl lg:text-6xl">Education</h1>
            <div className="animate-fadeIn mt-6 text-stone-100">
              <p className="mb-4">
                I spent four years at Wichita State University where I discovered my passion for web development.
              </p>
              <p>
                My team and I won the Koch Innovation Challenge by creating the most intuitive website, which sparked my
                journey into full-stack development and DevOps.
              </p>
              <div className="mt-6">
                <a
                  href="https://www.wichita.edu/academics/engineering/events/koch-innovation-challenge/index.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border-2 border-earth-tan text-earth-tan hover:bg-earth-tan hover:text-forest-green rounded-full transition-all duration-300"
                >
                  Learn more about the challenge
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down button */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            className="animate-bounce rounded-full bg-earth-tan p-1 ring-sage-green ring-offset-2 ring-offset-forest-green/80 focus:outline-none focus:ring-2 sm:p-2 transition-all duration-300 hover:bg-sage-green shadow-lg"
            href="#education-details">
            <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6 text-forest-green" />
          </a>
        </div>
      </div>

      <main className={`animate-fadeIn ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="min-h-screen bg-white pb-20">
          <div id="education-details" className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="max-w-4xl mx-auto">
              {/* Education Summary */}
              <div className="bg-white shadow-lg rounded-xl p-8 border border-sage-green/20 animate-fadeIn">
                <h2 className="text-3xl font-bold text-forest-green mb-8">Education</h2>

                <div className="bg-white rounded-lg p-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                    <div className="relative w-32 h-32">
                      <Image
                        src={campusImage}
                        alt="Wichita State University"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-forest-green">Management Information Systems</h3>
                      <p className="text-xl text-stone-700">Wichita State University</p>
                      <p className="text-stone-600">2014 - 2018</p>
                      <p className="mt-4 text-stone-700">
                        Earned a degree in Management Information Systems at Wichita State University.
                        During my time at Wichita State, I worked with 3 other teammates to develop an innovative web application
                        that earned us the top spot in the Koch Innovation Challenge.
                      </p>
                    </div>
                  </div>

                  {/* Koch Innovation Challenge */}
                  <div className="mt-8 pt-8 border-t border-sage-green/20">
                    <h3 className="text-xl font-bold text-forest-green mb-4">Koch Innovation Challenge Winner</h3>
                    <p className="text-stone-700 mb-4">
                      Our project focused on creating an intuitive user experience while solving a real-world problem.
                      This experience was pivotal in shaping my approach to development, emphasizing the importance of
                      both technical excellence and user-centered design.
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-forest-green/5 p-4 rounded border border-forest-green/10">
                        <h3 className="font-semibold text-forest-green">Skills Developed</h3>
                        <ul className="mt-2 space-y-1 text-stone-700">
                          <li>• Full-stack web development</li>
                          <li>• Collaborative coding</li>
                          <li>• User experience design</li>
                          <li>• Project management</li>
                        </ul>
                      </div>
                      <div className="bg-forest-green/5 p-4 rounded border border-forest-green/10">
                        <h3 className="font-semibold text-forest-green">Technologies Used</h3>
                        <ul className="mt-2 space-y-1 text-stone-700">
                          <li>• Frontend: HTML, CSS, JavaScript</li>
                          <li>• Backend: C#</li>
                          <li>• Database: Microsoft SQL Server</li>
                          <li>• Deployment: FTP Server</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Page>
  );
});

EducationPage.displayName = 'EducationPage';
export default EducationPage;