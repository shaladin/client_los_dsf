
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { CustDocFileXObj } from "../cust-doc-file/cust-doc-file-x-obj.model";
import { CustPersonalJobDataXObj } from "../cust-personal-job-data-x-obj.model";
import { CustAttrContentXObj } from "./cust-attr-content-x-obj.model";
import { CustCompanyMgmntShrholderXObj } from "./cust-company-mgmnt-shrholder-x-obj.model";
import { CustPersonalFamilyXObj } from "./cust-personal-family-x-obj.model";

export class ReqDupXObj {
    CustNo: string;
    CustDataMode: string;
    CustPersonalFamilyObj: CustPersonalFamilyXObj;
    CustCompanyMgmntShrholderObj: CustCompanyMgmntShrholderXObj;
    CustPersonalJobObj: CustPersonalJobDataXObj;
    CustAttrContentObjs: Array<CustAttrContentXObj>;
    CustDocFileObjs: Array<CustDocFileXObj>;
    ThirdPartyTrxNo: string;

    constructor() {
        this.CustNo = "";
        this.CustDataMode = CommonConstant.CustMainDataModeCust;
        this.CustPersonalFamilyObj = null;
        this.CustCompanyMgmntShrholderObj = null;
        this.CustPersonalJobObj = null;
        this.CustAttrContentObjs = null;
        this.ThirdPartyTrxNo = "";
    }
}