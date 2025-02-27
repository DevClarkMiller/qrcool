import Dao from "./dao";
import { db } from "src";
import { EntryView } from "@prisma/client";

export default class EntryViewDao extends Dao{
    public constructor(){ super(db.entryView); }

    // Adds a location-less record
    public async addWithoutLocation(timestamp: Date | null, entryId: number): Promise<any>{
        try{
            if (!timestamp)
                throw new Error("No timestamp provided");

            return await db.entryView.create({data: {
                EntryId: entryId,
                Timestamp: timestamp    
            }});
        }catch(err: any){
            console.error(err.message);
            throw err;
        }
    }
}