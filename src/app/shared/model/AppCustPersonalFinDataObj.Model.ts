export class AppCustPersonalFinDataObj {
    AppCustPersonalFinDataId: any;
    AppCustPersonalId: any;
    MonthlyIncomeAmt: string;
    MonthlyExpenseAmt: any;
    MonthlyInstallmentAmt: any;
    MrSourceOfIncomeTypeCode: any;
    SpouseMonthlyIncomeAmt: any;
    IsJoinIncome: any;

constructor() { 
        this.AppCustPersonalFinDataId = 0;
        this.AppCustPersonalId = 0;
        this.MonthlyExpenseAmt = 0;
        this.MonthlyInstallmentAmt = 0;
        this.MrSourceOfIncomeTypeCode = "";
        this.SpouseMonthlyIncomeAmt = 0;
        this.IsJoinIncome = false;
    }
}
