import React from 'react';

const styles = {
  landingHero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4rem 6rem',
    background: 'linear-gradient(180deg,#0f1724 0%,#071126 100%)',
    color: '#fff',
    boxSizing: 'border-box',
    flexWrap: 'wrap'
  },
  landingContent: {
    maxWidth: '720px'
  },
  landingTitle: {
    fontSize: '3rem',
    margin: '0 0 1rem 0',
    lineHeight: 1.05
  },
  landingSubtitle: {
    fontSize: '1.125rem',
    margin: '0 0 1.5rem 0',
    color: '#cbd5e1'
  },
  ctaBtn: {
    display: 'inline-block',
    marginRight: '0.75rem',
    padding: '0.6rem 1.1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 600
  },
  primary: {
    background: '#06b6d4',
    color: '#042029'
  },
  outline: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#e6eef7'
  },
  landingGraphic: {
    width: '360px',
    height: '240px',
    background: 'linear-gradient(135deg,#0ea5a4, #7dd3fc)',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(2,6,23,0.6)',
    flex: '0 0 360px'
  }
};

export default function Landing() {
  return (
    <main style={styles.landingHero}>
      <div style={styles.landingContent}>
        <h1 style={styles.landingTitle}>Welcome to Project Meth</h1>
        <p style={styles.landingSubtitle}>Secure, simple authentication for your app.</p>
        <div>
          <a style={{...styles.ctaBtn, ...styles.primary}} href="#get-started">Get started</a>
          <a style={{...styles.ctaBtn, ...styles.outline}} href="#learn-more">Learn more</a>
        </div>
      </div>
      <div style={styles.landingGraphic} aria-hidden="true"></div>
    </main>
  );
}
