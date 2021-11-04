import { TaxTrxDObj } from "./tax-trx-d.model";

export class TaxTrxHObj {

    TrxTypeCode : string;
    TaxSchmHId : number;
    ExchangeRateAmt : number;
    CurrCode : string;
    TaxablePrcnt : number;
    TaxIdNoExists : boolean;
    MrTaxCalcMethodCode : string;
    ExpenseAmt : number;
    RefNo : string;
    DisburseAmt : number;
    TaxAmt : number;
    TrxTaxableAmt : number;
    BaseTrxAmt : number;
    TrxAmt : number;
    TrxDt : Date;
    TaxTrxNo : string;
    TaxHId : number;
    TaxTrxHId : number;
    PenaltyAmt : number;
    TaxTrxD : Array<TaxTrxDObj>;
    
    constructor() {
    }
}
