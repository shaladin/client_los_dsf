import { ReqDupCheckAppNegativeCustObj } from "./ReqDupCheckAppNegativeCustObj.Model";

export class ReqDupCheckAppCustObj {   

    AppCustId: number;
    CustNo: string;
    ApplicantNo: string;
    SourceAppCustId: number;
    ListAppNegativeCustObj: Array<ReqDupCheckAppNegativeCustObj>;
    RowVersion: string;

    constructor() { 
        this.AppCustId = 0;
        this.CustNo = "";
        this.ApplicantNo = "";
        this.SourceAppCustId = 0;
        this.ListAppNegativeCustObj = [];
        this.RowVersion = "";
    }
}
