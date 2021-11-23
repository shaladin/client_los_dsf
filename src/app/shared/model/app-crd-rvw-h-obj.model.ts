import { AppCrdRvwDObj } from "./app-crd-rvw-d-obj.model";

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