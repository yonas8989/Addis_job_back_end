import { string } from "joi";
import mongoose, { Schema } from "mongoose";


export interface ISessionsDocument extends Document{
    user:string;
    deviceId:string;
    deviceInfo:string;
    expireDate:Date;
    isOwner:boolean;
    createdAt:Date;
    updatedAt:Date;
}
export const sessionsSchema = new Schema(
    {
        user:{
            type: mongoose.Types.ObjectId,
            ref:"User",
            req:[true, "User is Required."],
        },
        deviceId:{
            type: String,
            required:[true, "Device ID is required."],
        },
        deviceInfo:{
            type:String,
            required:[true, "Device info is required."],
        },
        expireDate:{
            type:Date,
            required:[true, "Expire date is required."],
        },
        isOwner:{
            type:Boolean,
            default:false,
        },
    },
    {
        writeConcern: {
          w: "majority",
          j: true,
        },
        timestamps: true,
      }
)
