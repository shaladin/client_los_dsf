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

export class WorkflowApiV2Obj{
    TaskListId : string;
    TransactionNo : string;
    WFCode : string;
    ListValue : {[id:string]:string;}

    constructor(){
        this.TaskListId = "";
        this.TransactionNo = "";
        this.WFCode = "";
        this.ListValue = {};
    }
}