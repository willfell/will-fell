import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { FC, memo } from 'react';

import { contact, SectionId } from '../../../data/data';
import { ContactType, ContactValue } from '../../../data/dataDef';
import FacebookIcon from '../../Icon/FacebookIcon';
import GithubIcon from '../../Icon/GithubIcon';
import InstagramIcon from '../../Icon/InstagramIcon';
import LinkedInIcon from '../../Icon/LinkedInIcon';
import TwitterIcon from '../../Icon/TwitterIcon';
import Section from '../../Layout/Section';
import ContactForm from './ContactForm';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

const ContactValueMap: Record<ContactType, ContactValue> = {
  [ContactType.Email]: { Icon: EnvelopeIcon, srLabel: 'Email' },
  [ContactType.Location]: { Icon: MapPinIcon, srLabel: 'Location' },
  [ContactType.Github]: { Icon: GithubIcon, srLabel: 'Github' },
  [ContactType.LinkedIn]: { Icon: LinkedInIcon, srLabel: 'LinkedIn' },
  [ContactType.Facebook]: { Icon: FacebookIcon, srLabel: 'Facebook' },
  [ContactType.Twitter]: { Icon: TwitterIcon, srLabel: 'Twitter' },
  [ContactType.Instagram]: { Icon: InstagramIcon, srLabel: 'Instagram' },
};

const Contact: FC = memo(() => {
  const { headerText, description, items } = contact;
  const sectionRef = useIntersectionObserver(0.05, '-50px 0px -100px 0px');

  return (
    <Section className="bg-deep-forest" sectionId={SectionId.Contact}>
      <div ref={sectionRef} className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center animate-on-scroll opacity-0 transition-all duration-1000">
          <EnvelopeIcon className="hidden h-16 w-16 text-earth-tan md:block" />
          <h2 className="text-2xl font-bold text-earth-tan">{headerText}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="order-2 col-span-1 md:order-1 animate-on-scroll opacity-0 transition-all duration-1000 delay-200">
            <ContactForm />
          </div>
          <div className="order-1 col-span-1 flex flex-col gap-y-4 md:order-2 animate-on-scroll opacity-0 transition-all duration-1000 delay-100">
            <p className="prose leading-6 text-earth-tan/90">{description}</p>
            <dl className="flex flex-col space-y-4 text-base text-earth-tan/80 sm:space-y-2">
              {items.map(({ type, text, href }, idx) => {
                const { Icon, srLabel } = ContactValueMap[type];
                return (
                  <div
                    key={srLabel}
                    className="animate-on-scroll opacity-0 transition-all duration-700 transform hover:translate-x-1"
                    style={{ transitionDelay: `${idx * 100 + 300}ms` }}
                  >
                    <dt className="sr-only">{srLabel}</dt>
                    <dd className="flex items-center">
                      <a
                        className={classNames(
                          '-m-2 flex rounded-md p-2 text-earth-tan hover:text-sage-green focus:outline-none focus:ring-2 focus:ring-sage-green transition-all duration-300',
                          { 'hover:text-sage-green': href },
                        )}
                        href={href}
                        target="_blank">
                        <Icon aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-earth-tan sm:h-5 sm:w-5" />
                        <span className="ml-3 text-sm sm:text-base">{text}</span>
                      </a>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
});

Contact.displayName = 'Contact';
export default Contact;