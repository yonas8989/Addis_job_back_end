import { songSchema, ISongDocument } from "./schema";
import { model } from "mongoose";

export const SongModel = model<ISongDocument>("Song", songSchema);