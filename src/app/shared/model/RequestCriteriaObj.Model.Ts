import { AdInsConstant } from "../AdInstConstant";
import { CriteriaObj } from "../model/CriteriaObj.model";
import { IntegrationObj } from "./library/IntegrationObj.model";

export class RequestCriteriaObj{
    includeCount:boolean;
    includeData:boolean;
    pageNo:number;
    rowPerPage:number;
    orderBy:any;
    criteria:CriteriaObj[];
    isLoading : boolean;
    queryString: string;
    integrationObj: IntegrationObj;
    joinType: string;
    
    constructor()
    {
        this.includeCount = true;
        this.includeData = true;
        this.isLoading = true;
        this.queryString = '';
        this.integrationObj = new IntegrationObj();
        this.joinType = AdInsConstant.JoinTypeInner;
    }
}