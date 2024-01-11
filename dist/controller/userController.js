"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.getOneUser = exports.getAllUser = exports.createUser = void 0;
const enums_1 = require("../utils/enums");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../model/userModel"));
const email_1 = require("../utils/email");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            name,
            email,
            password: hashedPassword,
            token
        });
        (0, email_1.sendEmail)(user);
        return res.status(enums_1.HTTP.CREATED).json({
            message: 'user successfully created',
            data: user
        });
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD_REQUEST).json({
            message: "error creating user"
        });
    }
});
exports.createUser = createUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res.status(enums_1.HTTP.CREATED).json({
            message: 'users successfully found',
            data: user
        });
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD_REQUEST).json({
            message: "error finding users"
        });
    }
});
exports.getAllUser = getAllUser;
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res.status(enums_1.HTTP.CREATED).json({
            message: 'user successfully found',
            data: user
        });
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD_REQUEST).json({
            message: "error finding user"
        });
    }
});
exports.getOneUser = getOneUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const user = yield userModel_1.default.findOne({ token });
        if (user) {
            yield userModel_1.default.findByIdAndUpdate(user._id, {
                token: "",
                verify: true
            }, {
                new: true
            });
            return res.status(enums_1.HTTP.CREATED).json({
                message: 'user successfully verified',
                data: user
            });
        }
        else {
            return res.status(enums_1.HTTP.BAD_REQUEST).json({
                message: "no user found"
            });
        }
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD_REQUEST).json({
            message: "error finding verifing",
            data: error.message
        });
    }
});
exports.verifyUser = verifyUser;
