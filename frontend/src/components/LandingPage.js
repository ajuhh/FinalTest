import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <section className="hero-card card">
      <div className="grid-2" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '10px 16px', borderRadius: '999px', background: '#eff6ff', color: '#1d4ed8', marginBottom: '20px', fontWeight: 700 }}>
            Backend Intern Assignment
          </div>
          <h1 className="section-heading">Paragraph Analyzer</h1>
          <p className="text-muted" style={{ maxWidth: '520px', lineHeight: '1.75' }}>
            This app allows you to add paragraphs, analyze word frequencies and search for words across your paragraphs.
          </p>
          <Link to="/register" className="button-primary" style={{ display: 'inline-block', marginTop: '24px' }}>
            Get Started
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '520px', minHeight: '320px', background: '#eef2ff', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#475569' }}>
              <div style={{ fontSize: '72px' }}>📝</div>
              <p>Simple paragraph analytics dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
