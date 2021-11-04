import { AppCrdInvstgHObj } from "./app-crd-invstg-h-obj.model";

export class RequestAppCrdInvstgObj {
    AppCrdInvstgHObj: AppCrdInvstgHObj;
    AppId: number;
    WfTaskListId: number;
    RowVersion: string;

    constructor() {
        this.AppCrdInvstgHObj = new AppCrdInvstgHObj();
        this.RowVersion = ""; 
    }
}
