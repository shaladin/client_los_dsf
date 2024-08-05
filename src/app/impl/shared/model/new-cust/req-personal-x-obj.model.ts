import { CustAddrXObj } from "../cust-addr-x-obj.model";
import { CustDocFileXObj } from "../cust-doc-file/cust-doc-file-x-obj.model";
import { CustXObj } from "../cust-x-obj.model";
import { CustPersonalJobDataXObj } from "../cust-personal-job-data-x-obj.model";
import { CustPersonalXObj } from "../cust-personal-x-obj.model";
import { CustAttrContentXObj } from "./cust-attr-content-x-obj.model";
import { CustCompanyMgmntShrholderXObj } from "./cust-company-mgmnt-shrholder-x-obj.model";
import { CustPersonalFamilyXObj } from "./cust-personal-family-x-obj.model";

export class ReqPersonalXObj {
    CustObj: CustXObj;
    CustPersonalObj: CustPersonalXObj;
    CustAddr: CustAddrXObj;
    CustPersonalFamilyObj: CustPersonalFamilyXObj;
    CustCompanyMgmntShrholderObj: CustCompanyMgmntShrholderXObj;
    CustPersonalJobObj: CustPersonalJobDataXObj;
    CustAttrContentObjs: Array<CustAttrContentXObj>;
    CustDocFileObjs: Array<CustDocFileXObj>;

    constructor() {

    }
}
