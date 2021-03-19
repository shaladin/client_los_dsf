import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustCompanyMgmntShrholderObj } from "./AppCustCompanyMgmntShrholderObj.Model";
import { AppCustCompanyObj } from "./AppCustCompanyObj.Model";
import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";

export class ResponseAppCustMainDataObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;
    StatusCode: string;

    constructor()
    {
        this.AppCustObj = new AppCustObj();
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj();
    }
}