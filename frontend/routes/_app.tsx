import { type PageProps } from "$fresh/server.ts";
import Header from "../components/header.tsx"
import Footer from "../components/footer.tsx";
export default function App({ Component }: PageProps) {
  return (
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh-site</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Header />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
