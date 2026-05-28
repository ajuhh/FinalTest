import { Link } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 6h16M4 10h16M4 14h10" />
      </svg>
    ),
    title: 'Add Paragraphs',
    desc: 'Paste or type any text. We split it into paragraphs automatically.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: 'Search Words',
    desc: 'Find which paragraphs contain a word, ranked by how often it appears.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Word Frequency',
    desc: 'Every paragraph is analyzed in the background to count word frequencies.',
  },
];

function LandingPage() {
  return (
    <div className="landing-root">

      {/* Hero */}
      <section className="landing-hero card">
        <div className="landing-hero-inner">
          <div className="landing-hero-text">
            <div className="landing-eyebrow">Paragraph Analysis Tool</div>
            <h1 className="landing-title">Find any word across your paragraphs</h1>
            <p className="landing-desc">
              Add your text, search for any word, and instantly see which paragraphs match — ranked by relevance.
            </p>
            <div className="landing-actions">
              <Link to="/register" className="button-primary landing-btn">Get Started</Link>
            </div>
          </div>
          <div className="landing-hero-visual">
            <div className="landing-mock-card">
              <div className="landing-mock-search">
                <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <span>Search a word...</span>
              </div>
              <div className="landing-mock-result">
                <div className="landing-mock-rank">1</div>
                <div className="landing-mock-lines">
                  <div className="landing-mock-line" style={{ width: '90%' }} />
                  <div className="landing-mock-line" style={{ width: '70%' }} />
                </div>
                <div className="landing-mock-badge">5×</div>
              </div>
              <div className="landing-mock-result" style={{ opacity: 0.6 }}>
                <div className="landing-mock-rank">2</div>
                <div className="landing-mock-lines">
                  <div className="landing-mock-line" style={{ width: '80%' }} />
                  <div className="landing-mock-line" style={{ width: '55%' }} />
                </div>
                <div className="landing-mock-badge">3×</div>
              </div>
              <div className="landing-mock-result" style={{ opacity: 0.35 }}>
                <div className="landing-mock-rank">3</div>
                <div className="landing-mock-lines">
                  <div className="landing-mock-line" style={{ width: '75%' }} />
                  <div className="landing-mock-line" style={{ width: '45%' }} />
                </div>
                <div className="landing-mock-badge">1×</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        {features.map((f) => (
          <div key={f.title} className="landing-feature-card card">
            <div className="landing-feature-icon">{f.icon}</div>
            <div className="landing-feature-title">{f.title}</div>
            <div className="landing-feature-desc">{f.desc}</div>
          </div>
        ))}
      </section>

    </div>
  );
}

export default LandingPage;
