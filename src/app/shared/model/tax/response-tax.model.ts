import { TaxTrxHObj } from "./tax-trx-h.model";

export class ResponseTaxObj {

    MrIdTypeCode: string;
    MrTaxKindCode: string;
    MrTaxCalcMethodCode: string;
    TaxpayerNo: string;
    ReturnObject: Array<TaxTrxHObj>;
    
    constructor() {
    }
}
