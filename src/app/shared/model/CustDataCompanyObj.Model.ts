import { AppCustObj } from "./AppCustObj.Model";
import { AppCustCompanyObj } from "./AppCustCompanyObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustCompanyFinDataObj } from "./AppCustCompanyFinDataObj.Model";



export class CustDataCompanyObj {
    AppCustObj: AppCustObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustAddrMailingObj: AppCustAddrObj;
    AppCustCompanyMgmntShrholderObjs: any;
    AppCustCompanyContactPersonObjs: any;
    AppCustCompanyFinDataObj: AppCustCompanyFinDataObj;
    AppCustBankAccObjs: any;
    AppCustCompanyLegalDocObjs: any;
    AppCustGrpObjs: any;
    RowVersion: any;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustAddrMailingObj = new AppCustAddrObj();
        this.AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
        this.RowVersion = ""; 
    }
}
