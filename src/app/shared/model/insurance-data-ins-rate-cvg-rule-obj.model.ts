export class InsuranceDataInsRateCvgRuleObj {
    InscoHoCode : string;
    InscoCode : string;
    RegionCode: string;
    InsAssetCategory: string;
    MainCoverageType: string;
    AppAssetId: number;
    AppCollateralId: number;
    AppId: number;

    constructor(){
        this.InscoHoCode = "";
        this.InscoCode = "";
        this.RegionCode = "";
        this.InsAssetCategory = "";
        this.MainCoverageType = "";
        this.AppAssetId = 0;
        this.AppCollateralId = 0;
        this.AppId = 0;
    }
}
