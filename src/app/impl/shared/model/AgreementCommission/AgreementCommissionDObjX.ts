export class AgreementCommissionDXObj {
    AgrmntCommissionDId: number;
    AgrmntCommissionHId: number;
    MrCommissionSourceCode: string;
    CommissionAmt: number;
    TaxAmt: number;
    VatAmt: number;
    PenaltyAmt: number;
    RefundAmt: number;
    CommissionAmtAfterTax: number;
    RowVersion: string;
    
    constructor(){
        this.AgrmntCommissionDId = 0;
        this.AgrmntCommissionHId = 0;
    }
}
