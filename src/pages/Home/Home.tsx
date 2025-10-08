import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { getTop3Musics } from '../../store/slices/musicSlice';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const artistName = 'Queen'; 

  const { topTracks} = useSelector(
    (state: RootState) => state.music
  );

  useEffect(() => {
    dispatch(getTop3Musics(artistName));
  }, [dispatch]);

  return (
    <div className="home-container">
      <main className="home-main">
        <section className="welcome-section">
          <h1>🎵 Bem-vindo ao Playlist Manager!</h1>
          <p>Gerencie suas playlists favoritas e descubra novas músicas</p>
        </section>
        <section className="popular-section">
          <h2>👑 Top 3 do Queen</h2>
          <div className="music-grid">
            {topTracks.map((music, index) => (
            <div key={music.id} className="music-card">
              <div className="music-rank">#{index + 1}</div>
              <div className="music-info">
                <h3>{music.name}</h3>
                <p>{music.artist}</p>
                <span className="genre">{music.genre}</span>
                {music.year && <span className="year">({music.year})</span>}
              </div>
            </div>
            ))}
          </div>
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