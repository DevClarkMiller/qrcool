import { Account } from "@prisma/client";
import jwt from 'jsonwebtoken'; const { sign, verify } = jwt;
import { Response } from "express";
import { genSaltSync } from "bcryptjs";
import loadEnv from "./loadEnv";

loadEnv();

export const SECRET = process.env.JWT_SECRET as string;

/*! Signs a tokens, and commits it to the requesters cookies */
export function signToken(res: Response | null, account: Account): string{
    const token: string = sign({account: account}, SECRET, {expiresIn: "900s"});

    if (res){
        res.cookie("token", token, {
            httpOnly: true,
        });
    }

    return token;
}