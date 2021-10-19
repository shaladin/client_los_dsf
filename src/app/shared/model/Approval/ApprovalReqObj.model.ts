export class ApprovalReqObj {
    Username: string;
    CategoryCode: string;
    RoleCode: string;
    constructor() {
        this.Username = "";
        this.CategoryCode = "";
        this.RoleCode = "";
    }
}

export class ApvClaimTaskObj {
    TaskId : number
    Username: string

    constructor(){
        this.TaskId = -999
        this.Username = "";
    }
}