import { Document } from "mongoose"
import { HTTP } from "./enums"

export interface iError{
    name: string
    message: string
    status: HTTP
    success: boolean
};

export interface iUser{
    name: string
    email: string
    password: string
    token: string
    verify: boolean
};

export interface iUserData extends iUser, Document{};