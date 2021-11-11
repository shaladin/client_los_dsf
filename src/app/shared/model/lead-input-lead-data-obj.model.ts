import { LeadAppObj } from "./request/lead/lead-app-obj.model";
import { LeadAssetObj } from "./request/lead/lead-asset-obj.model";

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