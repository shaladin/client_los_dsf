export class LeadAssetObj{
    LeadAssetId: number;
    TaskListId : number;
    LeadId: any;
    AssetSeqNo: number;
    FullAssetCode: string;
    FullAssetName: string
    AssetPriceAmt: number;
    MrDownPaymentTypeCode: string
    DownPaymentAmt: number;
    DownPaymentPrcnt: number;
    MrAssetConditionCode: string
    ManufacturingYear: string
    SerialNo1: string
    SerialNo2: string
    SerialNo3: string
    SerialNo4: string
    SerialNo5: string
    RowVersion: string
    constructor() { this.LeadAssetId = 0, this.RowVersion = "" }
}
