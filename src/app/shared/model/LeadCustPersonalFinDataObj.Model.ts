export class LeadCustPersonalFinDataObj {
    LeadCustPersonalFinDataId: number;
    LeadCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeCode: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    RowVersion: string;
    constructor() { this.LeadCustPersonalFinDataId = 0, this.RowVersion = "" }
}