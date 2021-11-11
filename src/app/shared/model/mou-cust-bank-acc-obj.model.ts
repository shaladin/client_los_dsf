export class MouCustBankAccObj {
    MouCustBankAccId: number;
    MouCustId: number;
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
    MouCustBankStmntObjs: Array<any>;

constructor() { 
        this.MouCustBankAccId = 0;      
    }
}
