import { AppContext } from "src/AppContext";
import Dao from "./dao";
import EntryContentDao from "./entryContentDao";
import { Account, Entry } from "@prisma/client";

export default class EntryDao extends Dao<typeof AppContext.DB.entry>{
    public constructor(){ super(AppContext.DB.entry); }

    /*Brief: Deletes everything in the entries location on minio
    */
    public async deleteEntryFiles(entry: Entry, account: Account){
        try{
            await AppContext.FileManager.deleteFolder(AppContext.BucketName, `${account.Username}/${entry.Name}/`);
        }catch(err: any){
            console.error(err); // Not sure what the error could be
        }
    }

    public async delete(id: number | null, account?: Account): Promise<any>{
        try{
            if (id === null)
                throw Error("Id not provided");

            const ecDao: EntryContentDao = new EntryContentDao();
            // First delete the entryContent

            await ecDao.deleteByEntry(id);

            if (account){
                const entry: Entry = await this.getById(id);
                await this.deleteEntryFiles(entry, account);
            }

            // Then delete the entry
            await super.delete(id); 
        }catch(err: any){
            console.log("FAILED TO DELETE WITH ID: " + id);
            console.error(err.message);
            throw err;
        }
    }

    public async getByAccountAndName(accountId: number | null, name: string): Promise<any>{
        try{
            if (accountId === null)
                throw Error("AccountId not provided");

            return await this.getOne({AccountId: accountId, Name: name});
        }catch(err: any){
            console.error(`Couldn't get by account and name: ${err.message}`);
            return null;
        }
    }

    public async getByAccount(accountId: number | null): Promise<any>{
        try{
            if (accountId === null)
                throw Error("AccountId not provided");

            return await this.getSome({AccountId: accountId});
        }catch(err: any){
            console.error(`Couldn't get by account: ${err.message}`);
            return null;
        }
    }

    public async add(data: any, accountId?: number): Promise<any>{
        if (!accountId)
            return await super.add(data);

        const entryCount = await this.model.count({where: { AccountId: accountId}});
        if (entryCount >= 5)
            throw new Error("Entry limit reached");

        return await super.add(data);
    }
}