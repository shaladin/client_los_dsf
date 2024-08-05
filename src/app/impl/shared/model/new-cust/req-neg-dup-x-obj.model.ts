import { CustDocFileXObj } from "../cust-doc-file/cust-doc-file-x-obj.model";
import { CustPersonalJobDataXObj } from "../cust-personal-job-data-x-obj.model";
import { CustAttrContentXObj } from "./cust-attr-content-x-obj.model";
import { CustCompanyMgmntShrholderXObj } from "./cust-company-mgmnt-shrholder-x-obj.model";
import { CustPersonalFamilyXObj } from "./cust-personal-family-x-obj.model";

export class ReqNegDupXObj {
    NegativeCustId: number;
    CustDataMode: string;
    MrCompanyTypeCode: string;
    CustPersonalFamilyObj: CustPersonalFamilyXObj;
    CustCompanyMgmntShrholderObj: CustCompanyMgmntShrholderXObj;
    CustPersonalJobObj: CustPersonalJobDataXObj;
    CustAttrContentObjs: Array<CustAttrContentXObj>;
    ThirdPartyTrxNo: string;
    CustDocFileObjs: Array<CustDocFileXObj>;

    constructor() {
        this.NegativeCustId = 0;
        this.CustDataMode = "";
        this.MrCompanyTypeCode = "";
        this.CustPersonalFamilyObj = null;
        this.CustCompanyMgmntShrholderObj = null;
    }
}