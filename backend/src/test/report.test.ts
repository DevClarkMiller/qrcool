import loadEnv from '../infrastructure/loadEnv';
import {describe, expect, test, it} from '@jest/globals';
import ExcelViewReport from '../infrastructure/reporter/excelViewReporter';
import EntryDao from '../dao/entryDao';
import EntryViewDao from '../dao/entryViewDao';
import { Entry, EntryView } from '@prisma/client';

loadEnv();

describe('Create ExcelViewReport', () => {
    // First get an entry
    const entDao = new EntryDao();
    const evDao = new EntryViewDao();
    let entry: Entry;
    let xlViewReport: ExcelViewReport;
    it("should construct", async () =>{
        entry = await entDao.getById(1); // Just get the first entry
        const evs: EntryView[] = await evDao.getByEntry(entry.Id);
        xlViewReport = new ExcelViewReport(evs);
    });
});
