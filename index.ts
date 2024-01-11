import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { mainApp } from "./mainApp";
import { dbConfig } from "./config/dbConfig";

dotenv.config();

const port:number = parseInt(process.env.PORT!);
const app:Application = express();

app.use(express.json());
app.use(cors());
mainApp(app);

const server = app.listen(port,()=>{
    console.clear();
    console.log("");
    dbConfig();
});

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