import { LeadCustObj } from "./request/lead/lead-cust-obj.model";
import { LeadCustPersonalObj } from "./request/lead/lead-cust-personal-obj.model";
import { LeadCustAddrObj } from "./request/lead/lead-cust-addr-obj.model";
import { LeadCustPersonalFinDataObj } from "./request/lead/lead-cust-personal-fin-data-obj.model";
import { LeadCustPersonalJobDataObj } from "./request/lead/lead-cust-personal-job-data-obj.model";
import { LeadCustSocmedObj } from "./request/lead/lead-cust-socmed-obj.model";

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