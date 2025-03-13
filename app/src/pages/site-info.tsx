import dynamic from "next/dynamic";
import InfoPage from "../components/InfoPage";
import { SideNav } from "../components/Sections/SideNav";
import Footer from "../components/Sections/Footer";
import Page from "../components/Layout/Page";

// Import Header dynamically to ensure it works properly
const Header = dynamic(() => import("../components/Sections/Header"), {
  ssr: false,
});

export default function SiteInfo() {
  return (
    <Page
      description="Information about how this site was built"
      title="Site Info | Will Fellhoelter"
    >
      <Header />
      <SideNav />
      <InfoPage />
      <Footer />
    </Page>
  );
}
