import { Request, Response } from "express";
import { Entry, EntryView } from "@prisma/client";
import EntryDao from "../dao/entryDao";
import ExcelViewReporter from "../infrastructure/reporter/excelViewReporter";
import { Mailer, transporter } from "../infrastructure/mailing";

// Custom excetions
import { RequestError, handleErr } from "../infrastructure/errors";
import EntryViewDao from "src/dao/entryViewDao";

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

export async function reportViewsToExcel(req: Request, res: Response){
    try{
        const entryId: number = parseInt(req.params.entryId as string);
        const entDao: EntryDao = new EntryDao();
        const evDao: EntryViewDao = new EntryViewDao();

        const entry: Entry | null = await entDao.getById(entryId);

        if (!entry)
            throw new RequestError(404, "Entry doesn't exist");

        if (entry.AccountId != req.account.Id)
            throw new RequestError(403, "Can't create report for entry that doesn't belong to you");

        const evs: EntryView[] = await evDao.getByEntry(entry.Id);

        const xlViewReporter: ExcelViewReporter = new ExcelViewReporter(evs); 
        const xlReport: any = await xlViewReporter.report();

        // Now email the file
        const mailer = new Mailer(transporter);

        // Don't need to await the email, will send when it sends :)
        mailer.send({
            from: process.env.MAIL_USER as string,
            to: req.account.Email,
            subject: "Report Finished",
            text: "Attatched is the completed report on views",
            attachments: [{
                filename: "report.xlsx",
                content: xlReport,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }]
        });

        res.send("Report created! You will be recieving an email soon with an attatched excel file");
    }catch(err: any){
        handleErr(res, err);
    }
}