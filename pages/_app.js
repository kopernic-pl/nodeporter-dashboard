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
