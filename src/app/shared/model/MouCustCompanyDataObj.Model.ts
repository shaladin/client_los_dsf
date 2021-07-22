import { MouCustObj } from "./MouCustObj.Model";
import { MouCustCompanyObj } from "./MouCustCompanyObj.Model";
import { MouCustAddrObj } from "./MouCustAddrObj.Model";
import { MouCustCompanyFinDataObj } from "./MouCustCompanyFinDataObj.Model";
import { MouCustCompanyMgmntShrholderObj } from "./MouCustCompanyMgmntShrholderObj.Model";
import { MouCustGrpObj } from "./MouCustGrpObj.Model";
import { MouCustCompanyLegalDocObj } from "./MouCustCompanyLegalDocObj.Model";
import { MouCustBankAccObj } from "./MouCustBankAccObj.Model";
import { MouCustPersonalContactPersonObj } from "./MouCustPersonalContactPersonObj.Model";



export class MouCustCompanyDataObj {
    MouCustObj: MouCustObj;
    MouCustCompanyObj: MouCustCompanyObj;
    MouCustAddrLegalObj: MouCustAddrObj;
    MouCustAddrMailingObj: MouCustAddrObj;
    MouCustCompanyMgmntShrholderObjs: Array<MouCustCompanyMgmntShrholderObj>;
    MouCustCompanyContactPersonObjs: Array<MouCustPersonalContactPersonObj>;
    MouCustCompanyFinDataObj: MouCustCompanyFinDataObj;
    MouCustBankAccObjs: Array<MouCustBankAccObj>;
    MouCustCompanyLegalDocObjs: Array<MouCustCompanyLegalDocObj>;
    MouCustGrpObjs: Array<MouCustGrpObj>;
    RowVersion: string;

    constructor() { 
        this.MouCustObj = new MouCustObj(); 
        this.MouCustCompanyObj = new MouCustCompanyObj();
        this.MouCustAddrLegalObj = new MouCustAddrObj();
        this.MouCustAddrMailingObj = new MouCustAddrObj();
        this.MouCustCompanyFinDataObj = new MouCustCompanyFinDataObj();
        this.RowVersion = ""; 
    }
}
