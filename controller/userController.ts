import { Request, Response } from "express";
import { HTTP } from "../utils/enums";


export const createUser = async(req:Request, res:Response)=>{
    try {
        
    } catch (error) {
        return res.status(HTTP.BAD_REQUEST).json({
            message: "error creating user"
        });
    }
};