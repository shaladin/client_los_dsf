export class ChangeMouCustConfirmCancelObj {
    Status: string;
    ChangeMouTrxId: number;
    WfTaskListId: number;
    RowVersion: string;
    TrxNo: string;

    ChangeMouCustConfirmCancelObj() {
        this.RowVersion = "";
    }
}