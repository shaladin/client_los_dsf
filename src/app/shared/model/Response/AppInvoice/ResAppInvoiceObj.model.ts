export class ResDisbInfo {
    DisbInfoId: number;
    AgrmntId: number;
    AppId: number;
    AccName: string;
    AccNo: string;
    BankBranch: string;
    BankBranchBiCode: string;
    BankCode: string;
    RowVersion: string;
    
    constructor() {
        this.DisbInfoId = 0;
        this.AgrmntId = 0;
        this.AppId = 0;
        this.AccName = "";
        this.AccNo = "";
        this.BankBranch = "";
        this.BankBranchBiCode = "";
        this.BankCode = "";
        this.RowVersion = "";
    }
}

export class ResGetAllNtfAppAmt {
    NtfAmt: number;
        
    constructor() {
        this.NtfAmt = 0;
    }
}

export class ResGetAppInvoiceDlrFncngHByAppInvoiceDlrFncngHIdObj {
    AppInvoiceDlrFncngHId: number;
    InvoiceAmt : number;
    InvoiceNo : string;
    InvoiceDueDt : Date;
    RowVersion: string;

    constructor() {
        this.AppInvoiceDlrFncngHId = 0;
        this.InvoiceAmt = 0;
        this.InvoiceNo = "";
        this.InvoiceDueDt = new Date();
        this.RowVersion = "";
    }
}