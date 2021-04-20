import { LeadAppObj } from "./Request/LEAD/LeadAppObj.model";
import { LeadAssetObj } from "./Request/LEAD/LeadAssetObj.model";

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