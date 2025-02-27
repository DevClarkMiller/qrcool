import Dao  from "./dao.js";
import { db } from "../index.js";
import { Content } from "@prisma/client";

export default class ContentDao extends Dao{
    public constructor(){ super(db.content); }

    public async getByEntry(entryId: number | null){
        try{
            return await this.getSome({ EntryContent: 
                { some: { EntryId: entryId }}
            });
        }catch(err: any){
            console.error(`Couldn't get content by entry ${err.msg}`);
            return [];
        }
    }

    public isFile(content: Content){
        return (content.ContentTypeId >= 2 && content.ContentTypeId <= 5) 
            || content.ContentTypeId == 7;
    }
}