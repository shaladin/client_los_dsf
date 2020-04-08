export class CustCnfrmObj {
    CustCnfrmId: number;
    AppId: number;
    AgrmntId: number;
    IsSkip: boolean;
    SkipReason: string;
    Phone: string;
    MrCustCnfrmResultCode: string;
    CnfmrNotes: string;
    RowVersion: string;

    constructor() {
        this.CustCnfrmId = 0;
        this.AppId = 0;
        this.AgrmntId = 0;
        this.IsSkip = false;
        this.SkipReason = "";
        this.Phone = "";
        this.MrCustCnfrmResultCode = "";
        this.CnfmrNotes = "";
        this.RowVersion = "";
    }
}