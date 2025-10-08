import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserState } from '../../types';

// Função para carregar dados do sessionStorage
const loadSessionData = () => {
  try {
    const sessionData = sessionStorage.getItem('playlist-manager-session');
    return sessionData ? JSON.parse(sessionData) : {};
  } catch {
    return {};
  }
};

// Função para carregar usuário do sessionStorage
const loadUserFromSession = (): User | null => {
  try {
    const userData = sessionStorage.getItem('playlist-manager-user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// Função para salvar dados no sessionStorage
const saveSessionData = (data: any) => {
  try {
    sessionStorage.setItem('playlist-manager-session', JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados da sessão:', error);
  }
};

// Função para salvar usuário no sessionStorage
const saveUserToSession = (user: User | null) => {
  try {
    if (user) {
      sessionStorage.setItem('playlist-manager-user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('playlist-manager-user');
    }
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error);
  }
};

const initialState: UserState = {
  currentUser: loadUserFromSession(),
  sessionData: loadSessionData(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      // Gerar ID baseado no email para consistência entre logins
      const userId = `user_${action.payload.email.replace(/[^a-zA-Z0-9]/g, '_')}`;

      const user: User = {
        id: userId,
        email: action.payload.email,
        isLoggedIn: true,
      };

      state.currentUser = user;
      state.sessionData.lastLogin = new Date().toISOString();

      // Salvar no sessionStorage
      saveSessionData(state.sessionData);
      saveUserToSession(user);
    },

    logout: (state) => {
      state.currentUser = null;
      state.sessionData = {};

      // Limpar sessionStorage
      sessionStorage.removeItem('playlist-manager-session');
      sessionStorage.removeItem('playlist-manager-user');

      localStorage.removeItem('lastArtistQuery');
      localStorage.removeItem('lastAlbumResults');
    },

    updateLastPlaylistAccessed: (state, action: PayloadAction<string>) => {
      state.sessionData.lastPlaylistAccessed = action.payload;
      saveSessionData(state.sessionData);
    },

    restoreSession: (state) => {
      state.sessionData = loadSessionData();
      state.currentUser = loadUserFromSession();
    },
  },
});

export const { login, logout, updateLastPlaylistAccessed, restoreSession } = userSlice.actions;
export default userSlice.reducer;