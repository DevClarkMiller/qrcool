import { Request, Response } from "express";
import { Account } from "@prisma/client";
import { login, register, activate, sendActivateEmail } from '../infrastructure/accountValidation';
import AccountDao from "../dao/accountDao";
import { AccountError, handleErr, RequestError } from '../infrastructure/errors';

export async function accountLogin(req: Request, res: Response){
    try{
        const accVm: any = req.body; // Catches any account form
        await login(res, accVm?.Email, accVm?.Username, accVm?.Password);

        if (accVm?.Username && accVm?.Password)
            res.send(`Logged in successfully as ${accVm.Username}`);
        else if (accVm?.Email)
            res.send(`Logged in successfully as ${accVm.Email}`);
        else
            res.send(`Logged in successfully as ${accVm.Username}`);

    }catch(err: any | AccountError){
        if (err instanceof AccountError)
            res.status(400).send(err.message);
        else
           res.status(404).send('Error: Some fields may be entered incorrectly');
    }
}

export async function accountActivate(req: Request, res: Response){
    try{
        const token: string = req.params.token as string;
        await activate(token);
        res.send("Account activated!");
    }catch(err: any | RequestError | AccountError){
        handleErr(res, err);
    }
}

export async function create(req: Request, res: Response){
    try{
        const accVm: any = await req.body; // Catches any account form
        await register(accVm?.Email, accVm?.Username, accVm?.Password);

        res.send(`Account with the username ${accVm.Username} has been created, please check email inbox`);
    }catch(err){
        handleErr(res, err);
    }
}

export async function auth(req: Request, res: Response){
    let account: Account = req.account;

    if (!account){
        res.status(403).send("Account isn't authorized");
        return;
    }

    res.json({
        Id: account.Id,
        Email: account.Email,
        Username: account.Username
    });
}

export async function count(req: Request, res: Response){
    const accDao: AccountDao = new AccountDao();
    const accountCount: number = await accDao.count();
    res.send(accountCount.toString());
}

export async function resetPassword(req: Request, res: Response){
    try{
        const newPassword: string = req.params.newPassword as string;
        const accDao: AccountDao = new AccountDao();
        await accDao.resetPassword(req.account, newPassword);
        res.send("Successfully changed password");
    }catch(err: any | RequestError){
        handleErr(res, err, "Unknown error while changing password");
    }    
}