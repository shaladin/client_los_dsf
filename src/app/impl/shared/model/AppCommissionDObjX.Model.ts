export class AppCommissionDObjX{
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
        this.AppCommissionHId=0;
        this.MrCommissionSourceCode="";
        this.CommissionAmt=0;
        this.TaxAmt=0;
        this.VatAmt=0;
        this.PenaltyAmt=0;
        this.RefundAmt=0;
        this.CommissionAmtAfterTax=0;
        this.RowVersion="";

    }
}