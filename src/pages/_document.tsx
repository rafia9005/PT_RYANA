import { Html, Head, Main, NextScript } from "next/document";
import Seo from "@/app/Seo";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>PT Ryana Astra Jaya</title>
        <Seo />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
