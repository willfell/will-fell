import dynamic from "next/dynamic";
import { FC, memo } from "react";
import Page from "../components/Layout/Page";
import About from "../components/Sections/About";
import Footer from "../components/Sections/Footer";
import Hero from "../components/Sections/Hero";
import Portfolio from "../components/Sections/Portfolio";
import { homePageMeta, portfolioItems } from "../data/data";
import { SideNav } from "../components/Sections/SideNav";
import Experience from "../components/Sections/Experience";

// This can stay dynamic if you are only rendering it client-side
const Header = dynamic(() => import("../components/Sections/Header"), {
  ssr: false,
});

const Home: FC = memo(() => {
  // Destructure from your data so that description and title exist
  const { description, title } = homePageMeta;

  return (
    <Page description={description} title={title}>
      <Header />
      <SideNav />
      <Hero />
      <About />
      <Experience />
      {portfolioItems.length > 0 && <Portfolio />}
      <Footer />
    </Page>
  );
});

export default Home;
