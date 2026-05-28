import { useState } from 'react';

function AddParagraphsPage({ onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.trim().length === 0) return;
    onSubmit(text.trim());
    setText('');
  };

  return (
    <section className="card form-card" style={{ maxWidth: '720px', margin: 'auto' }}>
      <h2 className="section-heading">Add Paragraphs</h2>
      <p className="text-muted">Enter your text below. Separate paragraphs with two newline characters.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px', marginTop: '24px' }}>
        <textarea
          rows="12"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type or paste your text here...\nEnsure paragraphs are separated by two newline characters."
          required
        />
        <div style={{ background: '#f8fafc', borderRadius: '18px', padding: '18px' }}>
          <strong>Example:</strong>
          <p style={{ margin: '12px 0 0', lineHeight: '1.75' }}>
            This is the first paragraph.\nIt has multiple lines.
          </p>
          <p style={{ margin: '8px 0 0', lineHeight: '1.75' }}>
            This is the second paragraph.\nIt is separated by two new lines.
          </p>
        </div>
        <button type="submit" className="button-primary">Submit Paragraphs</button>
      </form>
    </section>
  );
}

export default AddParagraphsPage;
