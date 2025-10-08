import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist, 
  setCurrentPlaylist,
  reloadPlaylists
} from '../../store/slices/playlistSlice';
import { updateLastPlaylistAccessed } from '../../store/slices/userSlice';
import type { Playlist } from '../../types';
import './Playlists.css';

const Playlists: React.FC = () => {
  const { currentUser } = useAppSelector(state => state.user);
  const { playlists, loading } = useAppSelector(state => state.playlists);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState('');

  // Recarregar playlists quando o usuário mudar
  useEffect(() => {
    if (currentUser) {
      dispatch(reloadPlaylists());
    }
  }, [currentUser, dispatch]);

  // Filtrar playlists do usuário atual
  const userPlaylists = playlists.filter(p => p.userId === currentUser?.id);

  const handleCreatePlaylist = () => {
    if (playlistName.trim() && currentUser) {
      dispatch(createPlaylist({ 
        name: playlistName.trim(), 
        userId: currentUser.id 
      }));
      setPlaylistName('');
      setIsCreating(false);
    }
  };

  const handleUpdatePlaylist = (id: string) => {
    if (playlistName.trim()) {
      dispatch(updatePlaylist({ id, name: playlistName.trim() }));
      setEditingId(null);
      setPlaylistName('');
    }
  };

  const handleDeletePlaylist = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta playlist?')) {
      dispatch(deletePlaylist(id));
    }
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    dispatch(setCurrentPlaylist(playlist.id));
    dispatch(updateLastPlaylistAccessed(playlist.id));
    // Navegar para a rota específica da playlist
    navigate(`/playlists/${playlist.id}`);
  };

  const startEditing = (playlist: Playlist) => {
    setEditingId(playlist.id);
    setPlaylistName(playlist.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setPlaylistName('');
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="playlists-container">
        <div className="loading">Carregando playlists...</div>
      </div>
    );
  }

  return (
    <div className="playlists-container">
      <header className="playlists-header">
        <h1>Minhas Playlists</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="create-btn"
          disabled={isCreating}
        >
          + Nova Playlist
        </button>
      </header>

      {/* Formulário de criação */}
      {isCreating && (
        <div className="playlist-form">
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Nome da playlist"
            className="playlist-input"
            autoFocus
          />
          <div className="form-actions">
            <button onClick={handleCreatePlaylist} className="save-btn">
              Salvar
            </button>
            <button onClick={cancelEditing} className="cancel-btn">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="playlists-grid">
        {userPlaylists.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhuma playlist encontrada</h3>
            <p>Crie sua primeira playlist para começar!</p>
          </div>
        ) : (
          userPlaylists.map(playlist => (
            <div key={playlist.id} className="playlist-card">
              {editingId === playlist.id ? (
                // Modo de edição
                <div className="playlist-form">
                  <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="playlist-input"
                    autoFocus
                  />
                  <div className="form-actions">
                    <button 
                      onClick={() => handleUpdatePlaylist(playlist.id)} 
                      className="save-btn"
                    >
                      Salvar
                    </button>
                    <button onClick={cancelEditing} className="cancel-btn">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo de visualização
                <>
                  <div 
                    className="playlist-info"
                    onClick={() => handleSelectPlaylist(playlist)}
                  >
                    <h3>{playlist.name}</h3>
                    <p>{playlist.musics.length} música(s)</p>
                    <span className="created-date">
                      Criada em: {new Date(playlist.createdAt).toLocaleDateString()}
                    </span>
                    <p className="view-hint">🔍 Clique para visualizar músicas</p>
                  </div>
                  
                  <div className="playlist-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(playlist);
                      }}
                      className="edit-btn"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlaylist(playlist.id);
                      }}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Informações do usuário */}
      <div className="user-stats">
        <p>Total de playlists: {userPlaylists.length}</p>
        <p>Total de músicas: {userPlaylists.reduce((total, p) => total + p.musics.length, 0)}</p>
      </div>
    </div>
  );
};

export default Playlists;