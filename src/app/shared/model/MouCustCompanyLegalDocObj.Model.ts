export class MouCustCompanyLegalDocObj {
    MouCustCompanyLegalDocId: number;
    MouCustCompanyId: number; 
    MrLegalDocTypeCode: string;
    LegalDocName: string; 
    DocNo: string; 
    DocDt: Date; 
    DocExpiredDt: Date; 
    DocNotes: string; 
    ReleaseBy: string; 
    ReleaseLocation: string; 
    RowVersion: string;
    
constructor() { this.MouCustCompanyLegalDocId = 0; this.RowVersion="" }
}
