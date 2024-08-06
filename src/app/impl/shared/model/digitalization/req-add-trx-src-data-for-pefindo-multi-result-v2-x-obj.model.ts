import { ReqAddTrxSrcDataForPefindoV2XObj } from "./req-add-trx-src-data-for-pefindo-v2-x-obj-model";

export class ReqAddTrxSrcDataForPefindoMultiResultV2XObj {
    ReqAddTrxSrcDataForPefindoObj: Array<ReqAddTrxSrcDataForPefindoV2XObj>;
    CustId: number;
    RowVersion: string;
    SlikReferenceCode: string;
    MrPefindoInquiryReasonCode: string;

    constructor() {
        this.ReqAddTrxSrcDataForPefindoObj = new Array<ReqAddTrxSrcDataForPefindoV2XObj>();
        this.CustId = 0;
        this.RowVersion = "";
        this.SlikReferenceCode = "";
        this.MrPefindoInquiryReasonCode = "";
    }
}