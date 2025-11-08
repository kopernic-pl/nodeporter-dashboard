import React from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import '../styles/globals.css';
import '../styles/palette.css';
import '@fontsource/press-start-2p';
import '@fontsource/vt323';

function Footer() {
  return (
    <footer className="retro-footer">
      <span>
        NodePorter {process.env.NEXT_PUBLIC_VERSION ? `v${process.env.NEXT_PUBLIC_VERSION}` : 'dev'}
        &nbsp;|&nbsp;
      </span>
      <a
        href="https://github.com/kopernic-pl/nodeporter-dashboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </footer>
  );
}

export default function MyApp({ Component, pageProps }) {
  useReportWebVitals((metric) => {
    reportWebVitals(metric);
  });
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export function reportWebVitals(metric) {
  if (typeof window !== 'undefined') {
    console.log('[Web Vitals]', metric);
  }
}
