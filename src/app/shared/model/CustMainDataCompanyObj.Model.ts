import { AppCustObj } from "./AppCustObj.Model";
import { AppCustCompanyObj } from "./AppCustCompanyObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";

export class CustMainDataCompanyObj {
    AppCustObj: AppCustObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    RowVersion: string;

    constructor() { 
        this.AppCustObj = new AppCustObj();
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.RowVersion = ""; 
    }
}
