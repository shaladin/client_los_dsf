import { LeadAppObj } from "./LeadAppObj.Model";
import { LeadAssetObj } from "./LeadAssetObj.Model";

export class LeadInputLeadDataObj{
    LeadAppObj : LeadAppObj;
    LeadAssetObj : LeadAssetObj;
    WfTaskListId: any;
    RowVersion: any;
    // IsEdit : boolean;
    constructor() { 
        this.LeadAppObj = new LeadAppObj(); 
        this.LeadAssetObj = new LeadAssetObj();
        this.WfTaskListId = "";
        this.RowVersion = ""; 
    }
}