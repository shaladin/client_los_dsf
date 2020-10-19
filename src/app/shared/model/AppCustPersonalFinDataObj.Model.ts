export class AppCustPersonalFinDataObj {
    AppCustPersonalFinDataId: number;
    AppCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeTypeCode: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
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
    }
}
