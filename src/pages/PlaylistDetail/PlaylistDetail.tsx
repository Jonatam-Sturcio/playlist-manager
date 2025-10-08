import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeMusicFromPlaylist } from '../../store/slices/playlistSlice';
import type { Playlist } from '../../types';
import './PlaylistDetail.css';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { playlists } = useAppSelector(state => state.playlists);
  const { currentUser } = useAppSelector(state => state.user);
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar a playlist e atualizar quando o estado mudar
  useEffect(() => {
    if (id && playlists.length > 0) {
      const foundPlaylist = playlists.find(p => p.id === id && p.userId === currentUser?.id);
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
      } else {
        // Playlist não encontrada, redirecionar
        navigate('/playlists');
      }
      setLoading(false);
    }
  }, [id, playlists, currentUser, navigate]);

  const handleRemoveMusic = (musicId: string) => {
    if (playlist && window.confirm('Tem certeza que deseja remover esta música da playlist?')) {
      dispatch(removeMusicFromPlaylist({ 
        playlistId: playlist.id, 
        musicId 
      }));
      // A playlist será atualizada automaticamente via useEffect
    }
  };

  const handleBackToPlaylists = () => {
    navigate('/playlists');
  };

  if (loading) {
    return (
      <div className="playlist-detail-container">
        <div className="loading">Carregando playlist...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-detail-container">
        <div className="error-state">
          <h3>Playlist não encontrada</h3>
          <p>A playlist que você está procurando não existe ou não pertence a você.</p>
          <button onClick={handleBackToPlaylists} className="back-btn">
            ← Voltar para Playlists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-detail-container">
      <header className="playlist-detail-header">
        <button 
          onClick={handleBackToPlaylists}
          className="back-btn"
        >
          ← Voltar para Playlists
        </button>
        <h1>🎵 {playlist.name}</h1>
      </header>

      <div className="playlist-details">
        <div className="playlist-meta">
          <p><strong>Total de músicas:</strong> {playlist.musics.length}</p>
          <p><strong>Criada em:</strong> {new Date(playlist.createdAt).toLocaleDateString()}</p>
          <p><strong>Última atualização:</strong> {new Date(playlist.updatedAt).toLocaleDateString()}</p>
        </div>

        {playlist.musics.length === 0 ? (
          <div className="empty-playlist">
            <h3>🎼 Playlist vazia</h3>
            <p>Adicione músicas a esta playlist indo para a seção "Buscar Músicas"</p>
            <button 
              onClick={() => navigate('/musicas')}
              className="search-music-btn"
            >
              🔍 Buscar Músicas
            </button>
          </div>
        ) : (
          <div className="playlist-musics">
            <h3>Músicas na playlist:</h3>
            <div className="musics-list">
              {playlist.musics.map((music, index) => (
                <div key={music.id} className="music-item">
                  <div className="music-number">#{index + 1}</div>
                  <div className="music-info">
                    <h4>{music.name}</h4>
                    <p className="artist">{music.artist}</p>
                    {music.album && <p className="album">📀 {music.album}</p>}
                    <div className="music-meta">
                      <span className="genre">{music.genre}</span>
                      {music.year && <span className="year">({music.year})</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveMusic(music.id)}
                    className="remove-music-btn"
                    title="Remover música da playlist"
                  >
                    🗑️ Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;