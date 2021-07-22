import { MouCustObj } from "./MouCustObj.Model";
import { MouCustPersonalObj } from "./MouCustPersonalObj.Model";
import { MouCustAddrObj } from "./MouCustAddrObj.Model";
import { MouCustPersonalFinDataObj } from "./MouCustPersonalFinDataObj.Model";
import { MouCustPersonalJobDataObj } from "./MouCustPersonalJobDataObj.Model";


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
    RowVersion: string;

    constructor() { 
        this.MouCustObj = new MouCustObj(); 
        this.MouCustPersonalObj = new MouCustPersonalObj();
        this.MouCustAddrLegalObj = new MouCustAddrObj();
        this.MouCustAddrResidenceObj = new MouCustAddrObj();
        this.MouCustAddrMailingObj = new MouCustAddrObj();
        this.MouCustPersonalFinDataObj = new MouCustPersonalFinDataObj();
        this.MouCustPersonalJobDataObj = new MouCustPersonalJobDataObj();
        this.RowVersion = ""; 
    }
}
