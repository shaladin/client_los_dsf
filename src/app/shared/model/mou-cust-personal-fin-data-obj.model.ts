export class MouCustPersonalFinDataObj {
    MouCustPersonalFinDataId: number;
    MouCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeTypeCode: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    OtherIncomeAmt: number;
    NettIncomeAmt: number;
    TotalIncomeAmt: number;
    RowVersion: string;

constructor() { 
        this.MouCustPersonalFinDataId = 0;
        this.MouCustPersonalId = 0;
        this.MonthlyExpenseAmt = 0;
        this.MonthlyInstallmentAmt = 0;
        this.MrSourceOfIncomeTypeCode = "";
        this.SpouseMonthlyIncomeAmt = 0;
        this.MonthlyIncomeAmt = 0;
        this.IsJoinIncome = false;
        this.OtherIncomeAmt = 0;
        this.NettIncomeAmt = 0;
        this.TotalIncomeAmt = 0;
        this.RowVersion = "";
    }
}
