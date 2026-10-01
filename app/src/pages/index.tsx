import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import Contact from "../components/Sections/Contact";
import Footer from "../components/Sections/Footer";
import GitHubActivity from "../components/Sections/GitHubActivity";
import Glance from "../components/Sections/Glance";
import Hero from "../components/Sections/Hero";
import HowIWork from "../components/Sections/HowIWork";
import Nav from "../components/Sections/Nav";
import Positions from "../components/Sections/Positions";
import Roles from "../components/Sections/Roles";
import SelectedWork from "../components/Sections/SelectedWork";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
      <Glance />
      <HowIWork />
      <SelectedWork />
      <Roles />
      <Positions />
      <GitHubActivity />
      <Contact />
    </main>
    <Footer />
  </Page>
));

Home.displayName = "Home";
export default Home;
