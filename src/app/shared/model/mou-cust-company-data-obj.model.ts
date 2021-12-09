import { MouCustObj } from "./mou-cust-obj.model";
import { MouCustCompanyObj } from "./mou-cust-company-obj.model";
import { MouCustAddrObj } from "./mou-cust-addr-obj.model";
import { MouCustCompanyFinDataObj } from "./mou-cust-company-fin-data-obj.model";
import { MouCustCompanyMgmntShrholderObj } from "./mou-cust-company-mgmnt-shrholder-obj.model";
import { MouCustGrpObj } from "./mou-cust-grp-obj.model";
import { MouCustCompanyLegalDocObj } from "./mou-cust-company-legal-doc-obj.model";
import { MouCustBankAccObj } from "./mou-cust-bank-acc-obj.model";
import { MouCustPersonalContactPersonObj } from "./mou-cust-personal-contact-person-obj.model";
import { MouCustCompanyFinDataAttrObj } from "./mou-cust-fin-data-attr-content-obj.model";



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
    MouCustFinDataAttrObjs: Array<MouCustCompanyFinDataAttrObj>;
    AttrGroups: Array<string>;
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
