import { AppCrdRvwDObj } from "./AppCrdRvwDObj.Model";

export class AppCrdRvwHObj{
    AppCrdRvwHId: number;
    AppId: number;
    CrdAnalystEmpNo: string;
    SubmitDt: Date;
    CrdRvwStat: string;
    ReturnNotes: string;
    appCrdRvwDObjs: Array<AppCrdRvwDObj>;
    RowVersion: string;

    constructor(){
        this.RowVersion = "";
    }
}