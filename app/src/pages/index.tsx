import { FC, memo } from "react";

import Page from "../components/Layout/Page";
import { homePageMeta } from "../data/data";

const Home: FC = memo(() => (
  <Page {...homePageMeta}>
    <main />
  </Page>
));

Home.displayName = "Home";
export default Home;
