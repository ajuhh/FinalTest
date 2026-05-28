function Dashboard({ user, stats, paragraphs }) {
  return (
    <div className="grid-2" style={{ gap: '28px' }}>
      <section className="card panel-card">
        <div className="panel-row" style={{ marginBottom: '24px' }}>
          <div>
            <h2 className="section-heading">Dashboard</h2>
            <p className="text-muted">
              Welcome back{user?.full_name ? `, ${user.full_name}` : ''}! Here’s your overview.
            </p>
          </div>
          <div className="badge">{stats.totalParagraphs}</div>
        </div>
        <div className="grid-2" style={{ gap: '18px', marginBottom: '24px' }}>
          <div className="metric-card">
            <strong>{stats.totalParagraphs}</strong>
            Total Paragraphs
          </div>
          <div className="metric-card">
            <strong>{stats.totalWords}</strong>
            Total Words
          </div>
          <div className="metric-card">
            <strong>{stats.uniqueWords}</strong>
            Unique Words
          </div>
          <div className="metric-card">
            <strong>{stats.searches}</strong>
            Recent Searches
          </div>
        </div>
        <div>
          <h3 className="section-heading" style={{ fontSize: '20px' }}>
            Recent Paragraphs
          </h3>
          {paragraphs.length === 0 ? (
            <p className="text-muted">No paragraphs added yet. Use Add Paragraphs to get started.</p>
          ) : (
            paragraphs.slice(0, 3).map((paragraph) => (
              <div key={paragraph.id} className="list-item">
                <div style={{ maxWidth: '75%' }}>{paragraph.text}</div>
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {new Date(paragraph.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
          <div style={{ marginTop: '12px' }}>
            <a href="/search" className="link-inline">
              View all
            </a>
          </div>
        </div>
      </section>
      <section className="card form-card">
        <h3 className="section-heading" style={{ fontSize: '20px' }}>
          Profile Summary
        </h3>
        <div className="info-row" style={{ marginBottom: '24px' }}>
          <div>
            <strong>{user?.full_name || '—'}</strong>
            <span>Name</span>
          </div>
          <div>
            <strong>{user?.email || '—'}</strong>
            <span>Email</span>
          </div>
          <div>
            <strong>{user?.date_of_birth || '—'}</strong>
            <span>Date of Birth</span>
          </div>
          <div>
            <strong>{user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}</strong>
            <span>Member Since</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
