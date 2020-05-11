import { AppCrdInvstgHObj } from "./AppCrdInvstgHObj.Model";

export class RequestAppCrdInvstgObj {
    AppCrdInvstgHObj: AppCrdInvstgHObj;
    AppId: number;
    WfTaskListId: number;
    RowVersion: any;

    constructor() {
        this.AppCrdInvstgHObj = new AppCrdInvstgHObj();
        this.RowVersion = ""; 
    }
}
