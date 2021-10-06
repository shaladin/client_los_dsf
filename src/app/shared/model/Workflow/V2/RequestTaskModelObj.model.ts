export class RequestTaskModelObj {
    ProcessKey: string;
    ProcessKeys: Array<string>;
    TaskDefinitionKey: string;
    TaskDefinitionKeys: Array<string>;
    TransactionNo: string;
    TransactionNumbers: Array<string>;
    UserName: string;
    Finished: boolean;
    Unfinished: boolean;
    RoleCode: string;
    OfficeCode: string;
    IncludeAssignedTasks: boolean;
    OfficeRoleCodes: Array<string>;
 
    constructor() {
        this.ProcessKey = "";
        this.ProcessKeys= new Array<string>();
        this.TaskDefinitionKey = "";
        this.TaskDefinitionKeys= new Array<string>();
        this.TransactionNo = "";
        this.TransactionNumbers= new Array<string>();
        this.UserName = "";
        this.RoleCode = "";
        this.OfficeCode = "";
        this.IncludeAssignedTasks= true;
        this.OfficeRoleCodes = new Array<string>();
        this.Unfinished = true;
        this.Finished = true;
    }

}