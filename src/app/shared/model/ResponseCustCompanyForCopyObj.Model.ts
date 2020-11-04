import { CustObj } from "./CustObj.Model";
import { CustCompanyObj } from "./CustCompanyObj.Model";
import { CustAddrObj } from "./CustAddrObj.Model";
import { AppCustCompanyMgmntShrholderObj } from "./AppCustCompanyMgmntShrholderObj.Model";

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