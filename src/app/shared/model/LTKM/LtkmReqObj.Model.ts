export class LtkmReqObj {
    LtkmReqId: number;
    CustNo: string;
    AppId: number;
    LtkmNo: string;
    OfficeCode: string;
    OfficeName: string;
    EmpNo: string;
    EmpName: string;
    ApvDt: Date
    ApprovalStat: string;
    LtkmStep: string;
    Notes: string;
    RowVersion: string;;
    constructor() {
        this.LtkmReqId = 0;
        this.CustNo = "";
        this.AppId = 0;
        this.LtkmNo = "";
        this.OfficeCode = "";
        this.OfficeName = "";
        this.EmpNo = "";
        this.EmpName = "";
        this.ApvDt = new Date();
        this.ApprovalStat = "";
        this.LtkmStep = "";
        this.Notes = "";
        this.RowVersion = "";
    }
}

