import { AppCustAddrObj } from "./app-cust-addr-obj.model";
import { AppCustCompanyMgmntShrholderObj } from "./app-cust-company-mgmnt-shrholder-obj.model";
import { AppCustCompanyObj } from "./app-cust-company-obj.model";
import { AppCustObj } from "./app-cust-obj.model";
import { AppCustPersonalJobDataObj } from "./app-cust-personal-job-data-obj.model";
import { AppCustPersonalObj } from "./app-cust-personal-obj.model";

export class ResponseAppCustMainDataObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustPersonalJobDataObj: AppCustPersonalJobDataObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;
    StatusCode: string;

    constructor()
    {
        this.AppCustObj = new AppCustObj();
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj();
    }
}