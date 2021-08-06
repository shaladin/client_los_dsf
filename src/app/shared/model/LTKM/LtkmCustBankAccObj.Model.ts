export class LtkmCustBankAccObj {
    LtkmCustBankAccId: number;
    LtkmCustId: number;
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
    BegBalanceAmt: number;
    LtkmCustBankStmntObjs: Array<any>;
    RowVersion: string;

    constructor() {
        this.LtkmCustBankAccId = 0;
    }
}
