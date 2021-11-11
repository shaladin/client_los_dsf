export class CrdRvwOvdObj {
    CrdRvwOvdId: number;
    CrdRvwCustInfoId: number;
    CustNo: string;
    CustName: string;
    RelationType: string;
    TotalAgrmntOverdue: number;
    MaxOverdueDays: number;
    MaxOverdueAmt: number;
    OverdueIndicator: string;
    OverdueIndicatorDescr: string;
    constructor() {
        this.TotalAgrmntOverdue = 0;
        this.MaxOverdueDays = 0;
        this.MaxOverdueAmt = 0;
    }
}