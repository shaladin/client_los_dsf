import { TaxTrxHObj } from "./TaxTrxH.Model";

export class ResponseTaxObj {

    MrIdTypeCode: string;
    MrTaxKindCode: string;
    MrTaxCalcMethodCode: string;
    TaxpayerNo: string;
    ReturnObject: Array<TaxTrxHObj>;
    
    constructor() {
    }
}
