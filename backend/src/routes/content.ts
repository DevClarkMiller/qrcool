import express, { Router } from "express";
import cookieJwtAuth from "../middleware/cookieJwtAuth.js";
import { get, getAnonymous } from "../controllers/content.js";

const contentRouter: Router = express.Router();

contentRouter
    .get('/anonymous/:contentId', getAnonymous)
    .get('/:entryId', cookieJwtAuth, get);

export default contentRouter;