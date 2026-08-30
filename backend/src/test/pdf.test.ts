import loadEnv from 'src/infrastructure/loadEnv';
import {describe, expect, it} from '@jest/globals';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';

loadEnv();

describe("Create PDF", () =>{
    it("should create a pdf with a header, and a table", () =>{
        const filePath = 'test.pdf';
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(filePath));

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

        expect(fs.existsSync(filePath)).toBe(true);

        setTimeout(() => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }, 100);
    });
});