import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function AuthPage({ mode, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', dob: '', password: '' });

  const isRegister = mode === 'register';
  const title = isRegister ? 'Create Account' : 'Welcome Back';
  const subtitle = isRegister ? 'Register to get started' : 'Login to your account';

  const fields = useMemo(() => {
    const common = [
      { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email' },
      { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
    ];
    if (isRegister) {
      return [
        { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter your name' },
        { label: 'Date of Birth', name: 'dob', type: 'date', placeholder: '' },
        ...common,
      ];
    }
    return common;
  }, [isRegister]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <section className="card form-card" style={{ maxWidth: '520px', margin: 'auto' }}>
      <h2 className="section-heading">{title}</h2>
      <p className="text-muted">{subtitle}</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px', marginTop: '24px' }}>
        {fields.map((field) => (
          <label key={field.name} style={{ display: 'block' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>{field.label}</div>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              required
            />
          </label>
        ))}
        <button type="submit" className="button-primary">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#475569' }}>
        {isRegister ? (
          <span>
            Already have an account? <Link to="/login" className="link-inline">Login</Link>
          </span>
        ) : (
          <span>
            Don’t have an account? <Link to="/register" className="link-inline">Register</Link>
          </span>
        )}
      </div>
    </section>
  );
}

export default AuthPage;
