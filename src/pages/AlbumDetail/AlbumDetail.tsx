import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { getMusicsByAlbum } from '../../store/slices/musicSlice';
import { addMusicToPlaylist } from '../../store/slices/playlistSlice';
import type { Album, Music } from '../../types';
import './AlbumDetail.css';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { albumResults, currentAlbumTracks, loading, error } = useAppSelector(state => state.music);
  const { playlists } = useAppSelector(state => state.playlists);
  const { currentUser } = useAppSelector(state => state.user);
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState<string | null>(null);
  const [addedMusicFeedback, setAddedMusicFeedback] = useState<{ musicName: string; playlistName: string } | null>(null);

  // Filtrar playlists do usuário atual
  const userPlaylists = playlists.filter(p => p.userId === currentUser?.id);

  // Buscar o álbum e suas músicas
  useEffect(() => {
    if (id && albumResults.length > 0) {
      const foundAlbum = albumResults.find(a => a.id === id);
      if (foundAlbum) {
        setAlbum(foundAlbum);
        // Buscar músicas do álbum se ainda não foram carregadas
        if (!currentAlbumTracks.length || currentAlbumTracks[0]?.album !== foundAlbum.name) {
          dispatch(getMusicsByAlbum({ albumId: foundAlbum.id, albumName: foundAlbum.name }));
        }
      } else {
        // Álbum não encontrado, redirecionar
        navigate('/musicas');
      }
    } else if (id && albumResults.length === 0) {
      // Se não há álbuns carregados, redirecionar para busca
      navigate('/musicas');
    }
  }, [id, albumResults, currentAlbumTracks, dispatch, navigate]);

  const handleBackToSearch = () => {
    navigate('/musicas');
  };

  const handleAddToPlaylist = (music: Music, playlistId: string) => {
    const playlist = userPlaylists.find(p => p.id === playlistId);
    if (playlist) {
      dispatch(addMusicToPlaylist({ playlistId, music }));
      setAddedMusicFeedback({ musicName: music.name, playlistName: playlist.name });
      setShowAddToPlaylist(null);
      
      // Remove feedback após 3 segundos
      setTimeout(() => {
        setAddedMusicFeedback(null);
      }, 3000);
    }
  };

  // Função para verificar se uma música já está em playlists do usuário
  const getMusicPlaylistStatus = (musicId: string) => {
    const playlistsWithMusic = userPlaylists.filter(playlist =>
      playlist.musics.some(music => music.id === musicId)
    );
    
    return {
      isInPlaylists: playlistsWithMusic.length > 0,
      playlistCount: playlistsWithMusic.length,
      playlistNames: playlistsWithMusic.map(p => p.name)
    };
  };

  if (loading) {
    return (
      <div className="album-detail-container">
        <div className="loading">
          <p>🔄 <strong>Carregando músicas do álbum...</strong></p>
          <p><small>Buscando faixas na API TheAudioDB</small></p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="album-detail-container">
        <div className="error-state">
          <h3>Álbum não encontrado</h3>
          <p>O álbum que você está procurando não foi encontrado.</p>
          <button onClick={handleBackToSearch} className="back-btn">
            ← Voltar para Busca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="album-detail-container">
      <header className="album-detail-header">
        <button 
          onClick={handleBackToSearch}
          className="back-btn"
        >
          ← Voltar para Busca
        </button>
        <div className="album-header-info">
          <h1>🎵 {album.name}</h1>
          <p className="album-artist">Por: <strong>{album.artist}</strong></p>
        </div>
      </header>

      <div className="album-details">
        <div className="album-meta">
          <div className="album-info-grid">
            <div className="album-cover">
              {album.thumb ? (
                <img src={album.thumb} alt={album.name} />
              ) : (
                <div className="album-placeholder">
                  <span>🎼</span>
                </div>
              )}
            </div>
            <div className="album-metadata">
              <p><strong>Artista:</strong> {album.artist}</p>
              {album.year && <p><strong>Ano:</strong> {album.year}</p>}
              {album.genre && <p><strong>Gênero:</strong> {album.genre}</p>}
              <p><strong>Total de faixas:</strong> {currentAlbumTracks.length}</p>
            </div>
          </div>
          {album.description && (
            <div className="album-description">
              <h4>Sobre o álbum:</h4>
              <p>{album.description}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <p>❌ Erro ao carregar músicas: {error}</p>
            <button 
              onClick={() => dispatch(getMusicsByAlbum({ albumId: album.id, albumName: album.name }))}
              className="retry-btn"
            >
              🔄 Tentar novamente
            </button>
          </div>
        )}

        {currentAlbumTracks.length === 0 && !loading && !error ? (
          <div className="empty-album">
            <h3>🎼 Nenhuma música encontrada</h3>
            <p>Não foi possível encontrar as faixas deste álbum na API.</p>
          </div>
        ) : (
          <div className="album-tracks">
            <h3>Faixas do álbum:</h3>
            <div className="tracks-list">
              {currentAlbumTracks.map((music, index) => {
                const playlistStatus = getMusicPlaylistStatus(music.id);
                
                return (
                  <div key={music.id} className={`track-item ${playlistStatus.isInPlaylists ? 'in-playlist' : ''}`}>
                    <div className="track-number">
                      {music.trackNumber || (index + 1)}
                    </div>
                    
                    {/* Indicador de playlist */}
                    {playlistStatus.isInPlaylists && (
                      <div className="playlist-indicator">
                        <span className="playlist-icon">✅</span>
                      </div>
                    )}
                    
                    <div className="track-info">
                      <h4>{music.name}</h4>
                      <p className="artist">{music.artist}</p>
                      <div className="track-meta">
                        <span className="genre">{music.genre}</span>
                        {music.year && <span className="year">({music.year})</span>}
                      </div>
                      
                      {/* Lista de playlists onde a música está */}
                      {playlistStatus.isInPlaylists && (
                        <div className="playlists-list">
                          <small>
                            <strong>Em:</strong> {playlistStatus.playlistNames.join(', ')}
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="track-actions">
                      <button 
                        onClick={() => setShowAddToPlaylist(music.id)}
                        className={`add-to-playlist-btn ${playlistStatus.isInPlaylists ? 'already-added' : ''}`}
                        disabled={userPlaylists.length === 0}
                        title={playlistStatus.isInPlaylists 
                          ? `Já está em ${playlistStatus.playlistCount} playlist(s). Clique para adicionar em outra.`
                          : 'Adicionar à playlist'
                        }
                      >
                        {playlistStatus.isInPlaylists ? '+ Outra Playlist' : '+ Playlist'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar à playlist */}
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
                    onClick={() => {
                      const currentMusic = currentAlbumTracks.find(m => m.id === showAddToPlaylist);
                      if (currentMusic) {
                        handleAddToPlaylist(currentMusic, playlist.id);
                      }
                    }}
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

      {/* Feedback de música adicionada */}
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

export default AlbumDetail;