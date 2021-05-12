export class ResAppCustBankAccForViewObj {
    AppCustBankAccId : number;
    BankCode : string;
    BankName : string;
    BankBranch : string;
    BankAccNo : string;
    BankAccName : string;
    IsDefault : boolean;
    IsActive : boolean;
    ListAppCustBankAccStmntObj : Array<ResAppCustBankAccStmntForViewObj>;

    constructor(){
        this.AppCustBankAccId = 0;
        this.BankCode = "";
        this.BankName = "";
        this.BankBranch = "";
        this.BankAccNo = "";
        this.BankAccName = "";
        this.IsDefault = false;
        this.IsActive = false;
        this.ListAppCustBankAccStmntObj = new Array<ResAppCustBankAccStmntForViewObj>();
    }
}

export class ResAppCustBankAccStmntForViewObj {
    Month : string;
    Year : string;
    DebitAmt : number;
    CreditAmt : number;
    BalanceAmt : number;

    constructor(){
        this.Month = "";
        this.Year = "";
        this.DebitAmt = 0;
        this.CreditAmt = 0;
        this.BalanceAmt = 0;
    }
}
