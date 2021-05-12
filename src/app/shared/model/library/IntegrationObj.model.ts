import { AdInsConstant } from "app/shared/AdInstConstant";

export class IntegrationObj {
    baseUrl: string;
    apiPath: string;
    requestObj: Object;
    leftColumnToJoin: string;
    rightColumnToJoin: string;
    joinType: string;
    
    constructor() {
        this.baseUrl = "";
        this.apiPath = "";
        this.requestObj = new Object();
        this.leftColumnToJoin = "";
        this.rightColumnToJoin = "";
        this.joinType = AdInsConstant.JoinTypeInner;
    }
}