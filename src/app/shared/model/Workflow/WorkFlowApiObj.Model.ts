export class WorkflowApiObj {
    TaskListId : any
    TransactionNo : string
    WFCode : string
    ListValue : {[id:string]:string;}

    constructor(){
        this.TransactionNo = "";
        this.WFCode = "";
        this.ListValue = {};
    }
}