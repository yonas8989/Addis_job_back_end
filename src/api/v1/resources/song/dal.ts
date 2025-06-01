import { SongModel } from "./model";
import { ISongDocument } from "./schema";
import { ICreateSong, IUpdateSong } from "./dto";

export class SongDal {
  static async createSong(data: ICreateSong, userId: string): Promise<ISongDocument> {
    const song = await SongModel.create({ ...data, createdBy: userId });
    return song;
  }

  static async getSongById(id: string): Promise<ISongDocument | null> {
    return SongModel.findById(id).populate("createdBy", "firstName lastName email");
  }

  static async getAllSongs(): Promise<ISongDocument[]> {
    return SongModel.find().populate("createdBy", "firstName lastName email");
  }

  static async updateSong(
    id: string,
    data: IUpdateSong
  ): Promise<ISongDocument | null> {
    return SongModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async deleteSong(id: string): Promise<ISongDocument | null> {
    return SongModel.findByIdAndDelete(id);
  }

  static async getSongsByUser(userId: string): Promise<ISongDocument[]> {
    return SongModel.find({ createdBy: userId }).populate(
      "createdBy",
      "firstName lastName email"
    );
  }
  static async getSongStatistics(): Promise<any> {
    const stats = await SongModel.aggregate([
      {
        $facet: {
          totalSongs: [{ $count: "count" }],
          totalArtists: [{ $group: { _id: "$artist" } }, { $count: "count" }],
          totalAlbums: [{ $group: { _id: "$album" } }, { $count: "count" }],
          totalGenres: [{ $group: { _id: "$genre" } }, { $count: "count" }],
          songsPerGenre: [
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          songsAndAlbumsPerArtist: [
            { 
              $group: { 
                _id: "$artist", 
                songs: { $sum: 1 },
                albums: { $addToSet: "$album" }
              } 
            },
            { 
              $project: { 
                artist: "$_id",
                songs: 1,
                albumsCount: { $size: "$albums" },
                albums: 1,
                _id: 0
              } 
            },
            { $sort: { songs: -1 } },
          ],
          songsPerAlbum: [
            { $match: { album: { $ne: null } } },
            { 
              $group: { 
                _id: { artist: "$artist", album: "$album" }, 
                count: { $sum: 1 } 
              } 
            },
            { 
              $project: { 
                artist: "$_id.artist",
                album: "$_id.album",
                songs: "$count",
                _id: 0
              } 
            },
            { $sort: { artist: 1, songs: -1 } },
          ],
        },
      },
      {
        $project: {
          totalSongs: { $arrayElemAt: ["$totalSongs.count", 0] },
          totalArtists: { $arrayElemAt: ["$totalArtists.count", 0] },
          totalAlbums: { $arrayElemAt: ["$totalAlbums.count", 0] },
          totalGenres: { $arrayElemAt: ["$totalGenres.count", 0] },
          songsPerGenre: 1,
          songsAndAlbumsPerArtist: 1,
          songsPerAlbum: 1,
        },
      },
    ]);

    return stats[0];
  }
}




