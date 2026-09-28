import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import About from "../components/Sections/About";
import Footer from "../components/Sections/Footer";
import Hero from "../components/Sections/Hero";
import Nav from "../components/Sections/Nav";
import Roles from "../components/Sections/Roles";
import SelectedWork from "../components/Sections/SelectedWork";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
      <About />
      <SelectedWork />
      <Roles />
    </main>
    <Footer />
  </Page>
));

Home.displayName = "Home";
export default Home;
