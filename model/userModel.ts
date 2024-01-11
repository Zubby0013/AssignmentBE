import { Schema, model } from "mongoose";
import { iUserData } from "../utils/interface";


const userModel = new Schema<iUserData>(
    {
        name:{
            type: String
        },
        email:{
            type: String
        },
        password:{
            type: String
        },
        token:{
            type: String
        },
        verify:{
            type: Boolean
        }
    },
    {timestamps: true}
);

export default model<iUserData>("users",userModel);