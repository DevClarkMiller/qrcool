import express, { Router } from "express";
import { count } from "../controllers/entryView.js";

const entryViewRouter: Router = express.Router();

entryViewRouter
    .get('/:entryId', count)

export default entryViewRouter;