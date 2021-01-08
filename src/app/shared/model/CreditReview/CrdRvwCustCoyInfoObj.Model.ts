import { CommonConstant } from "app/shared/constant/CommonConstant";

export class CrdRvwCustCoyInfoObj {
    CrdRvwCustCoyInfoId: number;
    CrdRvwCustInfoId: number;
    IndustryType: string;
    Roi: string;
    RoiIndicator: string;
    RoiIndicatorDescr: string;
    Address: string;
    Npwp: string;
    NpwpIndicator: string;
    NpwpIndicatorDescr: string;
    constructor() {
        this.RoiIndicator = CommonConstant.WhiteIndicator;
        this.RoiIndicatorDescr = CommonConstant.NoData;
        this.NpwpIndicator = CommonConstant.WhiteIndicator;
        this.NpwpIndicatorDescr = CommonConstant.NoData;
    }
}