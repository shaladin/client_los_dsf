export class ChangeMouCustObj {

    ChangeMouCustId: number;
    ChangeMouTrxId: number;
    EndDt: Date;
    RefNo: string;
    PlafondAmt: number;
    MrRevolvingTypeCode: string;

    constructor() {
        this.ChangeMouCustId = 0;
        this.ChangeMouTrxId = 0;
        this.EndDt = new Date();
        this.RefNo = "";
        this.PlafondAmt = 0;
        this.MrRevolvingTypeCode = "";
    }
}