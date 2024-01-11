import { Request, Response } from "express";
import { HTTP } from "../utils/enums";
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import { sendEmail } from "../utils/email";

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
        sendEmail(user);
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

export const getAllUser = async(req:Request, res:Response)=>{
    try {

        const user = await userModel.find();
        return res.status(HTTP.CREATED).json({
            message: 'users successfully found',
            data: user
        })
    } catch (error) {
        return res.status(HTTP.BAD_REQUEST).json({
            message: "error finding users"
        });
    }
};

export const getOneUser = async(req:Request, res:Response)=>{
    try {
        const {userID} = req.params;

        const user = await userModel.findById(userID);
        return res.status(HTTP.CREATED).json({
            message: 'user successfully found',
            data: user
        })
    } catch (error) {
        return res.status(HTTP.BAD_REQUEST).json({
            message: "error finding user"
        });
    }
};

export const verifyUser = async(req:Request, res:Response)=>{
    try {
        const {token} = req.body;

        const user = await userModel.findOne({token});
        if (user) {
            await userModel.findByIdAndUpdate(
                user._id,
                {
                    token: "",
                    verify: true
                },
                {
                    new: true
                }
            )
            return res.status(HTTP.CREATED).json({
                message: 'user successfully verified',
                data: user
            })
        } else {
            return res.status(HTTP.BAD_REQUEST).json({
                message: "no user found"
            });
        }
    } catch (error:any) {
        return res.status(HTTP.BAD_REQUEST).json({
            message: "error finding verifing",
            data: error.message
        });
    }
};