import { LeadAppObj } from "./LeadAppObj.Model";
import { LeadAssetObj } from "./LeadAssetObj.Model";

export class LeadInputLeadDataObj{
    LeadAppObj : LeadAppObj;
    LeadAssetObj : LeadAssetObj;
    RowVersion: any;

    constructor() { 
        this.LeadAppObj = new LeadAppObj(); 
        this.LeadAssetObj = new LeadAssetObj();
        this.RowVersion = ""; 
    }
}