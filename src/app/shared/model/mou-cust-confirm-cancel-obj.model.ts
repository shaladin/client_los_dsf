export class MouCustConfirmCancelObj {
    MouStat: string;
    MouCustId: number;
    MouCustNo: string;
    WfTaskListId: number;
    RowVersion: string;

    MouCustConfirmCancelObj() {
        this.RowVersion = "";
    }
}