import { Response } from "express";

export class RequestError extends Error{
    public status: number

    constructor(status: number, msg: string){
        super("Error: " + msg);
        this.status = status;
    }
}

export class AccountError extends Error{
    constructor(msg: string){
        super(msg);
    }
}

export function handleErr(res: Response, err: RequestError | Error){
    if (err instanceof RequestError)
        res.status(err.status).send(err.message);
    else if(err instanceof AccountError)
        res.status(400).send("Error: " + err.message);
    else
        res.status(500).send("Error: " + err.message);
}