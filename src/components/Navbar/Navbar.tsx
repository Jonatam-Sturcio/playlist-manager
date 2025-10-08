import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/userSlice';
import { clearPlaylistData } from '../../store/slices/playlistSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { currentUser } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(clearPlaylistData());
    dispatch(logout());
    navigate('/login');
  };

  if (!currentUser?.isLoggedIn) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => navigate('/home')}>
          🎵 Playlist Manager
        </div>
        
        <div className="navbar-links">
          <button 
            onClick={() => navigate('/home')}
            className={`nav-link ${isActive('/home') ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/playlists')}
            className={`nav-link ${isActive('/playlists') ? 'active' : ''}`}
          >
            Minhas Playlists
          </button>
          <button 
            onClick={() => navigate('/musicas')}
            className={`nav-link ${isActive('/musicas') ? 'active' : ''}`}
          >
            Buscar Músicas
          </button>
        </div>

        <div className="navbar-user">
          <span className="user-email">{currentUser.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;