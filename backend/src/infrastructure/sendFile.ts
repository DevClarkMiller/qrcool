import { Response } from "express";
import { fileManager, BUCKET_NAME } from "../index";
import { Content } from "@prisma/client";

export default async function sendFile(res: Response, content: Content, contentType: string = "", contentDisposition = true){
    if (!contentType)
        contentType = await fileManager.getObjectMime(BUCKET_NAME, content.Path as string);
    if (contentDisposition)
        res.setHeader('Content-Disposition', `attachment; filename="${content.Text}"`); // Is the filename
    res.setHeader('Content-Type', contentType); // Adjust the MIME type as needed
    const fileBuffer: Buffer<ArrayBuffer> = await fileManager.getObject(BUCKET_NAME, content.Path as string);
    res.send(fileBuffer);
}