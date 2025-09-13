import loadEnv from 'src/infrastructure/loadEnv';
import {describe} from '@jest/globals';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';

loadEnv();

describe("Create PDF", () =>{
    let doc = new PDFDocument();
    it("should create a pdf with a header, and a table", () =>{
        doc.pipe(fs.createWriteStream('test.pdf'));

        // doc.fontSize(27)
        // .text("Document Title", 100, 100);

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
    });
});