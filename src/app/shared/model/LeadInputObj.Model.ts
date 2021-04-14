import { LeadCustObj } from "./LeadCustObj.Model";
import { LeadCustPersonalObj } from "./LeadCustPersonalObj.Model";
import { LeadCustAddrObj } from "./LeadCustAddrObj.Model";
import { LeadCustPersonalFinDataObj } from "./LeadCustPersonalFinDataObj.Model";
import { LeadCustPersonalJobDataObj } from "./LeadCustPersonalJobDataObj.Model";
import { LeadCustSocmedObj } from "./LeadCustSocmedObj.Model";

export class LeadInputObj{
    LeadCustObj: LeadCustObj;
    LeadCustPersonalObj: LeadCustPersonalObj;
    LeadCustLegalAddrObj: LeadCustAddrObj;
    LeadCustResidenceAddrObj: LeadCustAddrObj;
    LeadCustPersonalFinDataObj: LeadCustPersonalFinDataObj;
    LeadCustPersonalJobDataObj: LeadCustPersonalJobDataObj;
    LeadCustSocmedObj: any;
    WfTaskListId: string;
    RowVersion: string;

    constructor() { 
        this.LeadCustObj = new LeadCustObj(); 
        this.LeadCustPersonalObj = new LeadCustPersonalObj();
        this.LeadCustLegalAddrObj = new LeadCustAddrObj();
        this.LeadCustResidenceAddrObj = new LeadCustAddrObj();
        this.LeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
        this.LeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
        this.LeadCustSocmedObj = new Array();
        this.WfTaskListId= "";
        this.RowVersion = ""; 
    }
}