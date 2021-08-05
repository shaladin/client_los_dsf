export class ReqMouForEditConfirmCancelObj {
    MouStat: string;
    MouCustId: number;
    WfTaskListId: number;
    RowVersion: string;

    MouCustConfirmCancelObj() {
        this.RowVersion = "";
    }
}

export class ReqMouForEditConfirmCancelV2Obj {
    MouStat: string;
    MouCustId: number;
    WfTaskListId: string;
    RowVersion: string;

    MouCustConfirmCancelObj() {
        this.RowVersion = "";
    }
}