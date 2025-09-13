import { AppContext } from "src/AppContext";
import Dao  from "./dao";
import { Content } from "@prisma/client";

export default class ContentDao extends Dao<typeof AppContext.DB.content>{
    public constructor(){ super(AppContext.DB.content); }

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