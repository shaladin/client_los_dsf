export class LtkmCustPersonalFinDataObjX {
    LtkmCustPersonalFinDataId: number;
    LtkmCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeTypeCode: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    OtherIncomeAmt: number;
    OtherMonthlyInstAmt: number;
    TotalIncomeAmt: number;
    NettIncomeAmt: number;
    DateAsOf: Date;
    RowVersion: string;
    OtherMonthlyInstallmentDsf: number;

    constructor() {
        this.LtkmCustPersonalFinDataId = 0;
        this.LtkmCustPersonalId = 0;
        this.MonthlyExpenseAmt = 0;
        this.MonthlyInstallmentAmt = 0;
        this.MrSourceOfIncomeTypeCode = "";
        this.SpouseMonthlyIncomeAmt = 0;
        this.MonthlyIncomeAmt = 0;
        this.IsJoinIncome = false;
        this.RowVersion = "";
        this.OtherIncomeAmt = 0;
        this.OtherMonthlyInstAmt = 0;
        this.TotalIncomeAmt = 0;
        this.NettIncomeAmt = 0;
        this.OtherMonthlyInstallmentDsf = 0;
    }
}
