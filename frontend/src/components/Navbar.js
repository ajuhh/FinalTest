import { Link, NavLink } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <header className="card panel-card navbar-shell">
      <div className="navbar-left">
        <Link to="/" className="brand-link">
          Codemonk
        </Link>
      </div>

      <div className="navbar-center">
        {user ? (
          <nav className="navbar-links">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              Dashboard
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              Add Paragraphs
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              Search Word
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              Profile
            </NavLink>
          </nav>
        ) : null}
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="user-section">
            <div className="user-badge">{initials || 'U'}</div>
            <div className="user-info">
              <span className="user-greeting">Hi, {user.full_name?.split(' ')[0] || 'User'}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button type="button" className="button-secondary nav-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-action-link">
              Login
            </Link>
            <Link to="/register" className="button-primary nav-action-button">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
