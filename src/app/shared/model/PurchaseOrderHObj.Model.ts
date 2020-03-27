export class PurchaseOrderHObj {
    PurchaseOrderHId: number;
    PurchaseOrderNo: string;
    PurchaseOrderDt: Date;
    PurchaseOrderExpiredDt: Date;
    TotalPurchaseOrderAmt: number;
    AgrmntId: number;
    SupplCode: string;
    BankCode: string;
    BankBranch: string;
    BankAccNo: string;
    BankAccName: string;
    Notes: string;
    NumOfExtension: number;
    MouNo: string;
    RowVersion: string;

    constructor() {
        this.PurchaseOrderHId = 0;
        this.PurchaseOrderNo = "";
        this.PurchaseOrderDt = new Date();
        this.PurchaseOrderExpiredDt = new Date();
        this.TotalPurchaseOrderAmt = 0;
        this.AgrmntId = 0;
        this.SupplCode = "";
        this.BankCode = "";
        this.BankBranch = "";
        this.BankAccNo = "";
        this.BankAccName = "";
        this.Notes = "";
        this.NumOfExtension = 0;
        this.MouNo = "";
        this.RowVersion = "";
    }
}
