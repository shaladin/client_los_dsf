import { environment } from "environments/environment";
import { LeadAppObj } from "./lead-app-obj.model";
import { LeadAssetObj } from "./lead-asset-obj.model";

export class ReqLeadInputLeadDataObj{
    LeadAppObj : LeadAppObj;
    LeadAssetObj : LeadAssetObj;
    WfTaskListId: any;
    RowVersion: string;
    IsKta: boolean;
    constructor() { 
        this.LeadAppObj = new LeadAppObj(); 
        this.LeadAssetObj = new LeadAssetObj();
        this.WfTaskListId = environment.isCore ? "" : 0;
        this.RowVersion = ""; 
        this.IsKta = false;
    }
}