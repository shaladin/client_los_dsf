export class CrdRvwExposureObj{
    
    CrdRvwExposureId: number;
    CrdRvwCustInfoId: number;
    CustName: string;
    CustIndicator: string;
    IdNo: string;
    RelationWithCust: string;
    CustNo: string;
    ExposureType: string;
    ExposureTypeDesc: string;
    OsPrincipalAmt: number;
    OsInterestAmt: number;
    OsArBalance: number;
    MaxAr: number;
    MaxInstallmentAmt: number;
    MaxOverdueDays: number;
    MaxOverdueAmt: number;
    ActiveAgrmnt: number;
    AssetInFinancing: number;
    AgrmntRejected: number;
    AgrmntCancelled: number;
    AgrmntWrittenOff: number;
    AgrmntNonAcrual: number;
    BounceCheque: number;
    AssetRepossessed: number;
    AssetInventoried: number;
    IdType: string;
    AgrmntFpd: number;
    SpanOfMonth: number;
    AgrmntInProcess: number;
    TotalAgrmntOverdue: number;
    AgrmntRepossess: number;
    AgrmntPaidOff: number;
    CustIndicatorDescr: string;
    RowVersion: string;

    constructor(){
        
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