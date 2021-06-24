import { LeadCustSocmedObj } from "../../LeadCustSocmedObj.Model";
import { LeadCustAddrObj } from "./LeadCustAddrObj.model";
import { LeadCustObj } from "./LeadCustObj.model";
import { LeadCustPersonalFinDataObj } from "./LeadCustPersonalFinDataObj.model";
import { LeadCustPersonalJobDataObj } from "./LeadCustPersonalJobDataObj.model";
import { LeadCustPersonalObj } from "./LeadCustPersonalObj.model";

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