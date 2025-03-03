import xl from 'excel4node';
import ViewReporter from "./viewReporter";

export default class ExcelViewReporter extends ViewReporter{

    /* Fn: report()
    *  Brief: Creates an excel workbook from views
    *  Rtns: The buffer of the excel workbook
    */
    async report(): Promise<any>{
        const wb: any = new xl.Workbook(); 
        const sh = wb.addWorksheet("Views Report");

        const START_ROW: number = 2; // Start row

        // Write column headers
        sh.cell(1, 1).string('ContentId');
        sh.cell(1, 2).string('Timestamp');
        sh.cell(1, 3).string('Latitude');
        sh.cell(1, 4).string('Longitude');

        
        // Iterates over each entryview, appends that to the sheet
        for (let i = 0; i < this.entryViews.length; i++){
            const contentId: number = this.entryViews[i].ContentId;
            const timestamp: Date = this.entryViews[i].Timestamp;
            const lat: string = this.entryViews[i].Latitude ? this.entryViews[i].Latitude.toString() : 'NA';
            const long: string = this.entryViews[i].Longitude ? this.entryViews[i].Longitude.toString() : 'NA';

            sh.cell(START_ROW + i, 1).number(contentId);
            sh.cell(START_ROW + i, 2).date(timestamp);
            sh.cell(START_ROW + i, 3).string(lat);
            sh.cell(START_ROW + i, 4).string(long);
        }

        return await wb.writeToBuffer();
    }
}