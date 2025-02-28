import Reporter from "./reporter";
import { EntryView } from "@prisma/client";

export default abstract class ViewReporter implements Reporter{
    protected entryViews: EntryView[];
    constructor(entryViews: EntryView[]){
        this.entryViews = entryViews;
    }

    abstract report(): any;
}