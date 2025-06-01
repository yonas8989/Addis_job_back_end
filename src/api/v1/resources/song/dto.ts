export interface ICreateSong {
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number;
  releaseYear?: number;
  fileUrl: string;
  coverImageUrl?: string;
}

export interface IUpdateSong {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: number;
  releaseYear?: number;
  fileUrl?: string;
  coverImageUrl?: string;
}


// src/modules/song/dto.ts
export interface ISongStatistics {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsPerGenre: Array<{
    _id: string;
    count: number;
  }>;
  songsAndAlbumsPerArtist: Array<{
    artist: string;
    songs: number;
    albumsCount: number;
    albums: string[];
  }>;
  songsPerAlbum: Array<{
    artist: string;
    album: string;
    songs: number;
  }>;
}