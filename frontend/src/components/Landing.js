import React, { useState } from 'react';

// Theme colors: dark blue, white, light blue
const theme = {
  dark: '#06263a',
  lightBlue: '#60a5fa',
  accent: '#7dd3fc',
  white: '#ffffff'
};

const styles = {
  page: {
    minHeight: '100vh',
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    background: theme.white,
    color: theme.dark,
    margin: 0,
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2.5rem',
    borderBottom: `1px solid rgba(6,38,58,0.06)`,
    background: theme.dark,
    color: theme.white
  },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: theme.white },
  logo: { width: 44, height: 44, borderRadius: 8, background: theme.lightBlue, boxShadow: '0 6px 18px rgba(7,18,38,0.06)' },
  brandTitle: { fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.2px' },
  nav: { display: 'flex', gap: '1rem', alignItems: 'center' },
  navBtn: { color: theme.dark, textDecoration: 'none', fontWeight: 600 },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    padding: '3.5rem 2.5rem'
  },
  heroLeft: { maxWidth: 720 },
  title: { fontSize: '2.4rem', lineHeight: 1.05, margin: '0 0 1rem 0', color: theme.dark },
  subtitle: { fontSize: '1.125rem', margin: '0 0 1.5rem 0', color: 'rgba(6,38,58,0.7)' },
  ctas: { display: 'flex', gap: '0.75rem' },
  primaryBtn: {
    background: theme.lightBlue,
    color: theme.dark,
    padding: '0.7rem 1.2rem',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
    display: 'inline-block',
    boxShadow: '0 8px 20px rgba(96,165,250,0.08)'
  },
  secondaryBtn: {
    background: 'transparent',
    border: `1px solid ${theme.lightBlue}`,
    color: theme.dark,
    padding: '0.65rem 1.15rem',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600
  },
  heroGraphic: {
    width: 420,
    height: 300,
    borderRadius: 14,
    background: `linear-gradient(135deg, ${theme.accent}, ${theme.lightBlue})`,
    boxShadow: '0 30px 60px rgba(2,6,23,0.06)'
  },
  features: { display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' },
  card: { background: '#ffffff', padding: '1rem', borderRadius: 10, minWidth: 200, flex: '1 1 200px', border: '1px solid rgba(6,38,58,0.04)', boxShadow: '0 6px 18px rgba(2,6,23,0.04)' },
  cardTitle: { fontWeight: 700, marginBottom: 6 },
  footer: { padding: '2rem 2.5rem', borderTop: '1px solid rgba(6,38,58,0.06)', color: theme.white, background: theme.dark }
};

export default function Landing() {
  const [email, setEmail] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);
  const testimonials = [
    { name: 'Dr. Aisha Khan', role: 'Chief Medical Officer', quote: 'Accurate forecasts let us staff proactively — game changer.' },
    { name: 'Samuel Rivera', role: 'Hospital Administrator', quote: 'We reduced shortages by 32% in the first quarter.' },
    { name: 'Li Wei', role: 'Operations Lead', quote: 'Real-time alerts keep our supply chain responsive.' }
  ];

  function handleSignup(e) {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert('Please enter a valid email');
      return;
    }
    // placeholder behavior — integrate with backend later
    alert(`Thanks — we'll contact ${email} soon.`);
    setEmail('');
  }

  // small interactive hover states for CTAs
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverCard, setHoverCard] = useState(null);

  // hover visuals for primary CTAs
  const primaryHoverStyle = hoverPrimary ? { transform: 'translateY(-3px)', boxShadow: '0 14px 36px rgba(59,130,246,0.12)', background: '#3b82f6' } : { transition: 'transform 180ms, box-shadow 180ms' };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <a style={styles.brand} href="/">
          <div style={styles.logo} />
          <div>
            <div style={styles.brandTitle}>Hospital Resource Optimization</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Demand Forecasting System</div>
          </div>
        </a>
        <nav style={styles.nav}>
          <a style={{...styles.navBtn, color: theme.white}} href="#features">Features</a>
          <a style={{...styles.navBtn, color: theme.white}} href="#pricing">Pricing</a>
          <a style={{...styles.navBtn, color: theme.white}} href="#contact">Contact</a>
          <a style={styles.primaryBtn} href="#get-started">Get Started</a>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.title}>Hospital Resource Optimization and Demand Forecasting System</h1>
          <p style={styles.subtitle}>Make data-driven decisions with accurate forecasting, intelligent resource allocation, and real-time monitoring — built for hospitals and healthcare providers.</p>
          <div style={styles.ctas}>
            <a
              style={{ ...styles.primaryBtn, ...primaryHoverStyle }}
              onMouseEnter={() => setHoverPrimary(true)}
              onMouseLeave={() => setHoverPrimary(false)}
              href="#get-started"
            >Request a demo</a>
            <a style={styles.secondaryBtn} href="#learn-more">Learn more</a>
            <a style={{ ...styles.primaryBtn, marginLeft: 8 }} href="#/hospital-bed">Bed Forecasting</a>
          </div>

          <div style={styles.features} id="features">
            <div style={styles.card}>
              <div style={styles.cardTitle}>Demand Forecasting</div>
              <div>Short-term and long-term patient inflow predictions to optimize staffing.</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Resource Allocation</div>
              <div>Intelligent allocation of beds, equipment, and staff to reduce shortages.</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Real-time Monitoring</div>
              <div>Live dashboards and alerts for capacity and supply issues.</div>
            </div>
          </div>

          {/* Trust logos */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <div style={{ width: 100, height: 36, background: '#f5f7fb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06263a', fontWeight: 700 }}>NH</div>
            <div style={{ width: 100, height: 36, background: '#f5f7fb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06263a', fontWeight: 700 }}>Glob</div>
            <div style={{ width: 100, height: 36, background: '#f5f7fb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06263a', fontWeight: 700 }}>Care</div>
            <div style={{ width: 100, height: 36, background: '#f5f7fb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06263a', fontWeight: 700 }}>Health</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          <div style={styles.heroGraphic} aria-hidden="true">
            {/* Inline simple SVG illustration */}
            <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ borderRadius: 14 }}>
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor={theme.accent} />
                  <stop offset="100%" stopColor={theme.lightBlue} />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="600" height="420" rx="14" fill="url(#g1)" />
              <g transform="translate(40,40) scale(0.9)">
                <rect x="20" y="40" width="160" height="120" rx="10" fill="#ffffff" opacity="0.12" />
                <rect x="200" y="20" width="160" height="160" rx="10" fill="#ffffff" opacity="0.08" />
                <circle cx="460" cy="120" r="36" fill="#fff" opacity="0.12" />
                <rect x="40" y="200" width="520" height="120" rx="8" fill="#fff" opacity="0.06" />
              </g>
            </svg>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSignup} style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center' }} id="get-started">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your work email"
              style={{ padding: '0.6rem 0.9rem', borderRadius: 8, border: '1px solid rgba(6,38,58,0.06)', width: 240, background: '#fff', color: theme.dark }}
            />
            <button type="submit" onMouseEnter={() => setHoverPrimary(true)} onMouseLeave={() => setHoverPrimary(false)} style={{ ...styles.primaryBtn, ...primaryHoverStyle, padding: '0.6rem 1rem' }}>Notify me</button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '2rem 2.5rem' }}>
        <h3 style={{ margin: 0, color: theme.dark }}>Trusted by healthcare leaders</h3>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              onMouseEnter={() => setHoverCard(i)}
              onMouseLeave={() => setHoverCard(null)}
              style={{
                background: '#ffffff',
                padding: 16,
                borderRadius: 8,
                flex: '1 1 240px',
                border: hoverCard === i ? `1px solid ${theme.lightBlue}` : '1px solid rgba(6,38,58,0.04)',
                boxShadow: hoverCard === i ? '0 10px 30px rgba(96,165,250,0.08)' : '0 6px 18px rgba(2,6,23,0.03)'
              }}
            >
              <div style={{ fontStyle: 'italic', color: theme.dark }}>&ldquo;{t.quote}&rdquo;</div>
              <div style={{ marginTop: 8, fontWeight: 700, color: theme.dark }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(6,38,58,0.6)' }}>{t.role}</div>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '2rem 2.5rem' }}>
        <h3 style={{ margin: 0, color: theme.dark }}>Plans</h3>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ ...styles.card, flex: '1 1 200px', background: '#f9fafb' }}>
            <div style={styles.cardTitle}>Starter</div>
            <div style={{ fontSize: 20, fontWeight: 800, margin: '8px 0' }}>$0</div>
            <div style={{ fontSize: 14, color: 'rgba(6,38,58,0.7)' }}>Basic monitoring and weekly forecasts.</div>
            <a onMouseEnter={() => setHoverPrimary(true)} onMouseLeave={() => setHoverPrimary(false)} style={{ marginTop: 12, display: 'inline-block', ...styles.primaryBtn }} href="#get-started">Get started</a>
          </div>
          <div style={{ ...styles.card, flex: '1 1 200px', background: '#fff' }}>
            <div style={styles.cardTitle}>Pro</div>
            <div style={{ fontSize: 20, fontWeight: 800, margin: '8px 0' }}>$499/mo</div>
            <div style={{ fontSize: 14, color: 'rgba(6,38,58,0.7)' }}>Advanced forecasting, integrations, and alerts.</div>
            <a onMouseEnter={() => setHoverPrimary(true)} onMouseLeave={() => setHoverPrimary(false)} style={{ marginTop: 12, display: 'inline-block', ...styles.primaryBtn }} href="#get-started">Request demo</a>
          </div>
          <div style={{ ...styles.card, flex: '1 1 200px', background: '#fff' }}>
            <div style={styles.cardTitle}>Enterprise</div>
            <div style={{ fontSize: 20, fontWeight: 800, margin: '8px 0' }}>Custom</div>
            <div style={{ fontSize: 14, color: 'rgba(6,38,58,0.7)' }}>Tailored solutions, on-prem options, and SLAs.</div>
            <a onMouseEnter={() => setHoverPrimary(true)} onMouseLeave={() => setHoverPrimary(false)} style={{ marginTop: 12, display: 'inline-block', ...styles.primaryBtn }} href="#contact">Contact sales</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '2rem 2.5rem' }}>
        <h3 style={{ margin: 0, color: theme.dark }}>FAQ</h3>
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          {[
            { q: 'How accurate are forecasts?', a: 'Accuracy depends on data quality; our models typically deliver strong short-term accuracy and improve with continuous feedback.' },
            { q: 'Can it integrate with my EHR/IMS?', a: 'Yes — we offer integrations via secure APIs and custom connectors.' },
            { q: 'Is data hosted securely?', a: 'We support secure cloud storage with encryption in transit and at rest; on-prem options are available.' }
          ].map((f, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: theme.dark, fontWeight: 700 }}>{f.q}</button>
              {faqOpen === i && <div style={{ marginTop: 8, color: 'rgba(6,38,58,0.8)' }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Footer */}
      <section id="contact" style={{ padding: '2rem 2.5rem' }}>
        <h3 style={{ margin: 0, color: theme.dark }}>Contact</h3>
        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <div style={{ fontWeight: 700 }}>Get in touch</div>
            <div style={{ marginTop: 8, color: 'rgba(6,38,58,0.7)' }}>email@supply-health.example</div>
            <div style={{ marginTop: 4, color: 'rgba(6,38,58,0.7)' }}>+1 (555) 123-4567</div>
          </div>
          <div style={{ flex: '1 1 320px' }}>
            <div style={{ fontWeight: 700 }}>Office</div>
            <div style={{ marginTop: 8, color: 'rgba(6,38,58,0.7)' }}>Remote / HQ: City, Country</div>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} Hospital Resource Optimization — Built with clarity and care. • <a href="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy</a>
      </footer>
    </div>
  );
}
