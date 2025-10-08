import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import playlistReducer from './slices/playlistSlice';
import musicReducer from './slices/musicSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    playlists: playlistReducer,
    music: musicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;