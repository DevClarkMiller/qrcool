import * as bcrypt from 'bcryptjs'; 
import AccountDao from '../dao/accountDao';
import { Account } from '@prisma/client';
import { signToken } from './token';
import { Response } from 'express';
import { AccountError } from './errors';

function throwIfExists(account: Account | null, field: string){
    if (account)
        throw new AccountError(`Account with that ${field} already exists`);
}

async function verifyPassword (pass: string, hashedPass: string): Promise<boolean>{
    try{
        const match = await bcrypt.compare(pass, hashedPass);
        return match;
    }catch(err){
        return false;
    }
}

export async function login(res: Response, email: string | null, username: string | null, passsword: string | null){
    if (passsword === null || passsword === "")
        throw Error("Password not provided");

    const accDao = new AccountDao();
    let account: Account | null;


    if (email && username)
        account = await accDao.getByEmail(email);

    else if (email)
        account = await accDao.getByEmail(email);

    else (username)
        account = await accDao.getByUsername(username);

    // Signs a users token with an account if they sent the correct credentials
    if (account !== null && await verifyPassword(passsword, account.Password))
        signToken(res, account);
    else
        throw new AccountError("Account doesn't exist");
}

export async function register(email: string | null, username: string | null, password: string | null){
    try{
        if(!email || !username || !password)
            throw Error("One or more crucial fields weren't provided");
    
        let account: Account | null;
        const accDao = new AccountDao();
    
        // First make sure the account doesn't already exist
        account = await accDao.getByEmail(email);
        throwIfExists(account, "email");
    
        account = await accDao.getByUsername(username);
        throwIfExists(account, 'username');
    
        const hashedPass = await bcrypt.hash(password, 5);
    
        // Finally adds the account if everything went okay!
        await accDao.add({
            Username: username,
            Email: email,
            Password: hashedPass
        });
    }catch(err: any){
        console.error(`Error registering account: ${err.message}`);
        throw err;
    }
}