import { AdInsConstant } from "../AdInstConstant";
import { CriteriaObj } from "./criteria-obj.model";
import { IntegrationObj } from "./library/integration-obj.model";

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