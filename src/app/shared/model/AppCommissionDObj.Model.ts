export class AppCommissionDObj{
    AppCommissionDId: number;
    AppCommissionHId: number;
    MrCommissionSourceCode: string;
    CommissionAmt: number;
    TaxAmt: number;
    VatAmt: number;
    PenaltyAmt: number;
    RefundAmt: number;
    CommissionAmtAfterTax: number;
    RowVersion: string;
    
    constructor(){
        this.AppCommissionDId = 0;
        this.AppCommissionHId = 0;
    }
}