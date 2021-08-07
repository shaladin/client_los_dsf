export class ReqReturnHandlingCommRsvFundObj {
    AppId: number;
    ReturnTo: string;
    Reason: string;
    Notes: string;
    WfTaskListId: number;
    constructor() {
        this.AppId = 0;
        this.ReturnTo = "";
        this.Reason = "";
        this.Notes = "";
    }
}