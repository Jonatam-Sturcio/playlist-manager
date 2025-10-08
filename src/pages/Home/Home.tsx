import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <main className="home-main">
        <section className="welcome-section">
          <h1>🎵 Bem-vindo ao Playlist Manager!</h1>
          <p>Gerencie suas playlists favoritas e descubra novas músicas</p>
        </section>
        <section className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate('/playlists')}>
              <h3>🎼 Criar Playlist</h3>
              <p>Crie uma nova playlist personalizada</p>
            </div>
            <div className="action-card" onClick={() => navigate('/musicas')}>
              <h3>🔍 Buscar Músicas</h3>
              <p>Encontre suas músicas favoritas</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;