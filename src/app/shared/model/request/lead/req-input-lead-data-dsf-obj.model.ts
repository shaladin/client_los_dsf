import { environment } from "environments/environment";
import { LeadAppObj } from "./lead-app-obj.model";
import { LeadAssetObj } from "./lead-asset-obj.model";

export class ReqLeadInputLeadDataDsfObj{
    WfTaskListId: any;
    RowVersion: string;
    ReturnValue: string;
    constructor() { 
        this.WfTaskListId = environment.isCore ? "" : 0;
        this.RowVersion = "";
        this.ReturnValue = "";
    }
}