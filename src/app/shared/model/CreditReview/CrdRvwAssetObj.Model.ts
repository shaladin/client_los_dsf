import { CommonConstant } from "app/shared/constant/CommonConstant";

export class CrdRvwAssetObj {

    CrdRvwAssetId: number;
    CrdRvwCustInfoId: number;
    AppNo: string;
    AssetName: string;
    AssetCondition: string;
    AssetUsage: string;
    AssetPrice: number;
    IsNegativeAsset: boolean;
    NegativeAssetNotes: string;
    NegativeAssetIndicator: string;
    NegativeAssetIndicatorDescr: string;
    DpAmount: number;
    DpPrcnt: number;
    Insurance: string;
    IsDoubleFinancing: boolean;

    constructor() {
        this.NegativeAssetIndicator = CommonConstant.WhiteIndicator;
        this.NegativeAssetIndicatorDescr = CommonConstant.NoData;
    }
}