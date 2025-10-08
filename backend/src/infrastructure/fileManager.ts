import * as Minio from 'minio';
import stream from 'stream';

export default class FileManager{
    private client: Minio.Client;

    constructor(minioClient: Minio.Client | null = null){
        if (!minioClient){ // Construct a new client if one wasn't provided
            this.client = new Minio.Client({
                endPoint: process.env.MINIO_ENDPOINT as string,
                port: 443,
                useSSL:  process.env.MINIO_USE_SSL as string === 'true',
                accessKey: process.env.MINIO_ACCESS_KEY as string,
                secretKey: process.env.MINIO_SECRET_KEY as string
            });
        }else
            this.client = minioClient;
    }

    bufferToStream(buffer: Buffer<ArrayBufferLike>): stream.PassThrough{
        const readableStream = new stream.PassThrough();
        readableStream.end(buffer);
        return readableStream;
    }

    async getObjectSize(bucketName: string, fileName: string): Promise<number> {
        return new Promise<number>(async (resolve, reject) =>{
            let size = 0;
            const dataStream = await this.client.getObject(bucketName, fileName);
    
            dataStream.on('data', function (chunk){
                size += chunk.length;
            });
    
            dataStream.on('end', function(){
                resolve(size);
            });
    
            dataStream.on('error', function(err){
                reject(err);
            });  
        });
    }

    async getBuckets(){
        const buckets = await this.client.listBuckets();
        return buckets;
    }

    async hasBuckets(){
        const buckets = await this.getBuckets();
        return buckets.length > 0;
    }


    async post(bucketName: string, objectName: string, fileStream: stream.PassThrough, fileSize: number){
        this.client.putObject(bucketName, objectName, fileStream, fileSize, function(err: any, objInfo: any){
            if (err)
                throw err; // Throw the error upwards to be handled by the caller
            console.log(objInfo);
        });
    }

    async deleteFolder(bucketName: string, folderName: string){
        const objStream = this.client.listObjects(bucketName, folderName, true);

        let objsToDelete: any[] = []
        for await(const obj of objStream)
            objsToDelete.push(obj);

        if (objsToDelete.length > 0){
            await this.client.removeObjects(bucketName, objsToDelete);
        }
    }

    async delete(bucketName: string, objectName: string){
        await this.client.removeObject(bucketName, objectName);
    }
    
    async deleteMany(bucketName: string, prefix: string){
        return new Promise<void>((resolve) =>{
            const client = this.client;
            const objList: any[] = [];
            const objStream = client.listObjects(bucketName, prefix, true);

            objStream.on('data', function (obj){
                objList.push(obj.name);
            });

            objStream.on('error', function (e) {
                console.error(e)
            });
            
            objStream.on('end', async function(){
                await client.removeObjects(bucketName, objList);
                resolve();
            });
        });
    }

    // Returns a datastream for the object
    async getObject(bucketName: string, objectName: string): Promise<Buffer<ArrayBuffer>>{
        try{
            const dataStream = await this.client.getObject(bucketName, objectName);
            
            return new Promise(async (resolve, reject) =>{
                const chunks: Buffer[] = [];
                
                dataStream.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                dataStream.on('end', function(){
                    resolve(Buffer.concat(chunks));
                });
        
                dataStream.on('error', function(err){
                    reject(err);
                }); 
            });
        }catch(err){
            throw err;
        } 
    }

    async getObjectMime(bucketName: string, objectName: string){
        try{
            const stat = await this.client.statObject(bucketName, objectName);
            return stat.metaData['content-type'];
        }catch(err: any){
            console.error(err);
            throw err;
        }
    }
}