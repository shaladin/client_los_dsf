export class ReqAddAppInvoiceDlrFncngHObj {
    AppDlrFncngId: number;
    InvoiceAmt : number;
    InvoiceNo : string;
    InvoiceDueDt : Date;
    RowVersion: string;
    IsApproved : boolean;
    InvoiceStat : string;
    Notes : string;

    constructor() {
        this.AppDlrFncngId = 0;
        this.InvoiceAmt = 0;
        this.InvoiceNo = "";
        this.InvoiceDueDt = new Date();
        this.IsApproved = false;
        this.InvoiceStat = "";
        this.Notes = "";
    }
}

export class ReqEditAppINvoiceDlrFncngHObj extends ReqAddAppInvoiceDlrFncngHObj{
    AppInvoiceDlrFncngHId: number;

    constructor() {
        super();
    }
}

