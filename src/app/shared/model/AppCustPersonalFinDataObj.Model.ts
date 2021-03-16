export class AppCustPersonalFinDataObj {
    AppCustPersonalFinDataId: number;
    AppCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeTypeCode: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    OtherIncomeAmt: number;
    OtherMonthlyInstallmentAmt: number;
    TotalIncomeAmt: number;
    NettIncomeAmt: number;
    RowVersion: string;

constructor() { 
        this.AppCustPersonalFinDataId = 0;
        this.AppCustPersonalId = 0;
        this.MonthlyExpenseAmt = 0;
        this.MonthlyInstallmentAmt = 0;
        this.MrSourceOfIncomeTypeCode = "";
        this.SpouseMonthlyIncomeAmt = 0;
        this.MonthlyIncomeAmt = 0;
        this.IsJoinIncome = false;
        this.RowVersion = "";
        this.OtherIncomeAmt = 0;
        this.OtherMonthlyInstallmentAmt = 0;
        this.TotalIncomeAmt = 0;
        this.NettIncomeAmt = 0;
    }
}
