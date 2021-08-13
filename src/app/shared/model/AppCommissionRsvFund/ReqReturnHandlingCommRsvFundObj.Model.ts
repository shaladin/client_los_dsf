import { environment } from "environments/environment";

export class ReqReturnHandlingCommRsvFundObj {
    AppId: number;
    ReturnTo: string;
    Reason: string;
    Notes: string;
    WfTaskListId: any;
    constructor() {
        this.AppId = 0;
        this.ReturnTo = "";
        this.Reason = "";
        this.Notes = "";
        this.WfTaskListId = environment.isCore? "" : 0;
    }
}