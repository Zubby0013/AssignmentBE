"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mainApp_1 = require("./mainApp");
const dbConfig_1 = require("./config/dbConfig");
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
dotenv_1.default.config();
const mongoConnect = (0, connect_mongodb_session_1.default)(express_session_1.default);
const port = parseInt(process.env.PORT);
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5174");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5174",
    credentials: false,
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    name: "Nzube",
    secret: "cookie/session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // httpOnly: true,
        maxAge: 1000 * 60 * 60 * 12,
        secure: false,
        sameSite: "lax",
    },
    store: new mongoConnect({
        uri: process.env.DATABASE_URL,
        collection: "session",
    }),
}));
passport_1.default.serializeUser(function (user, cb) {
    return cb(null, user);
});
passport_1.default.deserializeUser(function (user, cb) {
    return cb(null, user);
});
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb();
        };
    }
    next();
});
passport_1.default.initialize();
passport_1.default.session();
const server = app.listen(port, () => {
    console.clear();
    console.log();
    (0, dbConfig_1.dbConfig)();
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, mainApp_1.mainApp)(app);
process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("unhandledRejection", reason);
    server.close(() => {
        process.exit(1);
    });
});
