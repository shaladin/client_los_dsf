import { environment } from "environments/environment"

export class WorkflowApiObj {
    TaskListId : any
    TransactionNo : string
    WFCode : string
    ListValue : {[id:string]:string;}

    constructor(){
        this.TaskListId = environment.isCore ? "" : 0;
        this.TransactionNo = "";
        this.WFCode = "";
        this.ListValue = {};
    }
}