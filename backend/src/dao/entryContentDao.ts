import Dao  from "./dao";
import { BUCKET_NAME, db } from "../index";
import { EntryContent, Content, Account, Entry } from "@prisma/client";
import ContentDao from "./contentDao";
import { UploadedFile } from "express-fileupload";
import { fileManager } from "../index";
import stream from 'stream';

export default class EntryContentDao extends Dao{
    public constructor(){ super(db.entryContent); }

    public async deleteByEntry(entryId: number | null) : Promise<any>{
        try{
            if (entryId === null)
                throw Error("EntryId not provided");

            // Get the list of contentIDS from each of the entry content
            const contentIdObjs: any[] = await this.getSome({
                EntryId: entryId
            }, { ContentId: true });

            // Parse the array into a list of numbers instead of key values
            const contentIds: number[] = contentIdObjs.map(contIdObj => contIdObj.ContentId);

            const conDao = new ContentDao();

            // Deletes all content that was in the list of ids
            if (contentIds.length > 0)
                await conDao.deleteMany({Id: {in: contentIds}});
            // await this.deleteMany({ EntryId: entryId });
            await conDao.deleteMany({Id: {in: contentIds}});
            await this.deleteMany({ EntryId: entryId });
        }catch(err: any){
            console.error(`Couldn't delete entry content by entry: ${err.message}`);
        }
    }

    public async deleteWithContent(entryContent: EntryContent | null): Promise<any>{
        try{
            if (entryContent === null)
                throw Error("EntryContent not provided");
            
            const conDao: ContentDao = new ContentDao();

            // Check if it's a file type
            const content: Content | null = await conDao.getById(entryContent.ContentId);

            // Delete if it's a file from minio
            if (content != null && conDao.isFile(content))
                await fileManager.delete(BUCKET_NAME, content.Path as string);

            // Check if the entryContent is the active content, if so set the first content to be active
            let ecToSetActive: EntryContent | null = await this.getOne({IsActive: false});
            if (ecToSetActive)
                await this.setActive(ecToSetActive);
            await conDao.delete(entryContent.ContentId); 
        }catch(err: any){
            console.error(err);
            console.error("Couldn't delete entryContent");
        }
    }

    public async setActive(entryContent: EntryContent | null) : Promise<any>{
        try{
            if (entryContent === null)
                throw Error("EntryContent not provided");

            // Sets all other entry content in entry to not active
            await this.updateMany({IsActive: false }, { EntryId: entryContent.EntryId});
            
            return await this.update({IsActive: true}, {Id: entryContent.Id});
        }catch(err: any){
            console.error(`Couldn't set as active entryContent: ${err.message}`);
            return null;
        }
    }

    public async getByEntry(entryId: number | null): Promise<any>{
        try{
            if (entryId === null)
                throw Error("EntryId not provided");

            return await this.getSome({EntryId: entryId});

        }catch(err: any){
            console.error(`Couldn't get by entry: ${err.message}`);
            return [];
        }
    }

    public async getByEntryWithContent(entryId: number | null): Promise<any>{
        try{
            if (entryId === null)
                throw Error("EntryId not provided");

            return await this.getSome({EntryId: entryId}, {
                Id: true, 
                EntryId: true,
                ContentId: true,
                IsActive: true,
                Content: {
                    select: {
                        Id: true,
                        Name: true,
                        Text: true,
                        Path: true,
                        ContentTypeId: true
                    }
                }
            });

        }catch(err: any){
            console.error(`Couldn't get by entry: ${err.message}`);
            return [];
        }
    }

    public async getActiveByEntry(entryId: number | null): Promise<any>{
        try{
            if (entryId === null)
                throw Error("EntryId not provided");

            return await this.getOne({EntryId: entryId, IsActive: true});

        }catch(err: any){
            console.error(`Couldn't get by entry: ${err.message}`);
            return null;
        }
    }

    public async getByEntryAndContent(entryId: number | null, contentId: number | any): Promise<any>{
        try{
            if (entryId === null || contentId === null)
                throw Error("EntryId or contentId not provided");

            return await this.getOne({EntryId: entryId, ContentId: contentId});

        }catch(err: any){
            console.error(`Couldn't get by entry and content: ${err.message}`);
            return null;
        }
    }

    public async addFileUpload(entry: Entry, name: string | null, file: UploadedFile, account: Account, contentTypeId: number | null){
        try{
            // Create a fileStream from the buffer
            const fileStream: stream.PassThrough = fileManager.bufferToStream(file.data);

            const ecCount = await db.entryContent.count({where: { EntryId: entry.Id }});
                    
            if (ecCount >= parseInt(process.env.ENTRY_CONTENT_LIMIT as string))
                throw new Error("EntryContent limit reach for Entry");

            if (entry === null)
                throw Error("Entry not provided");

            if (contentTypeId === null)
                throw Error("ContentTypeId not provided");

            if (!name) name = file.name.split('.')[0];

            const contDao = new ContentDao();

            const path = `${account.Username}/${entry.Name}/${file.name}`;

            // First upload the file to minio, any errors will cause it to not commit to the db
            await fileManager.post(BUCKET_NAME, path, fileStream, file.size);

            const newContent: Content = await contDao.add({Name: name, Text: file.name, Path: path, ContentTypeId: contentTypeId});
            if (!newContent)
                throw new Error("Content couldn't be created");

            const entryContent =  await this.add({EntryId: entry.Id, ContentId: newContent.Id, IsActive: false });
            if (!entryContent){
                contDao.delete(newContent.Id);
                throw new Error("Entry content couldn't be created");
            }

            return entryContent;
        }catch(err: any){
            console.error(`Couldn't add entrycontent with content: ${err.message}`);
            throw err;
        }
    }

    public async addWithContent(entryId: number | null, content: any | null, accountId: number): Promise<any>{
        try{
            if (entryId === null || !content)
                throw Error("EntryId not provided");

            const contDao = new ContentDao();

            const ecCount = await db.entryContent.count({where: { EntryId: entryId }});
                    
            if (ecCount >= parseInt(process.env.ENTRY_CONTENT_LIMIT as string))
                throw new Error("EntryContent limit reach for Entry");

            // First add the content
            const newContent: Content = await contDao.add({Name: content?.Name, Text: content?.Text, Path: content?.Path, ContentTypeId: content?.ContentTypeId});
            if (!newContent)
                throw new Error("Content couldn't be created");

            const entryContent =  await this.add({EntryId: entryId, ContentId: newContent.Id, IsActive: false});
            if (!entryContent){
                contDao.delete(newContent.Id);
                throw new Error("Entry content couldn't be created");
            }

            return entryContent;
        }catch(err: any){
            console.error(`Couldn't add entrycontent with content: ${err.message}`);
            throw err;
        }
    }
}