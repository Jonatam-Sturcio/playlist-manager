export interface User {
  id: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Music {
  id: string;
  name: string;
  artist: string;
  genre: string;
  year?: number;
  album?: string; // Novo: nome do álbum
  trackNumber?: number; // Novo: posição no álbum
  strTrackThumb?: string; // thumbnail da API TheAudioDB
  albumThumb?: string; // Novo: thumbnail do álbum
  strTrack?: string; // nome original da API
  strArtist?: string; // artista original da API
  strGenre?: string; // gênero original da API
  intYearReleased?: string; // ano original da API
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  year?: number;
  genre?: string;
  thumb?: string;
  description?: string;
  tracks?: Music[]; // Músicas carregadas do álbum
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  musics: Music[];
  createdAt: string;
  updatedAt: string;
}

export interface RootState {
  user: UserState;
  playlists: PlaylistState;
  music: MusicState;
}

export interface UserState {
  currentUser: User | null;
  sessionData: {
    lastLogin?: string;
    lastPlaylistAccessed?: string;
  };
}

export interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  loading: boolean;
  error: string | null;
}

export interface MusicState {
  searchResults: Music[];
  albumResults: Album[]; // Novo: resultados de álbuns
  currentAlbumTracks: Music[]; // Novo: músicas do álbum selecionado
  loading: boolean;
  error: string | null;
  searchQuery: string;
  searchFilters: {
    genre?: string;
    artist?: string;
    year?: number;
  };
}
