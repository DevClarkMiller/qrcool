import express, { Router } from "express";
import { all } from "../controllers/contentType.js";

const contentTypeRouter: Router = express.Router();


contentTypeRouter.get('/', all);

export default contentTypeRouter;