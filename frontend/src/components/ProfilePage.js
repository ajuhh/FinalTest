import { useEffect, useState } from 'react';

function ProfilePage({ user, onUpdate, onPasswordChange }) {
  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    dob: user?.date_of_birth || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.full_name || '',
        email: user.email || '',
        dob: user.date_of_birth || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    await onUpdate(form);
    setStatusMessage('Profile updated successfully.');
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setStatusMessage('Please fill both password fields.');
      return;
    }
    await onPasswordChange(passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '' });
    setStatusMessage('Password changed successfully.');
  };

  return (
    <section className="card form-card" style={{ maxWidth: '720px', margin: 'auto' }}>
      <h2 className="section-heading">My Profile</h2>
      <p className="text-muted">Manage your account information.</p>
      {statusMessage && (
        <div style={{ padding: '16px', background: '#e0f2fe', borderRadius: '16px', margin: '20px 0' }}>
          {statusMessage}
        </div>
      )}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <h3 className="section-heading" style={{ fontSize: '20px' }}>Profile Information</h3>
        <div className="info-row" style={{ marginTop: '16px' }}>
          <div>
            <strong>Name</strong>
            <span>{user?.full_name || '—'}</span>
          </div>
          <div>
            <strong>Email</strong>
            <span>{user?.email || '—'}</span>
          </div>
          <div>
            <strong>Date of Birth</strong>
            <span>{user?.date_of_birth || '—'}</span>
          </div>
          <div>
            <strong>Member Since</strong>
            <span>{user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}</span>
          </div>
        </div>
      </div>
      <div style={{ background: '#f8fafc', borderRadius: '18px', padding: '24px' }}>
        <h3 className="section-heading" style={{ fontSize: '20px' }}>Update Profile</h3>
        <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gap: '18px', marginTop: '24px' }}>
          <label style={{ display: 'block' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Name</div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label style={{ display: 'block' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Email</div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label style={{ display: 'block' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Date of Birth</div>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={(event) => setForm({ ...form, dob: event.target.value })}
            />
          </label>
          <button type="submit" className="button-primary">
            Save Changes
          </button>
        </form>
      </div>
      <div style={{ background: '#f8fafc', borderRadius: '18px', padding: '24px', marginTop: '24px' }}>
        <h3 className="section-heading" style={{ fontSize: '20px' }}>Change Password</h3>
        <p className="text-muted">Enter your current password and choose a new one.</p>
        <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '18px', marginTop: '24px' }}>
          <label style={{ display: 'block' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Current Password</div>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
              required
            />
          </label>
          <label style={{ display: 'block' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>New Password</div>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
              required
            />
          </label>
          <button type="submit" className="button-primary">
            Change Password
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;
