export class RequestTaskModelObj {
    ProcessKey: string;
    ProcessKeys: Array<string>;
    TaskDefinitionKey: string;
    TransactionNo: string;
    UserName: string;
    RoleCode: string;
    OfficeCode: string;
    IncludeAssignedTasks: boolean;
    OfficeRoleCodes: Array<string>;
 
    constructor() {
        this.ProcessKey = "";
        this.ProcessKeys= new Array<string>();
        this.TaskDefinitionKey = "";
        this.TransactionNo = "";
        this.UserName = "";
        this.RoleCode = "";
        this.OfficeCode = "";
        this.IncludeAssignedTasks= true;
        this.OfficeRoleCodes= new Array<string>();
    }

}