export class MouCancelObj {
    MouCustCancelId: number;
    MouCustId: number;
    CancelBy: string;
    CancelDt: Date;
    ReasonCode: string;
    CancelNotes: string;
    constructor() {
        this.MouCustCancelId = 0;
        this.MouCustId = 0;
        this.CancelBy = "";
        this.CancelDt = new Date();
        this.ReasonCode = "";
        this.CancelNotes = "";
    }
}
