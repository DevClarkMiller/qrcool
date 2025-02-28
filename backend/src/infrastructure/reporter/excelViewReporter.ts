import xl from 'excel4node';
import ViewReporter from "./viewReporter";

export default class ExcelViewReporter extends ViewReporter{
    report(): any{
        console.log(this.entryViews);
        // const wb: any = new xl.Workbook(); 
        // const ws = wb.addWorksheet("View Report");
    }
}