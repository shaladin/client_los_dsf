import { AppCustBankStmntObj } from "./app-cust-bank-stmnt-obj.model";

export class AppCustBankAccObj {
    AppCustBankAccId: number;
    AppCustId: number;
    BankCode: string;
    BankName: string;
    BankBranch: string;
    BankAccNo: string;
    BankAccName: string;
    IsBankStmnt: boolean;
    BankBranchRegRptCode: string;
    BalanceAmt: number;
    BegBalanceAmt: number;
    IsDefault: boolean;
    IsActive: boolean;
    BankInfo: string;
    ListAppCustBankAccStmntObj: Array<AppCustBankStmntObj>;
    RowVersion: string[];
    
constructor() { 
        this.AppCustBankAccId = 0;      
    }
}
