export class LtkmCustCompanyLegalDocObj {
    LtkmCustCompanyLegalDocId: number;
    LtkmCustCompanyId: number;
    MrLegalDocTypeCode: string;
    LegalDocName: string;
    DocNo: string;
    DocDt: Date;
    DocExpiredDt: Date;
    DocNotes: string;
    ReleaseBy: string;
    ReleaseLocation: string;
    IsExpDtMandatory: boolean;
    NotaryName: string;
    NotaryLocation: string;
    RowVersion: string;

    constructor() { this.LtkmCustCompanyLegalDocId = 0; this.RowVersion = "" }
}
