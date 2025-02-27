import { Router, Response, Request } from 'express';
import { Account, Content, ContentType, Entry, EntryContent } from '@prisma/client';

import EntryDao from '../dao/entryDao.js';
import EntryContentDao from '../dao/entryContentDao.js';
import EntryViewDao from 'src/dao/entryViewDao.js';
import AccountDao from "../dao/accountDao.js";
import ContentDao from "../dao/contentDao.js";
import ContentTypeDao from "../dao/contentTypeDao.js";
import sendFile from '../infrastructure/sendFile.js';

const mainRouter: Router = Router();

async function returnByContentType(res: Response, entryContent: EntryContent, content: Content, entryId: number): Promise<any>{
    const conTypeDao = new ContentTypeDao();
    const contentType: ContentType = await conTypeDao.getById(content.ContentTypeId);
    const evDao = new EntryViewDao();

    // Adds a view if it's loading a file and doesn't have the chance to go through the front-end
    if (contentType.Name in ["Redirect", "File", "HTML"]){
        evDao.add(entryId);
    } 

    switch(contentType.Name){
        case "Redirect": 
            res.redirect(content.Text);
            break;
        case "File":
            await sendFile(res, content);
            break;
        case "HTML":
            await sendFile(res, content, "text/html", false); // Sends the file as html
            break;
        default: 
            // Don't even worry about fetching the content, if it's a file
            // The site will do so and display it for the user
            res.redirect(`${process.env.CLIENT_URL}/anonymous/${contentType.Name}/${entryContent.Id}`);
            break;
    }
}

// The main route of the webapp
mainRouter.get('/:username/:entryName', async (req: Request, res: Response) =>{
    try{
        const username: string | null = req.params.username;
        const entryName: string | null = req.params.entryName;

        const accDao = new AccountDao();
        const entDao = new EntryDao();
        const ecDao = new EntryContentDao();
        const contDao = new ContentDao();

        const account: Account | null = await accDao.getByUsername(username);

        if (account === null){
            res.status(404).send("Error: Account not found");
            return;
        }

        const entry: Entry = await entDao.getByAccountAndName(account.Id, entryName);

        if (entry === null){
            res.status(404).send("Error: Entry not found");
            return;
        }

        const entryContent: EntryContent = await ecDao.getActiveByEntry(entry.Id);

        if (entryContent === null){
            res.status(404).send("Error: Entry content not found");
            return;
        }

        const content: Content = await contDao.getById(entryContent.ContentId);
        await returnByContentType(res, entryContent, content, entry.Id);
    }catch(err: any){
        console.error(err.message);
        res.status(404).send(`Couldn't get resource: ${err.message}`);
    }
}); 

export default mainRouter;