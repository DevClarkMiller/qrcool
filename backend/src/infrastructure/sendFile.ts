import { AppContext } from "src/AppContext";
import { Response } from "express";
import { Content } from "@prisma/client";

export default async function sendFile(res: Response, content: Content, contentType: string = "", contentDisposition = true){
    if (!contentType)
        contentType = await AppContext.FileManager.getObjectMime(AppContext.BucketName, content.Path as string);
    if (contentDisposition)
        res.setHeader('Content-Disposition', `attachment; filename="${content.Text}"`); // Is the filename
    res.setHeader('Content-Type', contentType); // Adjust the MIME type as needed
    const fileBuffer: Buffer<ArrayBuffer> = await AppContext.FileManager.getObject(AppContext.BucketName, content.Path as string);
    res.send(fileBuffer);
}