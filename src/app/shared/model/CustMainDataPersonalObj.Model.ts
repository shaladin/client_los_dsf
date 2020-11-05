import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustCompanyMgmntShrholderObj } from "./AppCustCompanyMgmntShrholderObj.Model";

export class CustMainDataPersonalObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj;
    }
}
