import Document, { Head, Html, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head>
          <link
            rel="preload stylesheet"
            as="style"
            href="https://rsms.me/inter/inter.css"
            crossOrigin="anonymous"
          />
          <link
            rel="preload stylesheet"
            as="style"
            href="/fonts/fonts.css"
            crossOrigin="anonymous"
          />
          {process.env.NODE_ENV === "production" && (
            <script
              async
              defer
              data-host-url="https://stats.drop.app"
              data-website-id="8487d91d-eef6-44ca-b299-9d5f60b8b50d"
              src="https://stats.drop.app/umami.js"
            ></script>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
