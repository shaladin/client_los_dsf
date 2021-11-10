export class CustPersonalFinDataObj {
    CustPersonalFinDataId: number;
    CustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeCode: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    OtherIncomeAmt: number;
    OtherMonthlyInstAmt: number;
    TotalIncomeAmt: number;
    NettIncomeAmt: number;
    RowVersion: string;

constructor() { 
        this.CustPersonalFinDataId = 0;
        this.CustPersonalId = 0;
        this.MonthlyExpenseAmt = 0;
        this.MonthlyInstallmentAmt = 0;
        this.MrSourceOfIncomeCode = "";
        this.SpouseMonthlyIncomeAmt = 0;
        this.MonthlyIncomeAmt = 0;
        this.IsJoinIncome = false;
        this.RowVersion = "";
        this.OtherIncomeAmt = 0;
        this.OtherMonthlyInstAmt = 0;
        this.TotalIncomeAmt = 0;
        this.NettIncomeAmt = 0;
    }
}
