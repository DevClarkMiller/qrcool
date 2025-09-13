import { Request, Response } from "express";
import EntryViewDao from "../dao/entryViewDao";
import EntryDao from "src/dao/entryDao";
import { Entry } from "@prisma/client";
import { handleErr, RequestError } from "../infrastructure/errors";


export async function count(req: Request, res: Response){
    try{
        const entryId: number = parseInt(req.params.entryId as string);

        const evDao = new EntryViewDao();
        const entDao = new EntryDao();
        const entry: Entry = await entDao.getById(entryId);
    
        if (!entry)
            throw new RequestError(404, "Entry not found");

        const count: number = await evDao.count(entryId);
        res.json(count);
    }catch(err: any){
        handleErr(res, err);
    }
}