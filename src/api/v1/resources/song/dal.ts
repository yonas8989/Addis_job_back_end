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
}