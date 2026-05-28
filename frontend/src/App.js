import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AddParagraphsPage from './components/AddParagraphsPage';
import SearchPage from './components/SearchPage';
import ProfilePage from './components/ProfilePage';
import API from './api';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('codemonk_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [paragraphs, setParagraphs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('codemonk_token');
    if (token) {
      Promise.all([fetchProfile(), fetchParagraphs()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const saveUser = (data) => {
    localStorage.setItem('codemonk_user', JSON.stringify(data));
    setUser(data);
  };

  const saveToken = (token) => {
    if (token) {
      localStorage.setItem('codemonk_token', token);
    } else {
      localStorage.removeItem('codemonk_token');
    }
  };

  const logout = () => {
    saveToken(null);
    localStorage.removeItem('codemonk_user');
    setUser(null);
    setParagraphs([]);
    setSearchResults([]);
    navigate('/login');
  };

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('profile/');
      saveUser(data);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  const fetchParagraphs = async () => {
    try {
      const { data } = await API.get('paragraphs/');
      setParagraphs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (form) => {
    const { data } = await API.post('auth/register/', {
      email: form.email,
      password: form.password,
      full_name: form.name,
      date_of_birth: form.dob,
    });
    saveToken(data.token);
    saveUser(data.user);
    await fetchParagraphs();
    navigate('/dashboard');
  };

  const handleLogin = async (form) => {
    const { data } = await API.post('auth/login/', {
      email: form.email,
      password: form.password,
    });
    saveToken(data.token);
    saveUser(data.user);
    await fetchParagraphs();
    navigate('/dashboard');
  };

  const handleAddParagraph = async (text) => {
    await API.post('paragraphs/', { text });
    await fetchParagraphs();
    navigate('/dashboard');
  };

  const handleSearch = async (term) => {
    if (!term?.trim()) {
      setSearchResults([]);
      return;
    }
    const { data } = await API.get(`paragraphs/search/?q=${encodeURIComponent(term)}`);
    setSearchResults(data);
  };

  const handleUpdateProfile = async (profile) => {
    const { data } = await API.put('profile/', {
      email: profile.email,
      full_name: profile.name,
      date_of_birth: profile.dob,
    });
    saveUser(data);
  };

  const handleChangePassword = async (passwordDto) => {
    await API.post('auth/change-password/', {
      current_password: passwordDto.currentPassword,
      new_password: passwordDto.newPassword,
    });
  };

  const stats = useMemo(() => {
    const totalWords = paragraphs.reduce((sum, p) => sum + p.text.split(/\s+/).filter(Boolean).length, 0);
    const uniqueWords = new Set(paragraphs.flatMap((p) => p.text.toLowerCase().split(/\s+/).filter(Boolean))).size;
    return {
      totalParagraphs: paragraphs.length,
      totalWords,
      uniqueWords,
      searches: searchResults.length,
    };
  }, [paragraphs, searchResults.length]);

  if (loading) {
    return <div className="app-shell" style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={logout} />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<AuthPage mode="register" onSubmit={handleRegister} />} />
          <Route path="/login" element={<AuthPage mode="login" onSubmit={handleLogin} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} stats={stats} paragraphs={paragraphs} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/add"
            element={user ? <AddParagraphsPage onSubmit={handleAddParagraph} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/search"
            element={user ? <SearchPage onSearch={handleSearch} results={searchResults} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={
              user ? (
                <ProfilePage
                  user={user}
                  onUpdate={handleUpdateProfile}
                  onPasswordChange={handleChangePassword}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
