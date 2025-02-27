import express, { Router } from "express";
import cookieJwtAuth from "../middleware/cookieJwtAuth.js";
import { setActiveContent, allByEntry, remove, post, postFile } from "../controllers/entryContent.js";

const entryContentRouter: Router = express.Router();

entryContentRouter
    .put('/:entryContentId', cookieJwtAuth, setActiveContent)
    .get('/:entryId', cookieJwtAuth, allByEntry) // Fetches all entry content for an entry 
    .delete('/:entryContentId', cookieJwtAuth, remove)
    .post('/file/:entryId/:contentTypeId/:name', cookieJwtAuth, postFile)
    .post('/:entryId', cookieJwtAuth, post);

export default entryContentRouter;