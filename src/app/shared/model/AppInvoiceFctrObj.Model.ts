export class AppInvoiceFctrObj {
    AppInvoiceFctrId: number;
    AppFctrId: number;
    CustomerFactoringNo: string;
    CustomerFactoringName: string;
    InvoiceNo: string;
    InvoiceAmt: number;
    InvoiceDueDt: Date;
    InvoiceStat: string;
    IsApproved: boolean;
    Notes: string;
    DisbAmt: number;
    RowVersion: string;
    constructor() {
        this.AppInvoiceFctrId = 0;
        this.AppFctrId = 0;
        this.CustomerFactoringNo = "";
        this.InvoiceNo = "";
        this.InvoiceAmt = 0;
        this.InvoiceDueDt = new Date();
        this.InvoiceStat = "";
        this.IsApproved = false;
        this.Notes = "";
        this.RowVersion = "";
    }
}