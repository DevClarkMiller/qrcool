import express, { Router } from "express";
import cookieJwtAuth from "../middleware/cookieJwtAuth";
import { get, getAnonymous } from "../controllers/content";

const contentRouter: Router = express.Router();

contentRouter
    .get('/anonymous/:contentId', getAnonymous)
    .get('/:entryId', cookieJwtAuth, get);

export default contentRouter;