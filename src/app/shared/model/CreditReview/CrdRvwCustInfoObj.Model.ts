import { CommonConstant } from "app/shared/constant/CommonConstant";

export class CrdRvwCustInfoObj {
    
    CrdRvwCustInfoId: number;
    AppId: number;
    AppCustCompanyId: number;
    AppNo: string;
    AppCustId: number;
    BizTemplateCode: string;
    CustNo: string;
    CustName: string;
    CustIndicator: string;
    MrCustTypeCode: string;
    DiffToMasterCust: string;
    DiffToMasterIndicator: string;
    DiffToInPrcssCust: string;
    DiffToInPrcssIndicator: string;
    AppliNo: string;
    CustIndicatorDescr: string;
    DiffToMasterIndicatorDescr: string;
    DiffToInPrcssIndicatorDescr: string;

    constructor() {
        this.CrdRvwCustInfoId = 0;
        this.AppId = 0;
        this.BizTemplateCode = CommonConstant.CF4W;
        this.CustName = "CustName";
        this.CustIndicator = CommonConstant.WhiteIndicator;
        this.DiffToMasterIndicator = CommonConstant.WhiteIndicator;
        this.DiffToInPrcssIndicator = CommonConstant.WhiteIndicator;
        this.CustIndicatorDescr = CommonConstant.NoData;
        this.DiffToMasterIndicatorDescr = CommonConstant.NoData;
        this.DiffToInPrcssIndicatorDescr = CommonConstant.NoData;
        this.MrCustTypeCode = CommonConstant.CustTypeCompany;
    }
}