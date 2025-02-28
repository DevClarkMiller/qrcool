import express, { Express, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from "@prisma/client";
import quotes from './quotes';

import loadEnv from "./infrastructure/loadEnv";
loadEnv();

// Routes
import accountRouter from "./routes/account";
import mainRouter from "./routes/mainRoute";
import contentTypeRouter from "./routes/contentType";
import entryRouter from "./routes/entry";
import entryContentRouter from "./routes/entryContent";
import contentRouter from "./routes/content";
import entryViewRouter from "./routes/entryView";

import FileManager from "./infrastructure/fileManager";
import fileUpload from 'express-fileupload';

export const db = new PrismaClient();
export const fileManager = new FileManager();
export const BUCKET_NAME: string = process.env.MINIO_BUCKET as string;

const corsConfig = {
    origin: process.env.CLIENT_URL as string,
    credentials: true
};

export const app: Express = express();
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    limits: {
        fileSize: parseInt(process.env.UPLOAD_LIMIT as string)
    },
    abortOnLimit: true // Will cancel the upload if it's too big
}));

// Routes

/*!Sends a random quote */
app.use('/api/quote', function(req: Request, res: Response){
    res.send(quotes[Math.floor(Math.random()*quotes.length)]);
});

app.use('/api/account', accountRouter);
app.use('/api/contentType', contentTypeRouter);
app.use('/api/entry', entryRouter)
app.use('/api/entryContent', entryContentRouter);
app.use('/api/content', contentRouter)
app.use('/api/entryView', entryViewRouter);
app.use('/', mainRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`[Server] Up at ${process.env.SERVER_URL}`);
});