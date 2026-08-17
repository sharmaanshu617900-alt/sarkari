import { Inter } from "next/font/google";
import "./globals.css";
import ScrollEffects from "@/components/ScrollEffects";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata = {
  title: "Sarkari Updates — Sarkari Jobs, Admit Cards, Results & Answer Keys 2026",
  description: "India's #1 AI-powered portal for latest Sarkari Jobs, Admit Cards, Results, Answer Keys and Syllabus. SSC, UPSC, Railway, Banking, Police, Teaching — updated 24/7.",
  keywords: "sarkari jobs, sarkari result, admit card, sarkari exam, ssc, upsc, railway, banking jobs, government jobs india",
  openGraph: {
    title: "Sarkari Updates — Every Sarkari Update in One Place",
    description: "Latest Sarkari Jobs, Admit Cards, Results for SSC, UPSC, Railway, Banking, Police and Teaching.",
    type: "website",
    locale: "en_IN",
    siteName: "Sarkari Updates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Updates — Govt Job Portal",
    description: "India's fastest growing portal for Sarkari Jobs and Exam Updates.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Sarkari Updates",
  "alternateName": "Sarkari Jobs, Admit Card & Result Portal",
  "url": "https://www.sarkariupdates.in/",
  "inLanguage": "en-IN",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.sarkariupdates.in/jobs?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NTW3Z9T9');
          `}
        </Script>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇮🇳</text></svg>" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NTW3Z9T9"
          height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        {children}
        <ScrollEffects />
      </body>
    </html>
  );
}
