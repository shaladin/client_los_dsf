export class AppFctrObj {
    AppFctrId: number;
    AppId: number;
    MouFctrId: number;
    MrInstTypeCode: string;
    MrSingleInstCalcMthdCode: string;
    IsDisclosed: boolean;
    TopDays: number;
    PaidBy: string;
    IsCoverPdc: boolean;
    RecourseType: string;
    RetentionPrcnt: number;
    IsCustListed: boolean;
    TopBased: string;
    TotalInvcAmt: number;
    TotalRetentionAmt: number;
    TotalDisbAmt: number;
    InvcDt: Date;
    EstEffDt: Date;
    RefundInterestAmt: number;
    RowVersion: string;

    constructor() {
        this.AppFctrId = 0;
        this.AppId = 0;
        this.MouFctrId = 0;
        this.MrInstTypeCode = "";
        this.MrSingleInstCalcMthdCode = "";
        this.IsDisclosed = false;
        this.TopDays = 0;
        this.PaidBy = "";
        this.IsCoverPdc = false;
        this.RecourseType = "";
        this.RetentionPrcnt = 0;
        this.IsCustListed = false;
        this.TopBased = "";
        this.TotalInvcAmt = 0;
        this.TotalRetentionAmt = 0;
        this.TotalDisbAmt = 0;
        this.InvcDt = new Date();
        this.EstEffDt = new Date();
        this.RefundInterestAmt = 0;
        this.RowVersion = "";
    }
}