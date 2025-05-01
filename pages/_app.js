import React from 'react';
import '../styles/globals.css';
import '@fontsource/press-start-2p';
import '@fontsource/vt323';

function Footer() {
  return (
    <footer className="retro-footer">
      <span>NodePorter&nbsp;|&nbsp;</span>
      <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </footer>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

// Next.js will call this function with Web Vitals metrics
export function reportWebVitals(metric) {
  // You can send metrics to an analytics endpoint here
  // For now, just log them to the console
  if (typeof window !== 'undefined') {
    // Only log in the browser
    console.log('[Web Vitals]', metric);
  }
}
