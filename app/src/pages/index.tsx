import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import Hero from "../components/Sections/Hero";
import Nav from "../components/Sections/Nav";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <Nav />
    <main>
      <Hero />
    </main>
  </Page>
));

Home.displayName = "Home";
export default Home;
