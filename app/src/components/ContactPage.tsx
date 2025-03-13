import { FC, memo, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Page from './Layout/Page';
import Footer from './Sections/Footer';
import { SideNav } from './Sections/SideNav';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Socials from './Socials';

// Use dynamic import with SSR set to true to ensure it's pre-rendered
const Header = dynamic(() => import('./Sections/Header'), { ssr: true });

// Background image and profile pic
const backgroundImage = '/images/contact/header-background.jpg';
const profilePic = '/images/contact/profilepic.jpg';

const ContactPage: FC = memo(() => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track scroll for parallax effects and ensure page is loaded
  useEffect(() => {
    // Mark the page as loaded
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Force animations to run
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll, .animate-on-load');
      elements.forEach(el => {
        el.classList.add('animate-fadeIn');
      });
    }, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formState);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  }, [formState]);

  const inputClasses = "px-4 py-3 border border-sage-green/30 focus:border-forest-green focus:ring-1 focus:ring-forest-green rounded-md bg-white/70 text-stone-800 w-full";

  // Add a loading state to ensure content appears
  if (!isLoaded) {
    return (
      <Page
        description="Get in touch with me for job opportunities, collaborations or any questions."
        title="Contact | Will Fellhoelter"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green mb-4"></div>
            <p className="text-forest-green">Loading...</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      description="Get in touch with me for job opportunities, collaborations or any questions."
      title="Contact | Will Fellhoelter"
    >
      <Header />
      <SideNav />

      {/* Hero Section with Background Image - Similar to other pages */}
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
            alt="Contact Background"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - profile image */}
            <div className="hidden md:block">
              <div className="relative mx-auto h-80 w-80 overflow-hidden rounded-full border-4 border-earth-tan shadow-xl">
                <Image
                  alt="Will Fellhoelter"
                  src={profilePic}
                  fill
                  className="object-cover animate-fadeIn"
                />
              </div>
            </div>

            {/* Right side - introduction */}
            <div className="rounded-xl bg-forest-green/50 p-8 text-left shadow-xl backdrop-blur-sm border border-sage-green/20">
              <h1 className="animate-fadeIn text-4xl font-bold text-earth-tan sm:text-5xl lg:text-6xl">Let's Connect</h1>
              <div className="animate-fadeIn mt-6 text-stone-100">
                <p className="mb-4">
                  Whether you're interested in working together, have a question about my projects,
                  or just want to say hello—I'd love to hear from you.
                </p>
              </div>

              {/* Social links */}
              <div className="animate-fadeIn mt-6 flex space-x-4">
                <h3 className="text-earth-tan font-medium mr-2">Connect on:</h3>
                <Socials />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down button */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            className="animate-bounce rounded-full bg-earth-tan p-1 ring-sage-green ring-offset-2 ring-offset-forest-green/80 focus:outline-none focus:ring-2 sm:p-2 transition-all duration-300 hover:bg-sage-green shadow-lg"
            href="#contact-form">
            <svg className="h-5 w-5 bg-transparent sm:h-6 sm:w-6 text-forest-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      <main className="animate-fadeIn" id="contact-form">
        <div className="min-h-screen bg-white pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-forest-green mb-8 animate-fadeIn">Get in Touch</h2>
              <p className="text-xl text-stone-700 mb-12 max-w-3xl animate-fadeIn">
                I'm always interested in new opportunities, collaborations, and conversations.
              </p>

              {/* Contact Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Form Section */}
                <div className="animate-fadeIn">
                  <div className="bg-white shadow-lg rounded-xl p-8 border border-sage-green/20">
                    <h2 className="text-2xl font-bold text-forest-green mb-6">Send Me a Message</h2>

                    {submitSuccess ? (
                      <div className="bg-sage-green/20 text-forest-green p-4 rounded-md mb-4">
                        Thank you for your message! I'll get back to you soon.
                      </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className={inputClasses}
                          placeholder="How can I help you?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-forest-green hover:bg-deep-forest text-white font-medium rounded-md shadow-sm transition-colors duration-300 flex justify-center items-center"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="animate-fadeIn">
                  <div className="bg-forest-green text-white shadow-lg rounded-xl p-8 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                    <div className="space-y-6 flex-grow">
                      <div className="flex items-start">
                        <EnvelopeIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Email</p>
                          <a href="mailto:willfellhoelter@gmail.com" className="text-earth-tan hover:text-white transition-colors">
                            willfellhoelter@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPinIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p>Denver, Colorado</p>
                          <p className="text-sm text-earth-tan mt-1">Available for remote work & relocation</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <PhoneIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Preferred Contact</p>
                          <p>Email or LinkedIn message</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/20">
                      <p className="font-medium mb-4">Connect with me</p>
                      <div className="flex space-x-4">
                        <Socials />
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

export default ContactPage;