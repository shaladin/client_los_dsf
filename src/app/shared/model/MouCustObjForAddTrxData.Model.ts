import { CustDataCompanyObj } from "./CustDataCompanyObj.Model";
import { CustDataPersonalObj } from "./CustDataPersonalObj.Model";
import { MouCustAddrObj } from "./MouCustAddrObj.Model";
import { MouCustCompanyObj } from "./MouCustCompanyObj.Model";
import { MouCustObj } from "./MouCustObj.Model";
import { MouCustPersonalJobDataObj } from "./MouCustPersonalJobDataObj.Model";
import { MouCustPersonalObj } from "./MouCustPersonalObj.Model";

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
