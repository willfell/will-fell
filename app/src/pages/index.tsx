import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import Footer from "../components/Sections/Footer";
import GitHubActivity from "../components/Sections/GitHubActivity";
import Hero from "../components/Sections/Hero";
import Nav from "../components/Sections/Nav";
import Projects from "../components/Sections/Projects";
import Roles from "../components/Sections/Roles";
import SelectedWork from "../components/Sections/SelectedWork";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
      <Roles />
      <SelectedWork />
      <Projects />
      <GitHubActivity />
    </main>
    <Footer />
  </Page>
));

Home.displayName = "Home";
export default Home;
