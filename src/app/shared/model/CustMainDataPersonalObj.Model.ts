import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustCompanyMgmntShrholderObj } from "./AppCustCompanyMgmntShrholderObj.Model";
import { AppCustPersonalJobDataObj } from "./AppCustPersonalJobDataObj.Model";
import { AppCustAttrContentObj } from "./AppCust/CustAttrContent/AppCustAttrContentObj.Model";

export class CustMainDataPersonalObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustPersonalJobDataObj: AppCustPersonalJobDataObj;
    AppCustAttrObjs: Array<AppCustAttrContentObj>;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj;
        this.AppCustAttrObjs = new Array();
    }
}
