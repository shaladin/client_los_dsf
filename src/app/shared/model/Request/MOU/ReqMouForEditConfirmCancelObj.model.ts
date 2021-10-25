import { environment } from "environments/environment";
import { MouCancelObj } from "../../MouCancelObj.model";

export class ReqMouForEditConfirmCancelObj {
    MouStat: string;
    MouCustId: number;
    WfTaskListId: any;
    RowVersion: string;

    MouCustConfirmCancelObj() {
        this.WfTaskListId = environment.isCore ? "" : 0;
        this.RowVersion = "";
    }
}

export class ReqMouForEditConfirmCancelObjV2_1 {
    MouStat: string;
    WfTaskListId: any;
    ReqMouCancelObj: MouCancelObj;
    RowVersion: string;

    constructor() {
        this.MouStat = "";
        this.WfTaskListId = environment.isCore ? "" : 0;
        this.ReqMouCancelObj = new MouCancelObj();
        this.RowVersion = "";
    }
}