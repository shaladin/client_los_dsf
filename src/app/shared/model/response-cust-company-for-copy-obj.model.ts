import { CustObj } from "./cust-obj.model";
import { CustCompanyObj } from "./cust-company-obj.model";
import { CustAddrObj } from "./cust-addr-obj.model";
import { AppCustCompanyMgmntShrholderObj } from "./app-cust-company-mgmnt-shrholder-obj.model";

export class ResponseCustCompanyForCopyObj {
    CustObj: CustObj;
    CustCompanyObj: CustCompanyObj;
    CustAddrLegalObj : CustAddrObj;
    CustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;

    constructor()
    {
        this.CustObj = new CustObj();
        this.CustCompanyObj = new CustCompanyObj();
        this.CustAddrLegalObj  = new CustAddrObj ();
        this.CustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj();
    }
}