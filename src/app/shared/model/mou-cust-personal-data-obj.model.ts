import { MouCustObj } from "./mou-cust-obj.model";
import { MouCustPersonalObj } from "./mou-cust-personal-obj.model";
import { MouCustAddrObj } from "./mou-cust-addr-obj.model";
import { MouCustPersonalFinDataObj } from "./mou-cust-personal-fin-data-obj.model";
import { MouCustPersonalJobDataObj } from "./mou-cust-personal-job-data-obj.model";
import { MouCustCompanyFinDataAttrObj } from "./mou-cust-fin-data-attr-content-obj.model";


export class MouCustPersonalDataObj {
    MouCustObj: MouCustObj;
    MouCustPersonalObj: MouCustPersonalObj;
    MouCustAddrLegalObj: MouCustAddrObj;
    MouCustAddrResidenceObj: MouCustAddrObj;
    MouCustAddrMailingObj: MouCustAddrObj;
    MouCustPersonalContactPersonObjs: any;
    MouCustPersonalFinDataObj: MouCustPersonalFinDataObj;
    MouCustBankAccObjs: any;
    MouCustPersonalJobDataObj: MouCustPersonalJobDataObj;
    MouCustSocmedObjs: any;
    MouCustGrpObjs: any;
    MouCustFinDataAttrObjs: Array<MouCustCompanyFinDataAttrObj>;
    AttrGroups: Array<string>;
    RowVersion: string;

    constructor() { 
        this.MouCustObj = new MouCustObj(); 
        this.MouCustPersonalObj = new MouCustPersonalObj();
        this.MouCustAddrLegalObj = new MouCustAddrObj();
        this.MouCustAddrResidenceObj = new MouCustAddrObj();
        this.MouCustAddrMailingObj = new MouCustAddrObj();
        this.MouCustPersonalFinDataObj = new MouCustPersonalFinDataObj();
        this.MouCustPersonalJobDataObj = new MouCustPersonalJobDataObj();
        this.MouCustFinDataAttrObjs = new Array<MouCustCompanyFinDataAttrObj>();
        this.AttrGroups = new Array<string>();
        this.RowVersion = ""; 
    }
}
