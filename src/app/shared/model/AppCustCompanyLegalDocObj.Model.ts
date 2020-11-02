export class AppCustCompanyLegalDocObj {
    AppCustCompanyLegalDocId: number;
    AppCustCompanyId: number; 
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
    RowVersion: string[];
    
constructor() { this.AppCustCompanyLegalDocId = 0; this.RowVersion=[] }
}
