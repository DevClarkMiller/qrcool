import { Request, Response } from "express";

import { ContentType } from "@prisma/client";
import ContentTypeDao from "../dao/contentTypeDao.js";


export async function all(req: Request, res: Response){
    try{
        const conTypeDao = new ContentTypeDao();
        const contentTypes: ContentType[] = await conTypeDao.getAll();
        res.json(contentTypes);
    }catch(err){
        res.status(404).send("Error: Couldn't get content types");
    }
}