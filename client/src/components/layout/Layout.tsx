import React, { useEffect } from "react";
import Head from "next/head";

import Header from "components/header";
import Footer from "components/footer";

import stl from "./Layout.module.scss";

interface Props {
  theme: string;
  children: React.ReactNode;
  title: string;
  setTheme: (arg: any) => void;
  user: any;
}

const Layout = ({ theme, children, title, setTheme, user }: Props) => {
  const [className, setClassName] = React.useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        setClassName(stl.darkMain);
      } else {
        setClassName("");
      }
    }
  }, [theme]);

  const keywords =
    "URL Shortener, Short URL, Link Shortener, Custom Short Links, URL Redirection, Shorten URL, Free URL Shortener, Branded Short Links, Short URL Service, Link Management, Click Tracking, Analytics for Short Links, Shortened URL Generator, URL Shortening Tool, Custom URL Shortening, Link Tracking, Shortened Link Creator, URL Management, Shorten and Share Links, Link Analytics, URL Tracking, Short URL Generator, Custom Link Shortening, URL Redirect Service, Shortened URL Metrics, Track Link Clicks, Branded Shortened Links, Link Analytics Dashboard, URL Shortening API";
  const description =
    "Transform long, complex URLs into concise, branded short links with our powerful URL shortener web app. Enhance link sharing, track click analytics, and manage your links effortlessly. Get started for free today.";

  return (
    <>
      <Head>
        <title>{`${title} | Linkzar`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Rana Intizar" />
        <meta property="og:title" content="Linkzar" />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="https://i.postimg.cc/kMNxjWGV/android-chrome-512x512.png"
        />
        <meta name="twitter:title" content="Linkzar" />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content="https://i.postimg.cc/kMNxjWGV/android-chrome-512x512.png"
        />
        <meta
          name="google-site-verification"
          content="5Fs8lSYBSQvC-anQEhvg9XrB5OLrKgO2HpvI6CoByrQ"
        />
        <link
          rel="android-chrome"
          sizes="512x512"
          href="favicon/android-chrome-512x512.png"
        />
        <link
          rel="android-chrome"
          sizes="192x192"
          href="favicon/android-chrome-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon/favicon-16x16.png"
        />
      </Head>
      <main className={className}>
        <Header theme={theme} setTheme={setTheme} user={user} />
        {children}
        <Footer theme={theme} />
      </main>
    </>
  );
};

Layout.defaultProps = {
  user: null,
};

export default Layout;
