import { environment } from "environments/environment";

export class ReqListMouCustLglReviewObj {
    MouCustLglReviewObjs = new Array();
    WfTaskListId : any;
    IsSubmit : boolean;

    constructor(){
        this.WfTaskListId = environment.isCore ? "" : 0;
        this.IsSubmit = false;
    }
}