import { AppContext } from "./AppContext";

import express, { Express, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import quotes from './quotes';

import fileUpload from 'express-fileupload';

// ROUTES
import accountRouter from "./routes/account";
import mainRouter from "./routes/mainRoute";
import contentTypeRouter from "./routes/contentType";
import entryRouter from "./routes/entry";
import entryContentRouter from "./routes/entryContent";
import contentRouter from "./routes/content";
import entryViewRouter from "./routes/entryView";

const port =  process.env.PORT || 5000;
AppContext.App = express();
const app = AppContext.App;

const corsConfig = {
    origin: process.env.CLIENT_URL as string,
    credentials: true
};

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    limits: {
        fileSize: parseInt(process.env.UPLOAD_LIMIT as string)
    },
    abortOnLimit: true // Will cancel the upload if it's too big
}));

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

AppContext.StartServer(port, process.env.SERVER_URL);