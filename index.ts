import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { mainApp } from "./mainApp";
import { dbConfig } from "./config/dbConfig";
import expressSession from "express-session";
import bodyParser from "body-parser";
import  MongoDBStore  from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import passport from "passport";

dotenv.config();
const mongoConnect =  MongoDBStore(expressSession);

const port:number = parseInt(process.env.PORT!);
const app:Application = express();

app.set("trust proxy", 1);

app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5174");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: false,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  expressSession({
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
      uri: process.env.DATABASE_URL!,
      collection: "session",
    }),
  })
);

passport.serializeUser(function (user, cb) {
  return cb(null, user);
});

passport.deserializeUser(function (user: any, cb) {
  return cb(null, user);
});


app.use((req: any, res: Response, next: NextFunction) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb: any) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb: any) => {
      cb();
    };
  }
  next();
});

passport.initialize();
passport.session();
const server = app.listen(port, () => {
  console.clear();
  console.log();
  dbConfig();
});

app.use(express.json());
app.use(cors());
mainApp(app);


process.on("uncaughtException",(err:Error)=>{
    console.log("uncaughtException",err);
    process.exit(1);
});

process.on("unhandledRejection",(reason:any)=>{
    console.log("unhandledRejection",reason);
    server.close(()=>{
        process.exit(1);
    });
});