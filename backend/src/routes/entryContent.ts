import express, { Router } from "express";
import cookieJwtAuth from "../middleware/cookieJwtAuth";
import { setActiveContent, allByEntry, remove, post, postFile, getAnonymous } from "../controllers/entryContent";

const entryContentRouter: Router = express.Router();

entryContentRouter
    .put('/:entryContentId', cookieJwtAuth, setActiveContent)
    .get('/:entryId', cookieJwtAuth, allByEntry) // Fetches all entry content for an entry 
    .get('/anonymous/:entryContentId', getAnonymous)
    .delete('/:entryContentId', cookieJwtAuth, remove)
    .post('/file/:entryId/:contentTypeId/:name', cookieJwtAuth, postFile)
    .post('/:entryId', cookieJwtAuth, post);

export default entryContentRouter;