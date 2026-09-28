import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import About from "../components/Sections/About";
import Hero from "../components/Sections/Hero";
import Nav from "../components/Sections/Nav";
import SelectedWork from "../components/Sections/SelectedWork";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
      <About />
      <SelectedWork />
    </main>
  </Page>
));

Home.displayName = "Home";
export default Home;
