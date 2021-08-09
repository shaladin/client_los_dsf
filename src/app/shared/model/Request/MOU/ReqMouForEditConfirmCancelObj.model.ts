import { environment } from "environments/environment";

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