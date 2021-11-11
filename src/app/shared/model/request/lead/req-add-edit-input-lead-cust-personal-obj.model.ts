import { LeadCustSocmedObj } from "../../lead-cust-socmed-obj.model";
import { LeadCustAddrObj } from "./lead-cust-addr-obj.model";
import { LeadCustObj } from "./lead-cust-obj.model";
import { LeadCustPersonalFinDataObj } from "./lead-cust-personal-fin-data-obj.model";
import { LeadCustPersonalJobDataObj } from "./lead-cust-personal-job-data-obj.model";
import { LeadCustPersonalObj } from "./lead-cust-personal-obj.model";

export class ReqInputLeadCustPersonalObj{
    LeadCustObj: LeadCustObj;
    LeadCustPersonalObj: LeadCustPersonalObj;
    LeadCustLegalAddrObj: LeadCustAddrObj;
    LeadCustResidenceAddrObj: LeadCustAddrObj;
    LeadCustPersonalFinDataObj: LeadCustPersonalFinDataObj;
    LeadCustPersonalJobDataObj: LeadCustPersonalJobDataObj;
    LeadCustSocmedObj: Array<LeadCustSocmedObj>;
    WfTaskListId: number;
    RowVersion: string;

    constructor() { 
        this.LeadCustObj = new LeadCustObj(); 
        this.LeadCustPersonalObj = new LeadCustPersonalObj();
        this.LeadCustLegalAddrObj = new LeadCustAddrObj();
        this.LeadCustResidenceAddrObj = new LeadCustAddrObj();
        this.LeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
        this.LeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
        this.LeadCustSocmedObj = new Array<LeadCustSocmedObj>();
        this.WfTaskListId= 0;
        this.RowVersion = ""; 
    }
}