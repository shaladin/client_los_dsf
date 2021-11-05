import { AppCustObj } from "./app-cust-obj.model";
import { AppCustPersonalObj } from "./app-cust-personal-obj.model";
import { AppCustAddrObj } from "./app-cust-addr-obj.model";
import { AppCustCompanyMgmntShrholderObj } from "./app-cust-company-mgmnt-shrholder-obj.model";
import { AppCustPersonalJobDataObj } from "./app-cust-personal-job-data-obj.model";
import { AppCustAttrContentObj } from "./app-cust/cust-attr-content/app-cust-attr-content-obj.model";

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
