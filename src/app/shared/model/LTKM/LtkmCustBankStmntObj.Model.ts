export class LtkmCustBankStmntObj {
    LtkmCustBankStmntId: number;
    AppCustBankId: number;
    Month: string;
    Year: string;
    DebitAmt: number;
    CreditAmt: number;
    BalanceAmt: number;
    MonthName: string;

    constructor() {
        this.LtkmCustBankStmntId = 0;
    }
}
