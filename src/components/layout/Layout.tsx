import React, { useEffect } from 'react'
import Head from 'next/head'
import { User } from 'firebase/auth'

import Header from 'components/header'
import Footer from 'components/footer'

import stl from './Layout.module.scss'

interface Props {
  theme: string
  children: React.ReactNode
  title: string
  user: User
}

const Layout = ({ theme, children, title, user }: Props) => {
  const [className, setClassName] = React.useState('')

  useEffect(() => {
    theme === 'dark' ? setClassName(stl.darkMain) : setClassName('')
  }, [theme])

  const description =
    'Transform long, complex URLs into concise, branded short links with our powerful URL shortener web app. Enhance link sharing, track click analytics, and manage your links effortlessly. Get started for free today.'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="author" content="Rana Intizar" />
        <meta name="HandheldFriendly" content="true" />
        <meta property="og:title" content="Linkzar" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="applications" />
        <meta property="og:site_name" content="Linkzar" />
        <meta property="og:url" content="https://linkzar.web.app" />
        <meta
          property="og:image"
          content="favicon/android-chrome-512x512.png"
        />
        <meta name="twitter:title" content="Linkzar" />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content="favicon/android-chrome-512x512.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.MEASUREMENTID}', {
              page_path: window.location.pathname,
            });
            `,
          }}
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
      <Header theme={theme} user={user} />
      <main className={className}>{children}</main>
      <Footer theme={theme} />
    </>
  )
}

export default Layout
