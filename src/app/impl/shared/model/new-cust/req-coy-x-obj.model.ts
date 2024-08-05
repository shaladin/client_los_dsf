import { CustAddrXObj } from "../cust-addr-x-obj.model";
import { CustCompanyXObj } from "../cust-company-x-obj.model";
import { CustDocFileXObj } from "../cust-doc-file/cust-doc-file-x-obj.model";
import { CustXObj } from "../cust-x-obj.model";
import { CustCompanyMgmntShrholderXObj } from "./cust-company-mgmnt-shrholder-x-obj.model";

export class ReqCoyXObj{
    CustObj : CustXObj;
    CustCompanyObj : CustCompanyXObj;
    CustAddr: CustAddrXObj;
    CustCompanyMgmntShrholderObj: CustCompanyMgmntShrholderXObj;
    CustDocFileObjs: Array<CustDocFileXObj>;
    IsForeigner: boolean;
}
