
import { Express } from "express";
import { PrismaClient } from "@prisma/client";

import FileManager from "./infrastructure/fileManager";


import loadEnv from "./infrastructure/loadEnv";

export class AppContext {
    private static _instance: AppContext;

    private _app: Express;
    private _db: PrismaClient;
    private _fileManager: FileManager;

    private  _BUCKET_NAME: string;

    private constructor() {
        this._db = new PrismaClient();
        this._fileManager = new FileManager();
        this._BUCKET_NAME = process.env.MINIO_BUCKET as string;
        
        loadEnv();
    }


    public static StartServer(port: number | string, serverUrl: string): void{
        this.Instance._app.listen(port, () => {
            console.log(`[Server] Up at ${serverUrl}`);
        });
    }

    public static get Instance() : AppContext {
        if (!this._instance) this._instance = new AppContext();
        return this._instance;
    }

    public static get App(): Express { return this.Instance._app; }
    public static set App(val: Express) { this.Instance._app = val; }

    public static get BucketName(): string { return this.Instance._BUCKET_NAME; }

    public static get DB(): PrismaClient { return this.Instance._db; }

    public static get FileManager(): FileManager { return this.Instance._fileManager; }
};