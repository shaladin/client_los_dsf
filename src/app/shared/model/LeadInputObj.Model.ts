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
    LeadCustSocmedObj: LeadCustSocmedObj;
    RowVersion: any;
}