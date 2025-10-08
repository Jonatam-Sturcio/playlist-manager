import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store';
import { useAppDispatch } from './hooks/redux';
import { restoreSession } from './store/slices/userSlice';

// Components and Pages
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Playlists from './pages/Playlists/Playlists';
import PlaylistDetail from './pages/PlaylistDetail/PlaylistDetail';
import AlbumDetail from './pages/AlbumDetail/AlbumDetail';
import MusicPage from './pages/Music/Music';

// Componente interno que usa o Redux
function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restaurar sessão ao carregar a aplicação
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        
        <Route path="/playlists" element={
          <PrivateRoute>
            <Playlists />
          </PrivateRoute>
        } />
        
        <Route path="/playlists/:id" element={
          <PrivateRoute>
            <PlaylistDetail />
          </PrivateRoute>
        } />
        
        <Route path="/musicas" element={
          <PrivateRoute>
            <MusicPage />
          </PrivateRoute>
        } />
        
        <Route path="/albums/:id" element={
          <PrivateRoute>
            <AlbumDetail />
          </PrivateRoute>
        } />
        
        {/* Redirect padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
