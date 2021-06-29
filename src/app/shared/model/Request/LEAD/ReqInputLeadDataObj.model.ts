import { LeadAppObj } from "./LeadAppObj.model";
import { LeadAssetObj } from "./LeadAssetObj.model";

export class ReqLeadInputLeadDataObj{
    LeadAppObj : LeadAppObj;
    LeadAssetObj : LeadAssetObj;
    WfTaskListId: number;
    RowVersion: string;
    IsKta: boolean;
    constructor() { 
        this.LeadAppObj = new LeadAppObj(); 
        this.LeadAssetObj = new LeadAssetObj();
        this.WfTaskListId = 0;
        this.RowVersion = ""; 
        this.IsKta = false;
    }
}