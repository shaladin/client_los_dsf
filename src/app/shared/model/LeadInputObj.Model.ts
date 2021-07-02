import { LeadCustObj } from "./Request/LEAD/LeadCustObj.model";
import { LeadCustPersonalObj } from "./Request/LEAD/LeadCustPersonalObj.model";
import { LeadCustAddrObj } from "./Request/LEAD/LeadCustAddrObj.model";
import { LeadCustPersonalFinDataObj } from "./Request/LEAD/LeadCustPersonalFinDataObj.model";
import { LeadCustPersonalJobDataObj } from "./Request/LEAD/LeadCustPersonalJobDataObj.model";
import { LeadCustSocmedObj } from "./Request/LEAD/LeadCustSocmedObj.model";

export class LeadInputObj {
    LeadCustObj: LeadCustObj;
    LeadCustPersonalObj: LeadCustPersonalObj;
    LeadCustLegalAddrObj: LeadCustAddrObj;
    LeadCustResidenceAddrObj: LeadCustAddrObj;
    LeadCustPersonalFinDataObj: LeadCustPersonalFinDataObj;
    LeadCustPersonalJobDataObj: LeadCustPersonalJobDataObj;
    LeadCustSocmedObj: Array<any>;
    WfTaskListId: number;
    RowVersion: string;
    Mode: string;

    constructor() {
        this.LeadCustObj = new LeadCustObj();
        this.LeadCustPersonalObj = new LeadCustPersonalObj();
        this.LeadCustLegalAddrObj = new LeadCustAddrObj();
        this.LeadCustResidenceAddrObj = new LeadCustAddrObj();
        this.LeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
        this.LeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
        this.LeadCustSocmedObj = new Array();
        this.WfTaskListId = 0;
        this.RowVersion = "";
    }
}