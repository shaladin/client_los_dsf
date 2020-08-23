export class MouCustPersonalFinDataObj {
    MouCustPersonalFinDataId: number;
    MouCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeTypeCode: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    RowVersion: any;

constructor() { 
        this.MouCustPersonalFinDataId = 0;
        this.MouCustPersonalId = 0;
        this.MonthlyExpenseAmt = 0;
        this.MonthlyInstallmentAmt = 0;
        this.MrSourceOfIncomeTypeCode = "";
        this.SpouseMonthlyIncomeAmt = 0;
        this.MonthlyIncomeAmt = 0;
        this.IsJoinIncome = false;
        this.RowVersion = "";
    }
}
