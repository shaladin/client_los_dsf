import { environment } from "environments/environment";
export class SubmitNapObj {
    AppId: number;
    WfTaskListId: any;
    AppNo: string;
    BizTemplateCode: string;
    OriOfficeCode: string;
    constructor() {
        this.AppId = 0;
        this.WfTaskListId = environment.isCore ? "" : 0;
        this.AppNo = "";
        this.BizTemplateCode = "";
        this.OriOfficeCode = "";
    }
}