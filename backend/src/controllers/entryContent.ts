import { Request, Response } from "express";
import EntryContentDao from "../dao/entryContentDao.js";
import { Content, Entry, EntryContent, ContentType } from "@prisma/client";
import EntryDao from "../dao/entryDao.js";
import ContentDao from "src/dao/contentDao.js";
import ContentTypeDao from "src/dao/contentTypeDao.js";
import { handleErr, RequestError } from "../infrastructure/errors.js";
import sendFile from "src/infrastructure/sendFile.js";

import { Location } from "src/types.js";

import { FileArray, UploadedFile } from "express-fileupload";
import EntryViewDao from "src/dao/entryViewDao.js";

export async function setActiveContent(req: Request, res: Response){
    try{
        const entryContentId: number = parseInt(req.params.entryContentId as string);

        const entDao = new EntryDao();
        const ecDao = new EntryContentDao();

        const entryContent: EntryContent | null = await ecDao.getById(entryContentId);
 
        if (!entryContent)
            throw new RequestError(403, "Entry content not found");

        const entry: Entry = await entDao.getById(entryContent.EntryId);

        if (entry.AccountId !== req.account.Id)
            throw new RequestError(403, "Can't set active content for entry on someone else's account");

        // Find entry tied to entryContent, verify that it's owned by this user
        await ecDao.setActive(entryContent);
        res.send("Successfully set active content for entry");
    }catch(err: any){
        handleErr(res, err);
    }
}

export async function allByEntry(req: Request, res: Response){
    try{
        const entryId: number = parseInt(req.params.entryId as string);

        const entDao = new EntryDao();
        const ecDao = new EntryContentDao();

        const entry: Entry = await entDao.getById(entryId);

 
        if (!entry)
            throw new RequestError(404, "Entry not found");

        if (entry.AccountId !== req.account.Id)
            throw new RequestError(403, "Can't get entry content someone else's account");

        // Now fetch the entry content
        const entryContents: any[] = await ecDao.getByEntryWithContent(entryId);
        res.json(entryContents);
    }catch(err: any){
        handleErr(res, err);
    }
}

export async function remove(req: Request, res: Response){
    try{
        const entryContentId: number = parseInt(req.params.entryContentId as string);
        const entDao = new EntryDao();
        const ecDao = new EntryContentDao();

        const entryContent: EntryContent = await ecDao.getById(entryContentId);

        if (!entryContent)
            throw new RequestError(404, "Entry content not found");

        const entry: Entry = await entDao.getById(entryContent.EntryId);

        if (entry.AccountId !== req.account.Id)
            throw new RequestError(403, "Not your entry to delete");

        await ecDao.deleteWithContent(entryContent);
        res.send("Successfully deleted entry content");
    }catch(err: any){
        handleErr(res, err);
    }
}

export async function post(req: Request, res: Response){
    try{
        const entryId: number = parseInt(req.params.entryId as string);
        let content: Content = req.body;

        if (!content || !entryId)
            throw new RequestError(400, "Didn't provide content or entry id");

        const entDao = new EntryDao();
        const ecDao = new EntryContentDao();

        const entry: Entry = await entDao.getById(entryId);
        if (!entry)
            throw new RequestError(404, "Entry not found, can't create entry content");

        if (entry.AccountId !== req.account.Id)
            throw new RequestError(403, "Cannot upload entry content to someone else's account");

        await ecDao.addWithContent(entryId, content, req.account.Id);
        
        // Check if the count is greater than 1 for entry content, if not then set the newly added ec as active
        const ecs: EntryContent[] = await ecDao.getByEntry(entryId);
        if (ecs.length === 1)
            await ecDao.setActive(ecs[0])

        res.send("Successfully created entry content");
    }catch(err: any){
        handleErr(res, err);
    }
}

export async function postFile(req: Request, res: Response){
    try{
        const files: FileArray | null | undefined = req.files;
        const entryId: number = parseInt(req.params.entryId as string);
        const contentTypeId: number = parseInt(req.params.contentTypeId as string);
        const name: string | null = req.params.name;

        if (!files)
            throw new RequestError(400, "No file given");

        if (!contentTypeId)
            throw new RequestError(400, "No ContentTypeId given");

        /*! Get the first file uploaded, ignore the rest*/
        const fileNames = Object.keys(files);

        if (fileNames.length === 0)
            throw new RequestError(400, "No file given");

        const entDao = new EntryDao();
        const ecDao = new EntryContentDao();

        const entry: Entry = await entDao.getById(entryId); 
        if (!entry){
            res.status(404).send("Error: Entry not found, can't create entry content");
            return;
        }

        // Here is the result of the above work, we can use the buffer to upload to minio
        const file: UploadedFile = files[fileNames[0]] as UploadedFile;
        await ecDao.addFileUpload(entry, name, file, req.account, contentTypeId);

        const ecs: EntryContent[] = await ecDao.getByEntry(entryId);
        if (ecs.length === 1)
            await ecDao.setActive(ecs[0])

        res.send("Successfully uploaded file");
    }catch(err: any | RequestError){
        handleErr(res, err);
    }
}

/*Brief: Fetches an entries content
*/
export async function getAnonymous(req: Request, res: Response){
    try{
        const entryContentId: number = parseInt(req.params.entryContentId as string);
        let location: Location | null;
        
        if (req.query.Longitude && req.query.Latitude){
            location = {
                Longitude: parseFloat(req.query.Longitude as string),
                Latitude: parseFloat(req.query.Latitude as string)
            };
        }

        const evDao: EntryViewDao = new EntryViewDao();
        const ecDao: EntryContentDao = new EntryContentDao();
        const conDao: ContentDao = new ContentDao();
        const contTypeDao: ContentTypeDao = new ContentTypeDao();

        const entryContent: EntryContent = await ecDao.getById(entryContentId);

        const content: Content = await conDao.getById(entryContent.ContentId);

        if (content === null)
            throw new RequestError(400, 'Content not found');

        // Check if it's a file
        const contentType: ContentType = await contTypeDao.getById(content.ContentTypeId);

        await evDao.add(entryContent.EntryId, entryContent.ContentId, location);

        if (contentType.Name === "Text")
            res.send(content.Text);
        else
            await sendFile(res, content); // Sends the file to the requester
    }catch(err: any){
        handleErr(res, err);
    }
}