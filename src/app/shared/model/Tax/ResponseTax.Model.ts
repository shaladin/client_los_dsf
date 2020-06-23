import { TaxTrxHObj } from "./TaxTrxH.Model";

export class ResponseTaxObj {

    MrIdTypeCode: string;
    MrTaxCalcMethodCode: string;
    TaxpayerNo: string;
    ReturnObject: Array<TaxTrxHObj>;
    
    constructor() {
    }
}
