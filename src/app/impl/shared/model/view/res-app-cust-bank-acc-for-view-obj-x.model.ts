import { ResAppCustBankAccStmntForViewObj } from "app/shared/model/response/view/res-app-cust-bank-acc-for-view-obj.model";

export class ResAppCustBankAccForViewObjX {
    AppCustBankAccId : number;
    BankCode : string;
    BankName : string;
    BankBranch : string;
    BankAccNo : string;
    BankAccName : string;
    IsDefault : boolean;
    IsActive : boolean;
    ListAppCustBankAccStmntObjX : Array<ResAppCustBankAccStmntForViewObj>;
    PlafondFromBank : boolean;

    constructor(){
        this.AppCustBankAccId = 0;
        this.BankCode = "";
        this.BankName = "";
        this.BankBranch = "";
        this.BankAccNo = "";
        this.BankAccName = "";
        this.IsDefault = false;
        this.IsActive = false;
        this.ListAppCustBankAccStmntObjX = new Array<ResAppCustBankAccStmntForViewObj>();
        this.PlafondFromBank = false;
    }
}