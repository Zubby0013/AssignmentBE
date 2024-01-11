import { Request, Response } from "express";
import { HTTP } from "../utils/enums";
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";

export const createUser = async(req:Request, res:Response)=>{
    try {
        const {name, email,password} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const token = crypto.randomBytes(4).toString("hex");

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            token
        });
        return res.status(HTTP.CREATED).json({
            message: 'user successfully created',
            data: user
        })
    } catch (error) {
        return res.status(HTTP.BAD_REQUEST).json({
            message: "error creating user"
        });
    }
};