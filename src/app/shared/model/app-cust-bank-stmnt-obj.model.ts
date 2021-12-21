export class AppCustBankStmntObj {
    AppCustBankStmntId: number;
    AppCustBankId: number;
    Month: string;
    Year: string;
    DebitAmt: number;
    CreditAmt: number;
    BalanceAmt: number;
    DebitTrxCount: number;
    CreditTrxCount: number;
    MonthName: string;

constructor() { 
        this.AppCustBankStmntId = 0;      
    }
}
