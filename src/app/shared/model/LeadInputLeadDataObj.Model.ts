import { LeadAppObj } from "./LeadAppObj.Model";
import { LeadAssetObj } from "./LeadAssetObj.Model";

export class LeadInputLeadDataObj{
    LeadAppObj : LeadAppObj;
    LeadAssetObj : LeadAssetObj;
    WfTaskListId: number;
    RowVersion: string;
    constructor() { 
        this.LeadAppObj = new LeadAppObj(); 
        this.LeadAssetObj = new LeadAssetObj();
        this.WfTaskListId = 0;
        this.RowVersion = ""; 
    }
}