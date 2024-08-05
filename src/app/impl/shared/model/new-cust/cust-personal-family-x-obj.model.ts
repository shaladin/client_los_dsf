export class CustPersonalFamilyXObj {
    CustId: number;
    FamilyId: number;
    MrCustRelationship: string;
    RowVersion: string;

    constructor() {
        this.CustId = 0;
        this.FamilyId = 0;
        this.MrCustRelationship = "";
        this.RowVersion = "";
    }
}