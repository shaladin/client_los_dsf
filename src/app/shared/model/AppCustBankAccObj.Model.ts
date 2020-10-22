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
    IsDefault: boolean;
    IsActive: boolean;
    BankInfo: string;
    AppCustBankStmntObjs: Array<any>;
    RowVersion: string[];
    
constructor() { 
        this.AppCustBankAccId = 0;      
    }
}
