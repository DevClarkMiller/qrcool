// Report Behaviors
export default interface Reporter{
    // May return anything, could be a memory stream, or a string, or anything really
    report(): any;
}