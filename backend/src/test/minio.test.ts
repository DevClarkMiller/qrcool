import fs from 'fs';
import loadEnv from 'src/infrastructure/loadEnv';
import {describe, expect, test} from '@jest/globals';
import * as Minio from 'minio';

loadEnv();
import FileManager from 'src/infrastructure/fileManager';

const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY as string;
const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY as string;
const MINIO_ENDPOINT: string = process.env.MINIO_ENDPOINT as string;

const minClient = new Minio.Client({
    endPoint: MINIO_ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY
});

const fileManager = new FileManager(minClient);

describe("Has Buckets", () =>{
    it("should return true meaning there are buckets", async () =>{
        const hasBuckets = fileManager.hasBuckets();
        expect(hasBuckets).toBeTruthy();
    });
});

describe("Get Buckets", () =>{
    it("Should have at least one bucket", async ()=>{
        const buckets = await fileManager.getBuckets();
        console.log(buckets);
        expect(buckets.length).toBeGreaterThan(0);
    });
});

describe('Create FileManager', function(){
    it("Should construct successfully", function(){
        const fileManager: FileManager = new FileManager();
        expect(fileManager).toBeDefined();
    });
});