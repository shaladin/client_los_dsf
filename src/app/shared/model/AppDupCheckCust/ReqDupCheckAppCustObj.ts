import { ReqDupCheckAppNegativeCustObj } from "./ReqDupCheckAppNegativeCustObj.Model";

export class ReqDupCheckAppCustObj {   

    AppCustId: number;
    CustNo: string;
    ApplicantNo: string;
    ListAppNegativeCustObj: Array<ReqDupCheckAppNegativeCustObj>;
    RowVersion: any;

    constructor() { 
        this.AppCustId = 0;
        this.CustNo = "";
        this.ApplicantNo = ""
        this.ListAppNegativeCustObj = [];
        this.RowVersion = "";
    }
}
