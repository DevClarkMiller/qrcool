import Dao from "./dao";
import { db } from "src";
import { Location } from "src/types";
import currentDate from "src/infrastructure/currentDate";

export default class EntryViewDao extends Dao{
    public constructor(){ super(db.entryView); }

    public async add(entryId: number, contentId?: number, location?: Location): Promise<any>{
        try{
            let data: any;

            data = {
                EntryId: entryId,
            };

            if(location){
                data["Longitude"] = location.Longitude;
                data["Latitude"] = location.Latitude;
            }

            if (contentId)
                data["ContentId"] = contentId;

            return await db.entryView.create({data: data});
        }catch(err: any){
            console.error(err.message);
            throw err;
        }
    }

    /*Brief: Returns the number of views for an entry
    */
    public async count(entryId: number): Promise<any>{
        try{
            return await db.entryView.count({
                where: { EntryId: entryId }
            });
        }catch(err: any){
            console.error(err.message);
            throw err;
        }
    }
}