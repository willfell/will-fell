import dynamic from 'next/dynamic';
import InfoPage from '../components/InfoPage';
import { SideNav } from '../components/Sections/SideNav';

// Import Header dynamically to ensure it works properly
const Header = dynamic(() => import('../components/Sections/Header'), { ssr: false });

export default function SiteInfo() {
  return (
    <>
      <Header />
      <SideNav />
      <InfoPage />
    </>
  );
}