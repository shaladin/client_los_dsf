import { AppCrdInvstgDObj } from "./app-crd-invstg-d-obj.model";

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
