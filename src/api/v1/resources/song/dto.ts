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