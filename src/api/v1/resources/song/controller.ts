import { RequestHandler } from "express";
import { ICreateSong, IUpdateSong } from "./dto";
import { SongDal } from "./dal";
import AppError from "../../../../utils/app_error";

export const createSong: RequestHandler = async (req, res, next) => {
  try {
    const data = <ICreateSong>req.value;
    const song = await SongDal.createSong(data, req.user.id);
    
    res.status(201).json({
      status: "SUCCESS",
      message: "Song created successfully",
      data: { song },
    });
  } catch (error) {
    next(error);
  }
};

export const getSong: RequestHandler = async (req, res, next) => {
  try {
    const song = await SongDal.getSongById(req.params.songId);
    if (!song) return next(new AppError("Song not found", 404));
    
    res.status(200).json({
      status: "SUCCESS",
      data: { song },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSongs: RequestHandler = async (req, res, next) => {
  try {
    const songs = await SongDal.getAllSongs();
    
    res.status(200).json({
      status: "SUCCESS",
      results: songs.length,
      data: { songs },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSong: RequestHandler = async (req, res, next) => {
  try {
    const data = <IUpdateSong>req.value;
    const song = await SongDal.updateSong(req.params.songId, data);
    
    if (!song) return next(new AppError("Song not found", 404));
    
    res.status(200).json({
      status: "SUCCESS",
      message: "Song updated successfully",
      data: { song },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSong: RequestHandler = async (req, res, next) => {
  try {
    const song = await SongDal.deleteSong(req.params.songId);
    
    if (!song) return next(new AppError("Song not found", 404));
    
    res.status(200).json({
      status: "SUCCESS",
      message: "Song deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSongs: RequestHandler = async (req, res, next) => {
  try {
    const songs = await SongDal.getSongsByUser(req.params.userId);
    
    res.status(200).json({
      status: "SUCCESS",
      results: songs.length,
      data: { songs },
    });
  } catch (error) {
    next(error);
  }
};


export const getSongStatistics: RequestHandler = async (req, res, next) => {
  try {
    const stats = await SongDal.getSongStatistics();
    
    res.status(200).json({
      status: "SUCCESS",
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};