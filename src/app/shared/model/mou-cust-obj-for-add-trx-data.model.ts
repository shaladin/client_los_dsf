import { CustDataCompanyObj } from "./cust-data-company-obj.model";
import { CustDataPersonalObj } from "./cust-data-personal-obj.model";
import { MouCustAddrObj } from "./mou-cust-addr-obj.model";
import { MouCustCompanyObj } from "./mou-cust-company-obj.model";
import { MouCustObj } from "./mou-cust-obj.model";
import { MouCustPersonalJobDataObj } from "./mou-cust-personal-job-data-obj.model";
import { MouCustPersonalObj } from "./mou-cust-personal-obj.model";

export class MouCustObjForAddTrxData {
    MouCustObj : MouCustObj;
    MouCustPersonalObj : MouCustPersonalObj;
    MouCustAddrLegalObj : MouCustAddrObj;
    MouCustPersonalJobDataObj : MouCustPersonalJobDataObj;
    MouCustCompanyObj : MouCustCompanyObj;
    
    constructor() { 
        this.MouCustObj = new MouCustObj();
        this.MouCustPersonalObj = new MouCustPersonalObj();
        this.MouCustAddrLegalObj = new MouCustAddrObj();
        this.MouCustPersonalJobDataObj = new MouCustPersonalJobDataObj;
        this.MouCustCompanyObj = new MouCustCompanyObj();
    }
}
