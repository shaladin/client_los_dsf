import { MouCustObj } from "./MouCustObj.Model";
import { MouCustCompanyObj } from "./MouCustCompanyObj.Model";
import { MouCustAddrObj } from "./MouCustAddrObj.Model";
import { MouCustCompanyFinDataObj } from "./MouCustCompanyFinDataObj.Model";



export class MouCustCompanyDataObj {
    MouCustObj: MouCustObj;
    MouCustCompanyObj: MouCustCompanyObj;
    MouCustAddrLegalObj: MouCustAddrObj;
    MouCustAddrMailingObj: MouCustAddrObj;
    MouCustCompanyMgmntShrholderObjs: any;
    MouCustCompanyContactPersonObjs: any;
    MouCustCompanyFinDataObj: MouCustCompanyFinDataObj;
    MouCustBankAccObjs: any;
    MouCustCompanyLegalDocObjs: any;
    MouCustGrpObjs: any;
    RowVersion: any;

    constructor() { 
        this.MouCustObj = new MouCustObj(); 
        this.MouCustCompanyObj = new MouCustCompanyObj();
        this.MouCustAddrLegalObj = new MouCustAddrObj();
        this.MouCustAddrMailingObj = new MouCustAddrObj();
        this.MouCustCompanyFinDataObj = new MouCustCompanyFinDataObj();
        this.RowVersion = ""; 
    }
}
