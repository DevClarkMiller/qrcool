import { Request, Response } from "express";
import { Content, ContentType, Entry } from "@prisma/client";
import EntryDao from "../dao/entryDao.js";
import ContentDao from "../dao/contentDao.js";
import ContentTypeDao from "../dao/contentTypeDao.js";
import { handleErr, RequestError } from "../infrastructure/errors.js";
import sendFile from "../infrastructure/sendFile.js";

export async function get(req: Request, res: Response){
    try{
        const entryId: number = parseInt(req.params.entryId as string);
        const entDao = new EntryDao();
        const conDao = new ContentDao();

        const entry: Entry = await entDao.getById(entryId);

        if (entry.AccountId !== req.account.Id)
            throw new RequestError(403, "Cannot get content for someon elses account");


        const contents: Content[] = await conDao.getByEntry(entryId);
        res.json(contents);
    }catch(err: any){
        handleErr(res, err);
    }
}

export async function getAnonymous(req: Request, res: Response){
    try{
        const contentId: number = parseInt(req.params.contentId as string);
        const conDao: ContentDao = new ContentDao();
        const contTypeDao: ContentTypeDao = new ContentTypeDao();

        const content: Content = await conDao.getById(contentId);

        if (content === null)
            throw new RequestError(400, 'Content not found');

        // Check if it's a file
        const contentType: ContentType = await contTypeDao.getById(content.ContentTypeId);

        if (contentType.Name === "Text")
            res.send(content.Text);
        else
            await sendFile(res, content); // Sends the file to the requester
    }catch(err: any){
        handleErr(res, err);
    }
}