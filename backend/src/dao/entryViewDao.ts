import Dao from "./dao";
import { db } from "src";
import { EntryView } from "@prisma/client";
import currentDate from "src/infrastructure/currentDate";

type Location = {
    Longitude: number;
    Latitude: number;
};

export default class EntryViewDao extends Dao{
    public constructor(){ super(db.entryView); }

    public async add(entryId: number, location?: Location): Promise<any>{
        try{
            const timeStamp: string = currentDate();
            let data: any;

            data = {
                EntryId: entryId,
                TimeStamp: timeStamp
            };

            if(location){
                data["Longitude"] = location.Longitude;
                data["Latitude"] = location.Latitude;
            }

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