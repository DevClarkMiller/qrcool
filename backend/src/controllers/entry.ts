import { Request, Response } from "express";
import { Account, Entry } from "@prisma/client";
import EntryDao from "../dao/entryDao.js";
import EntryContentDao from "../dao/entryContentDao.js";

// Custom excetions
import { RequestError, handleErr } from "../infrastructure/errors.js";

export async function add(req: Request, res: Response){
    try{
        const entDao = new EntryDao();
        const name: string | null = req.params.name as string;

        if (!name)
            throw new RequestError(400, "Name field is missing");
        
        await entDao.add({Name: name, AccountId: req.account.Id}, req.account.Id);
        res.send("Successfully added entry");
    }catch(err: any | RequestError){
        handleErr(res, err);
    }
}

export async function remove(req: Request, res: Response){
    try{
        const entryId: number = parseInt(req.params.entryId as string);
        const entDao = new EntryDao();

        const entry: Entry = await entDao.getById(entryId);
        if (entry.AccountId !== req.account.Id)
            throw new RequestError(403, "Not your entry to delete");

        await entDao.delete(entry.Id, req.account);

        res.send("Successfully deleted entry");
    }catch(err: any){
        handleErr(res, err);
    }
}

export async function all(req: Request, res: Response){
    try{
        const entDao = new EntryDao();
        const entries: Entry[] = await entDao.getByAccount(req.account.Id);
        res.json(entries);
    }catch(err){
        res.status(404).send("Error: Couldn't get entries for account");
    }
}