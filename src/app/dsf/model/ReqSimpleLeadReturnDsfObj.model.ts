export class ReqSimpleLeadReturnDsfObj {
    LeadId: number;
    ReturnReason: string;
    ReturnNotes: string;
    RowVersion: any;

    constructor()
    {
        this.LeadId = 0;
        this.ReturnReason = "";
        this.ReturnNotes = "";
        this.RowVersion = "";
    }
}