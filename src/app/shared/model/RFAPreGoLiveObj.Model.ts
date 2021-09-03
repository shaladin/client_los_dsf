import { environment } from "environments/environment";

export class RFAPreGoLiveObj {
    TaskId: any;
    InstanceId: number;
    TaskListId: any;
    TransactionNo: string;
    Reason: string;
    WFCode: string;
    ListValue: any;
    ApprovedBy: number;
    Notes: string;
    RowVersion: string;
    RequestRFAObj: any;
    constructor() {
        this.TaskId = "";
        this.RowVersion = "";
        this.TaskListId = environment.isCore ? "" : 0;
    }
}  