import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'; const { verify, sign } = jwt;
import { Account } from "@prisma/client";
import { SECRET } from "../infrastructure/token";

export default async function cookieJwtAuth(req: Request, res: Response, next: NextFunction){
    const token: string = req.cookies?.token;

    try{
        if(!token) throw new Error("Token not found");
        const decodedToken: jwt.JwtPayload = await verify(token, SECRET) as jwt.JwtPayload;

        const account: Account = decodedToken.account;

        const nowUNIX: number = Math.floor(new Date().getTime() / 1000);    //Get current time in unix format
        const timeLeft: number = decodedToken.exp as number - nowUNIX;
        

        if(timeLeft <= 300){ //If users token has less than 5 minutes left, sign a new one
            const newToken = sign({account: account}, SECRET, {expiresIn: process.env.JWT_EXPIRATION as any});
            
            // Puts a token into the request header if a token was recieved in the query
            res.cookie("token", newToken, {
                httpOnly: true, //Prevents browser javascript from seeing the cookies
            });
        }
        
        req.account = account;
        next();
    }catch(err: any){
        res.clearCookie("token");
        res.status(403).send("User token expired or doesn't exist");
    }
}