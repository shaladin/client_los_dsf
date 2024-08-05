import { CustPersonalJobDataXObj } from "../../cust-personal-job-data-x-obj.model";
import { CustCompanyMgmntShrholderXObj } from "../cust-company-mgmnt-shrholder-x-obj.model";

export class CustFormExistingXObj {
    CustCompanyMgmntShrholder: CustCompanyMgmntShrholderXObj;
    CustPersonalJob: CustPersonalJobDataXObj;

    constructor() {
        this.CustCompanyMgmntShrholder = new CustCompanyMgmntShrholderXObj();
        this.CustPersonalJob = new CustPersonalJobDataXObj();
    }
}