import { NextPage } from "next";
import Head from "next/head";
import { memo, PropsWithChildren } from "react";

import { HomepageMeta } from "../../data/dataDef";

// One page, one URL: removed routes fall through to index.html in
// production, and they must not canonicalise to themselves.
const SITE_URL = "https://willfellhoelter.com/";

const Page: NextPage<PropsWithChildren<HomepageMeta>> = memo(
  ({ children, title, description, image }) => (
    <>
      <Head>
        <title>{title}</title>
        <meta content={description} name="description" />
        <meta content="#121513" name="theme-color" />
        <link href={SITE_URL} key="canonical" rel="canonical" />

        <link href="/favicon.ico" rel="icon" sizes="any" />
        <link href="/site.webmanifest" rel="manifest" />

        <meta content={title} property="og:title" />
        <meta content={description} property="og:description" />
        <meta content={SITE_URL} property="og:url" />
        <meta content={image} property="og:image" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />

        <meta content="summary_large_image" name="twitter:card" />
        <meta content={image} name="twitter:image" />
        <meta content={title} name="twitter:title" />
        <meta content={description} name="twitter:description" />
      </Head>
      {children}
    </>
  ),
);

Page.displayName = "Page";
export default Page;
