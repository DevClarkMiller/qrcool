import { Request, Response } from "express";
import { Account } from "@prisma/client";
import { login, register } from '../infrastructure/accountValidation.js';
import AccountDao from "../dao/accountDao.js";
import { handleErr } from '../infrastructure/errors.js';

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

    }catch(err){
        res.status(404).send('Error: Some fields may be entered incorrectly');
    }
}

export async function create(req: Request, res: Response){
    try{
        const accVm: any = await req.body; // Catches any account form
        await register(accVm?.Email, accVm?.Username, accVm?.Password);

        res.send(`Account with the username ${accVm.Username} has been created`);
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