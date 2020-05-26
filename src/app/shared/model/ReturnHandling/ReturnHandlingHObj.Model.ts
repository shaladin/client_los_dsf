export class ReturnHandlingHObj {
    ReturnHandlingHId: number;
    AppId: number;
    AgrmntId: string;
    ReturnBy: string;
    ReturnDt: Date;
    ReturnNotes: string;
    ReturnFromTrxType: string;
    WfTaskListId: number;
    RowVersion: any;

    constructor() {
        this.RowVersion = ""; 
        this.ReturnHandlingHId = 0;
    }
}
