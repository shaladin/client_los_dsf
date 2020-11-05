import { AppCustObj } from "./AppCustObj.Model";
import { AppCustCompanyObj } from "./AppCustCompanyObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustCompanyMgmntShrholderObj } from "./AppCustCompanyMgmntShrholderObj.Model";

export class CustMainDataCompanyObj {
    AppCustObj: AppCustObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;

    constructor() { 
        this.AppCustObj = new AppCustObj();
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj(); 
    }
}
