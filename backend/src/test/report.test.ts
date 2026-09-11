import loadEnv from '../infrastructure/loadEnv';
import {describe, expect, test, it, beforeAll} from '@jest/globals';
import { PrismockClient } from 'prismock';
import { PrismaClient } from '@prisma/client';
import ExcelViewReport from '../infrastructure/reporter/excelViewReporter';
import EntryDao from '../dao/entryDao';
import EntryViewDao from '../dao/entryViewDao';
import { Account, Entry, EntryView } from '@prisma/client';
import AccountDao from 'src/dao/accountDao';
import { AppContext } from 'src/AppContext';
import { seed } from './helpers/seeding';

loadEnv();

describe('Create ExcelViewReport', () => {
    let accDao: AccountDao;
    let entDao: EntryDao;
    let evDao: EntryViewDao;
    let account: Account | null;
    let entry: Entry;
    let xlViewReport: ExcelViewReport;

    beforeAll(async () => {
        seed();
        accDao = new AccountDao();
        entDao = new EntryDao();
        evDao = new EntryViewDao();
    });

    it("should construct", async () =>{
        account = await accDao.getByUsername('test_user');
        expect(account).toBeDefined();
        entry = (await entDao.getByAccount(account!.Id))[0]; // Just get the first entry
        const evs: EntryView[] = await evDao.getByEntry(entry.Id) ?? [];
        xlViewReport = new ExcelViewReport(evs);
    });

    it("should report", async ()=>{
        const buffer = await xlViewReport.report();
        expect(buffer).toBeDefined();
    });
});
