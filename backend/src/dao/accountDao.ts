import Dao  from "./dao";
import { db } from "../index";
import { Account } from "@prisma/client";

export default class AccountDao extends Dao{
    public constructor(){ super(db.account); }

    public async getByUsername(username: string | null): Promise<Account | null>{
        try{
            return await this.getOne({Username: username});
        }catch(err: any){
            console.error(`Couldn't get by username: ${err.message}`);
            return null;
        }
    }

    public async getByEmail(email: string | null): Promise<Account | null>{
        try{
            return await this.getOne({Email: email});
        }catch(err: any){
            console.error(`Couldn't get by username: ${err.message}`);
            return null;
        }
    }
    
    public async count(): Promise<number>{
        try{
            return await db.account.count();
        }catch(err: any){
            console.error(`Couldn't get count: ${err.message}`);
            return 0;
        }
    }
}