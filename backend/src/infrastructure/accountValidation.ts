import * as bcrypt from 'bcryptjs'; 
import AccountDao from '../dao/accountDao';
import { Account } from '@prisma/client';
import jwt from 'jsonwebtoken'; const { verify } = jwt;
import { signToken, SECRET } from './token';
import { Response } from 'express';
import { AccountError } from './errors';
import { Mailer, transporter } from './mailing';

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
    
    if (!account)
        throw new AccountError("Account doesn't exist");

    // Resends the activation email if the clients token expires and they need to resend it
    if (!account.IsActive){
        sendActivateEmail(account);
        throw new AccountError("Account hasn't been activated yet, activation email resent");
    }

    // Signs a users token with an account if they sent the correct credentials
    if (await verifyPassword(passsword, account.Password))
        signToken(res, account);
    else
        throw new AccountError("Credentials incorrect");
}

export async function sendActivateEmail(newAcc: Account){
    try{
        const mailer = new Mailer(transporter);

        const token = signToken(null, newAcc);

        mailer.send({
            from: process.env.MAIL_USER as string,
            to: newAcc.Email,
            subject: "Activate Account",
            text: `Please activate your account ${process.env.CLIENT_URL}/activate?token=${token}`,
        });
    }catch(err: any){
        console.error(`Couldn't send activation email ${err.message}`);
        throw new AccountError(err.message);
    }
}

export async function activate(token: string){
    try{
        const decodedToken: jwt.JwtPayload = await verify(token, SECRET) as jwt.JwtPayload;
        const account: Account = decodedToken.account;

        const accDao: AccountDao = new AccountDao();
        await accDao.update({ IsActive: true}, {Id: account.Id});
    }catch(err: any){
        console.error("Couldn't activate account");
        throw new AccountError(`Couldn't activate account, token most likely expired ${err.message}`);
    }
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

        const newAcc: Account = await accDao.getByUsername(username);
        sendActivateEmail(newAcc);
    }catch(err: any){
        console.error(`Error registering account: ${err.message}`);
        throw err;
    }
}