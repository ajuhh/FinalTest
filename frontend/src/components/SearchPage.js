import { useState } from 'react';

function SearchPage({ onSearch, results }) {
  const [searchTerm, setSearchTerm] = useState('django');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <section className="grid-2" style={{ gap: '28px' }}>
      <div className="card form-card" style={{ minHeight: '420px' }}>
        <h2 className="section-heading">Search Word</h2>
        <p className="text-muted">Search for a word and find the top paragraphs that contain it.</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px', marginTop: '24px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Enter a search term"
            required
          />
          <button type="submit" className="button-primary">
            Search
          </button>
        </form>
      </div>
      <div className="card panel-card">
        <h3 className="section-heading" style={{ fontSize: '20px' }}>Top 10 Paragraphs</h3>
        {results.length === 0 ? (
          <p className="text-muted">Search a word to view top matching paragraphs.</p>
        ) : (
          results.map((item, index) => (
            <div key={item.id} className="list-item">
              <div style={{ maxWidth: '75%' }}>
                <strong>{index + 1}.</strong> {item.text}
              </div>
              <span>{item.count}</span>
            </div>
          ))
        )}
        {results.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <a href="/dashboard" className="link-inline">View latest paragraphs</a>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchPage;
