import { AppCrdInvstgDObj } from "./AppCrdInvstgDObj.Model";

export class AppCrdInvstgHObj {
    AppCrdInvstgHId: number;
    AppId: number;
    CrdRiskEmpNo: string;
    SubmitDt: Date;
    CrdInvstgStat: string;
    ReturnNotes: string;
    AppCrdInvstgDObjs: Array<AppCrdInvstgDObj>;
    RowVersion: string;

    constructor() {
        this.AppCrdInvstgDObjs = new Array<AppCrdInvstgDObj>();
        this.RowVersion = ""; 
    }
}
