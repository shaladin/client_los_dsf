import { AppCustObj } from "./AppCustObj.Model";
import { AppCustCompanyObj } from "./AppCustCompanyObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";



export class CustDataCompanyObj {
    AppCustObj: AppCustObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustAddrMailingObj: AppCustAddrObj;
    AppCustCompanyMgmntShrholderObjs: any;
    RowVersion: any;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustAddrMailingObj = new AppCustAddrObj();
        this.RowVersion = ""; 
    }
}
