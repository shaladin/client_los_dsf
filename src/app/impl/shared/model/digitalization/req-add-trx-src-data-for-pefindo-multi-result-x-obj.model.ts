import { ReqAddTrxSrcDataForPefindoXObj } from "./req-add-trx-src-data-for-pefindo-x-obj.model";

export class ReqAddTrxSrcDataForPefindoMultiResultXObj {
    ReqAddTrxSrcDataForPefindoObj: Array<ReqAddTrxSrcDataForPefindoXObj>;
    CustId: number;
    RowVersion: string;

    constructor() {
        this.ReqAddTrxSrcDataForPefindoObj = new Array<ReqAddTrxSrcDataForPefindoXObj>();
        this.CustId = 0;
        this.RowVersion = "";
    }
}