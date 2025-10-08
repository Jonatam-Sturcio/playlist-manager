import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import {
  searchAlbumsByArtist,
  clearSearchResults
} from '../../store/slices/musicSlice';
import type { Album } from '../../types';
import './Music.css';

const MusicPage: React.FC = () => {
  const { currentUser } = useAppSelector(state => state.user);
  const { playlists } = useAppSelector(state => state.playlists);
  const { albumResults, loading } = useAppSelector(state => state.music);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [artistQuery, setArtistQuery] = useState('');
  const [showAddToPlaylist, setShowAddToPlaylist] = useState<string | null>(null);
  const [showTopMusics, setShowTopMusics] = useState(true);
  const [addedMusicFeedback] = useState<{ musicName: string; playlistName: string } | null>(null);

  const userPlaylists = playlists.filter(p => p.userId === currentUser?.id);

  useEffect(() => {
    const savedQuery = localStorage.getItem('lastArtistQuery');
    const savedResults = localStorage.getItem('lastAlbumResults');

    if (savedQuery && savedResults) {
      try {
        setArtistQuery(savedQuery);
        setShowTopMusics(false);
        dispatch({
          type: 'music/searchAlbumsByArtist/fulfilled',
          payload: JSON.parse(savedResults),
        });
      } catch (err) {
        console.error('Erro ao restaurar busca salva:', err);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (albumResults.length > 0 && artistQuery.trim()) {
      localStorage.setItem('lastArtistQuery', artistQuery);
      localStorage.setItem('lastAlbumResults', JSON.stringify(albumResults));
    }
  }, [albumResults, artistQuery]);

  const handleSearch = () => {
    if (artistQuery.trim()) {
      dispatch(searchAlbumsByArtist(artistQuery.trim()));
      setShowTopMusics(false);
    }
  };

  const handleViewAlbumTracks = (album: Album) => {
    navigate(`/albums/${album.id}`);
  };

  const handleClearSearch = () => {
    dispatch(clearSearchResults());
    setArtistQuery('');
    setShowTopMusics(true);
    localStorage.removeItem('lastArtistQuery');
    localStorage.removeItem('lastAlbumResults');
  };


  const displayAlbums = albumResults;

  return (
    <div className="music-container">
      <header className="music-header">
        <h1>
          {'🎵 Álbuns'}
        </h1>
      </header>

      <div className="search-section">
        <div className="search-form">
          <input
            type="text"
            value={artistQuery}
            onChange={(e) => setArtistQuery(e.target.value)}
            placeholder="Buscar por artista..."
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading || !artistQuery.trim()}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button onClick={handleClearSearch} className="clear-btn">
            Limpar
          </button>
        </div>
      </div>

      <div className="music-grid">
        {showTopMusics ? (
          <div className="empty-state">
            <h3>Pesquise por uma banda</h3>
          </div>
        ) : (!showTopMusics && displayAlbums.length === 0) ? (
          <div className="empty-state">
            <h3>Nenhum álbum encontrado</h3>
            <p>Tente buscar por outro artista</p>
          </div>
        ) : (
          <>
            {!showTopMusics && displayAlbums.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-info">
                  <h3>{album.name}</h3>
                  <p className="artist">{album.artist}</p>
                  {album.year && <p className="year">📅 {album.year}</p>}
                  {album.genre && <p className="genre">🎭 {album.genre}</p>}
                </div>

                {album.thumb && (
                  <div className="album-thumb">
                    <img src={album.thumb} alt={album.name} />
                  </div>
                )}

                <button
                  onClick={() => handleViewAlbumTracks(album)}
                  className="view-tracks-btn"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : '🎵 Ver Músicas'}
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {showAddToPlaylist && (
        <div className="add-to-playlist-modal" onClick={() => setShowAddToPlaylist(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Adicionar à Playlist</h4>
              <button
                onClick={() => setShowAddToPlaylist(null)}
                className="close-modal-x"
              >
                ×
              </button>
            </div>

            {userPlaylists.length === 0 ? (
              <div className="no-playlists">
                <p>Você não tem playlists. Crie uma primeiro!</p>
                <p><small>Vá para "Minhas Playlists" para criar uma nova playlist</small></p>
              </div>
            ) : (
              <div className="playlist-options">
                <p className="playlist-instruction">Selecione uma playlist:</p>
                {userPlaylists.map(playlist => (
                  <button
                    key={playlist.id}
                    className="playlist-option"
                  >
                    <div className="playlist-option-content">
                      <span className="playlist-name">📁 {playlist.name}</span>
                      <span className="playlist-count">{playlist.musics.length} música(s)</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddToPlaylist(null)}
              className="close-modal-btn"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="music-stats">
        <p>
          {`${displayAlbums.length} álbuns encontrados`}
        </p>
        {userPlaylists.length > 0 && (
          <p>Você tem {userPlaylists.length} playlist(s) disponível(eis)</p>
        )}
      </div>

      {addedMusicFeedback && (
        <div className="success-feedback">
          <div className="feedback-content">
            <div className="feedback-icon">✅</div>
            <div className="feedback-text">
              <strong>"{addedMusicFeedback.musicName}"</strong> foi adicionada à playlist <strong>"{addedMusicFeedback.playlistName}"</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage;
