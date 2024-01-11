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
exports.mainApp = void 0;
const mainError_1 = require("./error/mainError");
const enums_1 = require("./utils/enums");
const handleError_1 = require("./error/handleError");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
const mainApp = (app) => {
    try {
        app.use("/api", userRouter_1.default);
        app.get("/", (req, res) => {
            try {
                const user = req.user;
                console.log("finally: ", req.user);
                return res.status(200).json({
                    message: "Awesome API",
                    data: user,
                });
            }
            catch (error) {
                return res.status(404).json({
                    message: "Error",
                });
            }
        });
        app.get("/home", (req, res) => {
            try {
                if (req.user) {
                    const user = req.user;
                    console.log("finally: ", req.user);
                    return res.status(200).json({
                        message: "Awesome API",
                        data: user,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "something went wrong",
                    });
                }
            }
            catch (error) {
                return res.status(404).json({
                    message: "Error",
                });
            }
        });
        passport_1.default.use(new GoogleStrategy({
            clientID: "377807975055-ui03iq65puopj600r2k37m0mp37595u3.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "/auth/google/callback",
        }, function (accessToken, refreshToken, profile, cb) {
            return __awaiter(this, void 0, void 0, function* () {
                // const user = await userModel.create({
                //   email: profile?.emails[0]?.value,
                //   password: "",
                //   verify: profile?.emails[0]?.verified,
                //   token: "",
                //   status: "admin",
                //   schoolCode: Math.floor(Math.random() * 112233).toString(),
                // });
                const user = {
                    email: "peter@test.com",
                    name: "Peter",
                };
                console.log(user);
                return cb(null, user);
            });
        }));
        app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
        app.get("/auth/google/callback", passport_1.default.authenticate("google", {
            failureRedirect: "/login",
            successRedirect: "/home",
        }), function (req, res) {
            // Successful authentication, redirect home.
            // res.redirect("/home");
            const user = req.user;
            return res.status(200).json({
                message: "Weelcome",
                data: user,
            });
        });
        app.all("*", (req, res, next) => {
            next(new mainError_1.mainError({
                name: "Route Error",
                message: `This endpoint you entered ${req.originalUrl} doesn't exist`,
                status: enums_1.HTTP.BAD_REQUEST,
                success: false,
            }));
        });
        app.use(handleError_1.handleError);
    }
    catch (error) {
        return error;
    }
    ;
};
exports.mainApp = mainApp;
