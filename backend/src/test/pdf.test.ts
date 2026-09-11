import loadEnv from 'src/infrastructure/loadEnv';
import {describe, expect, it} from '@jest/globals';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';

loadEnv();

describe("Create PDF", () =>{
    it("should create a pdf with a header, and a table", async () =>{
        const filePath = 'test.pdf';
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        const table: any = {
            title: "Entry Views",
            headers: ["Country", "Count"],
            rows: [
                ["Canada", 200],
                ["USA", 500]
            ]
        };

        doc.table(table, {});
        doc.end();

        await new Promise<void>((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        expect(fs.existsSync(filePath)).toBeTruthy();

        fs.unlinkSync(filePath);
    });
});