export class AppGuarantorCompanyLegalDocObj {
    AppGurarantorCompanyLegalDocId: number;
    AppGuarantorCompanyId: number; 
    MrLegalDocTypeCode: string;
    LegalDocName: string; 
    DocNo: string; 
    DocDt: Date; 
    DocExpiredDt: Date; 
    DocNotes: string; 
    ReleaseBy: string; 
    ReleaseLocation: string; 
    IsExpDtMandatory: boolean;
    RowVersion: any;
    
constructor() { this.AppGurarantorCompanyLegalDocId = 0; this.RowVersion="" }
}
