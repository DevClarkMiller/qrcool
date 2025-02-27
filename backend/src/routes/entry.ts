import express, { Router } from "express";
import cookieJwtAuth from "../middleware/cookieJwtAuth.js";
import { add, all, remove } from "../controllers/entry.js";

const entryRouter: Router = express.Router();

entryRouter
    .post('/:name', cookieJwtAuth, add)
    .get('/', cookieJwtAuth, all)
    .delete('/:entryId', cookieJwtAuth, remove)

export default entryRouter;
    
    