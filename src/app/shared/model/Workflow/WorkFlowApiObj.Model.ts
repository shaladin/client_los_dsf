export class WorkflowApiObj {
    TaskListId : number
    TransactionNo : string
    WFCode : string
    ListValue : {[id:string]:string;}

    constructor(){
        this.TaskListId = 0;
        this.TransactionNo = "";
        this.WFCode = "";
        this.ListValue = {};
    }
}