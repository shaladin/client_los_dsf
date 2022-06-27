export class AppSubsidyProfitablityXObj {
    AppSubsidyProfitabilityXId : number;
    AppAssetId : number;
    MrSubsidyFromTypeCode : string;
    MrSubsidyFromTypeDescr : string;
    MrSubsidyProfitabilityTypeCode : string;
    MrSubsidyProfitabilityTypeDescr : string; 
    SubsidyAmt : number;

    constructor() {
        this. AppSubsidyProfitabilityXId = 0;
        this.AppAssetId = 0;
        this.MrSubsidyFromTypeCode = '';
        this.MrSubsidyFromTypeDescr = '';
        this.MrSubsidyProfitabilityTypeCode = '';
        this.MrSubsidyProfitabilityTypeDescr = '';
        this.SubsidyAmt = 0;
    }
}