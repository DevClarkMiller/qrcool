import express, { Router } from "express";
import cookieJwtAuth from "../middleware/cookieJwtAuth";
import { add, all, remove, reportViewsToExcel } from "../controllers/entry";

const entryRouter: Router = express.Router();

entryRouter
    .get('/reportViewsToExcel/:entryId', cookieJwtAuth, reportViewsToExcel)
    .get('/', cookieJwtAuth, all)
    .post('/:name', cookieJwtAuth, add)
    .delete('/:entryId', cookieJwtAuth, remove)

export default entryRouter;
    
    