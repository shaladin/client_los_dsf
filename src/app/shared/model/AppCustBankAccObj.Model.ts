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
    BankInfo: string;
    AppCustBankStmntObjs: any;

constructor() { 
        this.AppCustBankAccId = 0;      
    }
}
