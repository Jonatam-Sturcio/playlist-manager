import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Playlist, PlaylistState, Music } from '../../types';

// Função para carregar playlists do localStorage
const loadPlaylistsFromStorage = (): Playlist[] => {
  try {
    const stored = localStorage.getItem('playlist-manager-playlists');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Função para salvar playlists no localStorage
const savePlaylistsToStorage = (playlists: Playlist[]) => {
  try {
    localStorage.setItem('playlist-manager-playlists', JSON.stringify(playlists));
  } catch (error) {
    console.error('Erro ao salvar playlists:', error);
  }
};

const initialState: PlaylistState = {
  playlists: loadPlaylistsFromStorage(),
  currentPlaylist: null,
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    // Criar nova playlist
    createPlaylist: (state, action: PayloadAction<{ name: string; userId: string }>) => {
      const newPlaylist: Playlist = {
        id: `playlist_${Date.now()}`,
        name: action.payload.name,
        userId: action.payload.userId,
        musics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.playlists.push(newPlaylist);
      savePlaylistsToStorage(state.playlists);
    },
    
    // Atualizar playlist existente
    updatePlaylist: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.id);
      if (playlist) {
        playlist.name = action.payload.name;
        playlist.updatedAt = new Date().toISOString();
        savePlaylistsToStorage(state.playlists);
      }
    },
    
    // Excluir playlist
    deletePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
      if (state.currentPlaylist?.id === action.payload) {
        state.currentPlaylist = null;
      }
      savePlaylistsToStorage(state.playlists);
    },
    
    // Adicionar música à playlist
    addMusicToPlaylist: (state, action: PayloadAction<{ playlistId: string; music: Music }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist) {
        // Verificar se a música já existe na playlist
        const musicExists = playlist.musics.some(m => m.id === action.payload.music.id);
        if (!musicExists) {
          playlist.musics.push(action.payload.music);
          playlist.updatedAt = new Date().toISOString();
          savePlaylistsToStorage(state.playlists);
        }
      }
    },
    
    // Remover música da playlist
    removeMusicFromPlaylist: (state, action: PayloadAction<{ playlistId: string; musicId: string }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist) {
        playlist.musics = playlist.musics.filter(m => m.id !== action.payload.musicId);
        playlist.updatedAt = new Date().toISOString();
        savePlaylistsToStorage(state.playlists);
      }
    },
    
    // Definir playlist atual
    setCurrentPlaylist: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.currentPlaylist = state.playlists.find(p => p.id === action.payload) || null;
      } else {
        state.currentPlaylist = null;
      }
    },
    
    // Obter playlists do usuário
    getUserPlaylists: (state, action: PayloadAction<string>) => {
      // Filtrar apenas as playlists do usuário atual
      const userPlaylists = state.playlists.filter(p => p.userId === action.payload);
      state.playlists = state.playlists; // manter todas, mas pode ser usado para UI
    },
    
    // Estados de loading/error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Recarregar do localStorage
    reloadPlaylists: (state) => {
      state.playlists = loadPlaylistsFromStorage();
    },

    // Limpar dados ao fazer logout
    clearPlaylistData: (state) => {
      state.currentPlaylist = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
  setCurrentPlaylist,
  getUserPlaylists,
  setLoading,
  setError,
  reloadPlaylists,
  clearPlaylistData,
} = playlistSlice.actions;

export default playlistSlice.reducer;