export class ResMouCustClauseObj {
    MouCustClauseId: number;
    MouCustId: number;
    AssetTypeCode: string;
    MrInterestTypeCode: string;
    MrInstSchmCode: string;
    MrFirstInstTypeCode: string;
    PayFreqCode: string;
    DownPaymentFromPrcnt: number;
    DownPaymentToPrcnt: number;
    TenorFrom: number;
    TenorTo: number;
    CurrCode: string;
    InterestTypeDescr: string;
    InstSchmDescr: string;
    FirstInstTypeDescr: string;
    RowVersion: string;
    
    constructor() { this.MouCustId = 0; this.RowVersion = '' }
}