export class MouCustConfirmCancelObj {
    MouStat: string;
    MouCustId: number;
    WfTaskListId: number;
    RowVersion: string;

    MouCustConfirmCancelObj() {
        this.RowVersion = "";
    }
}