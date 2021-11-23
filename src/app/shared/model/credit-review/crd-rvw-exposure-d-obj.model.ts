export class CrdRvwExposureDObj {

    CrdRvwExposureDId: number;
    CrdRvwExposureHId: number;
    ExposureType: String;
    OsPrincipalAmt: number;
    OsInterestAmt: number;
    OsArBalance: number;
    MaxAr: number;
    MaxInstallmentAmt: number;
    TotalAgrmntOverdue: number;
    MaxOverdueDays: number;
    MaxOverdueAmt: number;
    SpanOfMonth: number;
    ActiveAgrmnt: number;
    AgrmntInProcess: number;
    AgrmntRejected: number;
    AgrmntCancelled: number;
    AgrmntRepossess: number;
    AgrmntPaidOff: number;
    AgrmntWrittenOff: number;
    AgrmntNonAcrual: number;
    AgrmntFpd: number;
    FpdIndicator: string;
    FpdIndicatorDescr: string;
    BounceCheque: number;
    AssetInFinancing: number;
    AssetRepossessed: number;
    AssetInventoried: number;
    OverdueIndicator: string;
    OverdueIndicatorDescr: string;
    
    constructor() {
        this.CrdRvwExposureDId = 0;
        this.OsPrincipalAmt = 0;
        this.OsInterestAmt = 0;
        this.OsArBalance = 0;
        this.MaxAr = 0;
        this.MaxInstallmentAmt = 0;
        this.MaxOverdueDays = 0;
        this.MaxOverdueAmt = 0;
        this.ActiveAgrmnt = 0;
        this.AssetInFinancing = 0;
        this.AgrmntRejected = 0;
        this.AgrmntCancelled = 0;
        this.AgrmntWrittenOff = 0;
        this.AgrmntNonAcrual = 0;
        this.BounceCheque = 0;
        this.AssetRepossessed = 0;
        this.AssetInventoried = 0;
        this.AgrmntFpd = 0;
        this.SpanOfMonth = 0;
        this.AgrmntInProcess = 0;
        this.TotalAgrmntOverdue = 0;
        this.AgrmntRepossess = 0;
        this.AgrmntPaidOff = 0;
    }
}