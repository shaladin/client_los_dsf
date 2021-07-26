export class MouCustClauseObj {
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
    RowVersion: string;
    constructor(){ this.MouCustClauseId = 0; this.RowVersion = '' }
}