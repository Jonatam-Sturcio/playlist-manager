import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Music, Album, MusicState } from '../../types';

// Buscar álbuns por artista (novo fluxo)
export const searchAlbumsByArtist = createAsyncThunk(
  'music/searchAlbumsByArtist',
  async (artist: string, { rejectWithValue }) => {
    try {
      console.log(`🔍 FAZENDO NOVA BUSCA DE ÁLBUNS NA API para: ${artist}`);
      
      const albumsResponse = await fetch(
        `https://www.theaudiodb.com/api/v1/json/123/searchalbum.php?s=${encodeURIComponent(artist)}`
      );
      
      if (!albumsResponse.ok) {
        throw new Error(`Erro na API: ${albumsResponse.status}`);
      }
      
      const albumsData = await albumsResponse.json();
      console.log('Resposta da API (álbuns):', albumsData);
      
      if (!albumsData.album || albumsData.album.length === 0) {
        console.log('Nenhum álbum encontrado para o artista:', artist);
        return [];
      }
      
      // Mapear álbuns da API para nossa interface
      const albums: Album[] = albumsData.album.map((album: any) => ({
        id: album.idAlbum,
        name: album.strAlbum,
        artist: album.strArtist || artist,
        year: album.intYearReleased ? parseInt(album.intYearReleased) : undefined,
        genre: album.strGenre,
        thumb: album.strAlbumThumb,
        description: album.strDescriptionEN || album.strDescription,
      }));
      
      console.log(`${albums.length} álbuns encontrados para ${artist}:`);
      albums.forEach((album, index) => {
        console.log(`  ${index + 1}. ${album.name} (${album.year}) - ID: ${album.id}`);
      });
      
      return albums;
      
    } catch (error: any) {
      console.error('Erro na busca de álbuns:', error);
      return rejectWithValue(error.message || 'Erro ao buscar álbuns');
    }
  }
);

// Buscar músicas de um álbum específico
export const getMusicsByAlbum = createAsyncThunk(
  'music/getMusicsByAlbum',
  async ({ albumId, albumName }: { albumId: string; albumName: string }, { rejectWithValue }) => {
    try {
      console.log(`🎵 Buscando músicas do álbum: ${albumName} (ID: ${albumId})`);
      
      const tracksResponse = await fetch(
        `https://www.theaudiodb.com/api/v1/json/123/track.php?m=${albumId}`
      );
      
      if (!tracksResponse.ok) {
        throw new Error(`Erro na API: ${tracksResponse.status}`);
      }
      
      const tracksData = await tracksResponse.json();
      console.log(`Resposta da API para ${albumName}:`, tracksData);
      
      if (!tracksData.track || tracksData.track.length === 0) {
        console.log(`Nenhuma música encontrada no álbum ${albumName}`);
        return [];
      }
      
      // Mapear músicas da API para nossa interface
      const tracks: Music[] = tracksData.track.map((track: any) => ({
        id: track.idTrack,
        name: track.strTrack,
        artist: track.strArtist,
        genre: track.strGenre || 'Unknown',
        year: track.intYearReleased ? parseInt(track.intYearReleased) : undefined,
        album: track.strAlbum || albumName,
        trackNumber: track.intTrackNumber ? parseInt(track.intTrackNumber) : undefined,
        strTrackThumb: track.strTrackThumb,
      }));
      
      console.log(`${tracks.length} músicas encontradas no álbum ${albumName}:`);
      tracks.forEach((track, index) => {
        console.log(`  ${index + 1}. ${track.name} (Faixa ${track.trackNumber})`);
      });
      
      return tracks;
      
    } catch (error: any) {
      console.error(`Erro ao buscar músicas do álbum ${albumName}:`, error);
      return rejectWithValue(error.message || 'Erro ao buscar músicas do álbum');
    }
  }
);


const initialState: MusicState = {
  searchResults: [],
  albumResults: [],
  currentAlbumTracks: [],
  loading: false,
  error: null,
  searchQuery: '',
  searchFilters: {},
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    // Definir query de busca
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  
    // Limpar resultados de busca
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.searchFilters = {};
    },
    
    // Busca local nos resultados (para filtros em tempo real)
    filterSearchResults: (state) => {
      let filtered = state.searchResults;
      
      if (state.searchFilters.genre) {
        filtered = filtered.filter(music => 
          music.genre.toLowerCase().includes(state.searchFilters.genre!.toLowerCase())
        );
      }
      
      if (state.searchFilters.year) {
        filtered = filtered.filter(music => music.year === state.searchFilters.year);
      }
      
      if (state.searchQuery) {
        filtered = filtered.filter(music =>
          music.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          music.artist.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      
      state.searchResults = filtered;
    },
    
    // Estados de loading/error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Busca de álbuns
      .addCase(searchAlbumsByArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAlbumsByArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.albumResults = action.payload;
      })
      .addCase(searchAlbumsByArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar álbuns';
      })
      // Busca de músicas de álbum
      .addCase(getMusicsByAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMusicsByAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAlbumTracks = action.payload;
      })
      .addCase(getMusicsByAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar músicas do álbum';
      });
  },
});

export const {
  setSearchQuery,
  clearSearchResults,
  filterSearchResults,
  setLoading,
  setError,
} = musicSlice.actions;

export default musicSlice.reducer;