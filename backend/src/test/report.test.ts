import loadEnv from '../infrastructure/loadEnv';
import {describe, expect, test, it} from '@jest/globals';
import ExcelViewReport from '../infrastructure/reporter/excelViewReporter';
import EntryDao from '../dao/entryDao';
import EntryViewDao from '../dao/entryViewDao';
import { Account, Entry, EntryView } from '@prisma/client';
import AccountDao from 'src/dao/accountDao';

loadEnv();

describe('Create ExcelViewReport', () => {
    // First get an entry
    const accDao = new AccountDao();
    const entDao = new EntryDao();
    const evDao = new EntryViewDao();
    let account: Account;
    let entry: Entry;
    let xlViewReport: ExcelViewReport;
    it("should construct", async () =>{
        account = await accDao.getByUsername('Mbfrk');
        entry = (await entDao.getByAccount(account.Id))[0]; // Just get the first entry
        const evs: EntryView[] = await evDao.getByEntry(entry.Id);
        xlViewReport = new ExcelViewReport(evs);
    });

    it("should report", async ()=>{
        const buffer = await xlViewReport.report();
        expect(buffer).toBeDefined();
    });
});
