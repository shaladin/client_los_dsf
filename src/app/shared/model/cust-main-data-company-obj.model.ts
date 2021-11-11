import { AppCustObj } from "./app-cust-obj.model";
import { AppCustCompanyObj } from "./app-cust-company-obj.model";
import { AppCustAddrObj } from "./app-cust-addr-obj.model";
import { AppCustCompanyMgmntShrholderObj } from "./app-cust-company-mgmnt-shrholder-obj.model";

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
