import { CriteriaObj } from "../model/CriteriaObj.model";

export class RequestCriteriaObj{
    includeCount:boolean;
    includeData:boolean;
    pageNo:number;
    rowPerPage:number;
    orderBy:any;
    criteria:CriteriaObj[];
    isLoading : boolean;
    queryString: any;
    
    constructor()
    {
        this.includeCount = true;
        this.includeData = true;
        this.isLoading = true;
        this.queryString = '';
    }
}