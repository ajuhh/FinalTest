function StatCard({ label, value, icon, accent }) {
  return (
    <div className="stat-card" style={{ '--accent': accent }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Dashboard({ user, stats, paragraphs }) {
  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const initials = user?.full_name
    ? user.full_name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="dashboard-root">

      {/* Welcome banner */}
      <div className="dashboard-banner">
        <div className="dashboard-banner-text">
          <h1 className="dashboard-title">Welcome back, {firstName} 👋</h1>
          <p className="dashboard-subtitle">Here's what's happening with your paragraphs today.</p>
        </div>
        <a href="/add" className="button-primary dashboard-cta">+ Add Paragraphs</a>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard label="Total Paragraphs" value={stats.totalParagraphs} accent="#6366f1"
          icon={<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h10"/></svg>} />
        <StatCard label="Total Words" value={stats.totalWords.toLocaleString()} accent="#0ea5e9"
          icon={<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>} />
        <StatCard label="Unique Words" value={stats.uniqueWords.toLocaleString()} accent="#10b981"
          icon={<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>} />
      </div>

      {/* Bottom grid */}
      <div className="dashboard-bottom">

        {/* Recent paragraphs */}
        <section className="card dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Recent Paragraphs</h2>
            <a href="/search" className="link-inline" style={{ fontSize: '14px' }}>View all →</a>
          </div>
          {paragraphs.length === 0 ? (
            <div className="dash-empty">
              <span style={{ fontSize: '40px' }}>📝</span>
              <p>No paragraphs yet. Add some to get started.</p>
              <a href="/add" className="button-primary" style={{ marginTop: '8px', display: 'inline-block' }}>Add Paragraphs</a>
            </div>
          ) : (
            <ul className="paragraph-list">
              {paragraphs.slice(0, 4).map((p) => (
                <li key={p.id} className="paragraph-list-item">
                  <p className="paragraph-preview">{p.text}</p>
                  <div className="paragraph-meta">
                    <span className="para-badge">{p.word_count} words</span>
                    <span className="text-muted" style={{ fontSize: '12px' }}>
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Profile summary */}
        <section className="card dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Profile</h2>
            <a href="/profile" className="link-inline" style={{ fontSize: '14px' }}>Edit →</a>
          </div>
          <div className="profile-summary-avatar">
            <div className="profile-avatar-lg">{initials}</div>
            <div>
              <div className="profile-name">{user?.full_name || '—'}</div>
              <div className="text-muted" style={{ fontSize: '14px' }}>{user?.email || '—'}</div>
            </div>
          </div>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Date of Birth</span>
              <span className="profile-info-value">{user?.date_of_birth || '—'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">
                {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Paragraphs</span>
              <span className="profile-info-value">{stats.totalParagraphs}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Words Written</span>
              <span className="profile-info-value">{stats.totalWords.toLocaleString()}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Dashboard;
