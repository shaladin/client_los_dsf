export class ChangeMouCustConfirmCancelObj {
    Status: string;
    ChangeMouTrxId: number;
    WfTaskListId: any;
    RowVersion: string;
    TrxNo: string;

    ChangeMouCustConfirmCancelObj() {
        this.RowVersion = "";
    }
}